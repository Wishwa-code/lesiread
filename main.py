# Import necessary modules
import csv
import json
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from werkzeug.utils import secure_filename
from functions.translations import translate_text
from functions.summarize import summarize_text
from functions.quizGeneration import process_pdf
from functions.QuestionAnswering import answer_question
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from botocore.exceptions import ClientError
from pymongo import MongoClient
from json import dumps
import pymongo
import argparse
import logging
import boto3
from botocore.exceptions import ClientError
from botocore.config import Config
import requests
from PyPDF2 import PdfReader
from flask_jwt_extended import JWTManager, create_access_token
from bson.objectid import ObjectId  # Import ObjectId
from bson.json_util import dumps 
from pymongo.errors import PyMongoError
import sys
print(sys.path)
import os
from dotenv import load_dotenv

load_dotenv()


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

logger = logging.getLogger(__name__)


# Replace with your AWS credentials from environment variables
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")

AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

BUCKET_NAME = 'pdfnew2'  # Replace with your S3 bucket name
region='eu-north-1'

#boto3.set_stream_logger('', level='DEBUG') 
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=region,
    config=Config(
        signature_version='s3v4',     # Explicitly set Signature Version 4
        s3={'addressing_style': 'virtual'}, # Required for newer regions
        retries={'max_attempts': 3},     # Retry failed requests up to 3 times
        connect_timeout=5,             # Timeout for initial connection (5 seconds)
        read_timeout=10                 # Timeout for reading response (10 seconds)
    )
)

# List all buckets (modify if you only need the specific bucket name)
for bucket in s3_client.list_buckets()['Buckets']:
    print(bucket['Name'])  # This will print the name of each bucket



# Retrieve MongoDB URL from environment variables
mongo_url="mongodb+srv://vishva2017087:ckGzmJoKMoXkeMuQ@cluster0.i62acyf.mongodb.net/lesiread"

if not mongo_url:
    raise EnvironmentError("MONGO_URL not found in environment variables.")

try:
    client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
    client.server_info()  # Attempt to connect and force a server call
    db = client.get_default_database()  # Get the default database
    print("database connected",db)
    app.logger.info("Successfully connected to MongoDB")
except ServerSelectionTimeoutError as e:
    app.logger.error("Database connection failed.", exc_info=True)
    raise e

ALLOWED_EXTENSIONS = {'pdf'}


# Define upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
USER_CREDENTIALS_FILE = 'user_credentials.csv'

# Global variable to store the currently viewed PDF
current_viewed_pdf = None

def upload_to_s3(file, filename):

    s3_client = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )

    try:
        s3_client.upload_fileobj(file, BUCKET_NAME, filename)
    except ClientError as e:
        raise e

def allowed_file(filename):
  return '.' in filename and \
         filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def serialize_document(document):
  serialized_data = {}
  for key, value in document.items():
      serialized_data[key] = value
  return serialized_data

def generate_presigned_url(s3_client, client_method, method_parameters, expires_in):
    """
    Generate a presigned Amazon S3 URL that can be used to perform an action.

    :param s3_client: A Boto3 Amazon S3 client.
    :param client_method: The name of the client method that the URL performs.
    :param method_parameters: The parameters of the specified client method.
    :param expires_in: The number of seconds the presigned URL is valid for.
    :return: The presigned URL.
    """
    try:
        url = s3_client.generate_presigned_url(
            ClientMethod=client_method, Params=method_parameters, ExpiresIn=expires_in
        )
        logger.info("Got presigned URL: %s", url)
    except ClientError:
        logger.exception(
            "Couldn't get a presigned URL for client method '%s'.", client_method
        )
        raise
    return url

# Endpoint for user sign up
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')


    if not username or not email or not password:
            return jsonify({"error": "Missing fields"}), 400

    user_collection = db['users']
    if user_collection.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    user_id = user_collection.insert_one({
        "name": username,
        "email": email,
        "password": password,  # Store the password as provided
        }).inserted_id
    print(user_id)
    return jsonify({"message": "User registered successfully", "user_id": str(user_id)}), 201




    # Check if username already exists
    #with open(USER_CREDENTIALS_FILE, 'r') as file:
        #reader = csv.reader(file)
        #for row in reader:
            #if row[0] == username:
                #return jsonify({'error': 'Username already exists'}), 400

    # Append new user to the file
    #with open(USER_CREDENTIALS_FILE, 'a') as file:
        #writer = csv.writer(file)
        #writer.writerow([username, password])

    #return jsonify({'message': 'User registered successfully'})

# Endpoint for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Assuming you have the ObjectId stored in a variable
    object_id_string = "64a1f9e8033745c0e9421f6a"  # Example ObjectId string
    object_id = ObjectId(object_id_string)  # Convert string to ObjectId

    
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user_collection = db['users']
    user = user_collection.find_one({"email": email, "password": password})  # Check if user exists with provided email and password
    if user:
        object_id = str(user["_id"])
        print(object_id)
        return jsonify({'object_id':object_id}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# Endpoint for file download
@app.route('/uploads/<filename>', methods=['GET'])
def download_file(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename), as_attachment=True)

@app.route('/updatepage', methods=['PUT'])
def update_page():
    try:
        update_data = request.get_json()
        print(update_data)
        
        filename = update_data['filename']
        current_page = update_data['currentPage']
        print(filename)
        
        collection = db["docs"]
        collection.update_one(
                    {"filename": filename},
                    {"$set": {"current_page": current_page}}
                )
        return jsonify({"message": "Your progress status updated successfully"}),200
        
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500

# Endpoint to get the list of uploaded files
@app.route('/getUploadedFiles', methods=['GET'])
def get_uploaded_files():
    try:
        uploaded_files = [{'name': file, 'url': f'/uploads/{file}'} for file in os.listdir(app.config['UPLOAD_FOLDER'])]
        return jsonify(uploaded_files)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/getdocuments', methods=['GET'])
def get_documents():
    userId = request.args.get('userId')
    num_records = request.args.get('numRecords', type=int)  # Default to 5 if not provided
    
    print(userId,num_records)

    if userId is None:
        return jsonify({"error": "User ID not provided"}), 400

    try:
        # Query MongoDB
        collection = db["docs"]
        documents = collection.find({"user_id": userId}).limit(num_records)  # Fetch first 'num_records'
        
        if not documents:
            print(documents)
            return jsonify({"message": "No documents found for this user"}), 404

        # Serialize documents into JSON and convert ObjectIds
        file_list = []
        for doc in documents:
            doc['_id'] = str(doc['_id'])  # Convert ObjectId to string
            file_list.append({
                "id":doc["_id"],
                "user_id":doc["user_id"],
                "name": doc["filename"],
                "link": doc.get("link", ""),  # Handle case if "link" is missing
                "current_page": doc.get("current_page", 1),
                "total_page_count": doc.get("total_page_count", 1),
                "presigned_url":doc["presigned_url"]
            })
        print("users ge seram files",file_list)
    
    except PyMongoError as e:
        print(f"MongoDB error: {e}") 
        return jsonify({"error": "Database error"}), 500  
    except Exception as e:  
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An error occurred"}), 500 

    return jsonify({'files': file_list}), 200
    
@app.route('/upload-document', methods=['POST'])
def upload_document():
    
    userId = request.args.get('userId')  # Get userId from query parameter    
    if userId is None:
            print(userId)
            return jsonify({"error": "User ID not provided"}), 400
    
    if 'document' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['document']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        try:
            # Calculate page count before uploading to S3
            file.seek(0)
            pdf_reader = PdfReader(file)
            total_page_count = len(pdf_reader.pages)
            print(total_page_count)

            # Reset file pointer for S3 upload
            file.seek(0)
                
            # Upload the file to S3
            filename = secure_filename(file.filename)
            upload_to_s3(file, filename)

            s3_object_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{filename}"

            # Get current_page and total_page_count (adjust if needed)
            current_page = int(request.form.get('current_page', 1))
            

            # Generate presigned URL for immediate access
            presigned_url = generate_presigned_url(s3_client, 'get_object', {"Bucket": BUCKET_NAME, "Key": filename}, 3600)
            print(presigned_url)

            # Store information in MongoDB (including the presigned URL)
            collection = db["docs"]
            
            existing_document = collection.find_one({"filename": filename})
            if existing_document:
                return jsonify({"error": "Document already exists"}), 400
            
            document_id = collection.insert_one({
                "user_id" : userId,
                "filename" : filename,
                "link": s3_object_url,
                "current_page": current_page,
                "total_page_count": total_page_count,
                "presigned_url": presigned_url  
            }).inserted_id
            
            
            
            document = collection.find_one({"filename": filename})  # Check if user exists with provided email and passworddd
            if document:
                object_id = str(document["_id"])
                print(object_id)
                json_document = dumps(document)
                response = jsonify({'message': 'Document uploaded successfully!', 'document': json.loads(json_document)})
                response.headers['Content-Type'] = 'application/json'
                return response, 201   
            else:
                print("not good")

        except ClientError as e:
            print(f"S3 Error: {e}")
            return jsonify({'error': 'Error uploading file to S3'}), 500
        except Exception as e:
            print(f"An error occurred: {e}")
            return jsonify({'error': 'Internal server error'}), 500

    else:
        return jsonify({'error': 'Invalid file format. Only PDF allowed'}), 400

# Endpoint for file upload
@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file:
            filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filename)
            return jsonify({'message': 'File uploaded successfully', 'filename': file.filename})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint for text translation
@app.route('/translate', methods=['POST'])
def translate_handler():
    try:
        data = request.get_json()
        translation_result = translate_text(data)
        return jsonify(translation_result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint for text summarization
@app.route('/summarize', methods=['POST'])
def summarize_handler():
    try:
        data = request.get_json()
        summary_result = summarize_text(data['text'])
        return jsonify(summary_result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to set the currently viewed PDF
@app.route('/setCurrentlyViewedPDF', methods=['POST'])
def set_currently_viewed_pdf():
    try:
        data = request.get_json()
        global current_viewed_pdf
        # Extract file path from request data
        file_path = data.get('filepath')
        # Extract file name from file path
        file_name = os.path.basename(file_path)
        # Set current_viewed_pdf to the full path of the uploaded PDF
        current_viewed_pdf = "uploads/" + file_name
        return jsonify({'message': 'Currently viewed PDF set successfully', 'filename': current_viewed_pdf})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint for generating quiz questions
@app.route('/generateQuiz', methods=['GET'])
def generate_quiz():
    global current_viewed_pdf
    # Process the currently viewed PDF to generate quiz questions
    question, options, correct_answer = process_pdf(current_viewed_pdf)
    quiz_data = [question, options, correct_answer]
    return jsonify(quiz_data)

# Endpoint for generating answers to quiz questions
@app.route('/generateAnswer', methods=['POST'])
def generate_answer():
    try:
        global current_viewed_pdf
        data = request.get_json()
        original_text = data['question']
        input_language = data['input_lan']
        # Translate the original question to English
        translation_result = translate_text({'text': original_text, 'target_language': 'en'})
        
        if current_viewed_pdf is None:
            return jsonify({'error': 'No PDF file set for processing'}), 400
        
        question = translation_result['translation']
        # Generate an answer to the translated question using PDF contents
        answer = answer_question(question, current_viewed_pdf)
        return jsonify(answer)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the Flask application using the built-in server
    app.run(host="0.0.0.0", port=8483, debug=False)



# pip install flask flask_cors deep_translator transformers sentencepiece pdfplumber nltk datasets pdfminer.six spacy Pillow
