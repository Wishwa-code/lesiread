import React from 'react'
import './form.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {useState, useEffect, useRef} from 'react'
import {Viewer} from '@react-pdf-viewer/core'
import { Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import axios from "axios";
import { BACKEND_ADDRESS } from '../config';
import {ListGroup, Button ,Modal,ProgressBar, Container} from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ToastContainer, toast } from 'react-toastify';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { pageNavigationPlugin, PageNavigationPluginOnPageChangeEvent } from '@react-pdf-viewer/page-navigation';




function PDFViewer(){

  const [pdfFile, setPDFFile] = useState(null)
  const [viewPDF, setViewPdf] = useState(null)
  const pdfViewerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [baruploading, setisbaruploading] = useState(false);
  const [totalBytes, setTotalBytes] = useState(0);
  const [loadedBytes, setLoadedBytes] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedWord, setSelectedWord] = useState("");
  const [numPages, setNumPages] = useState(1);
  const [pageHeight, setPageHeight ] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [definition, setDefinition] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [highestScrolledPage, setHighestScrolledPage] = useState(1);
  const [readingProgress, setReadingProgress] = useState(0);
  const [objectId, setObjectId] = useState(null);
  const pageRefs = useRef([]);
  const [filename,setfilename] = useState('');
  const [showFileList, setShowFileList] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [numRecords, setNumRecords ] = useState(1);
  const [showUploadArea, setShowUploadArea] = useState(true);
  const [showNotesPanel, setShowNotesPanel] = useState(false);

  const newplugin = defaultLayoutPlugin()

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { CurrentPageInput, GoToNextPage, GoToPreviousPage } = pageNavigationPluginInstance;

  const handlePageChange = (e) => {
    setHighestScrolledPage(Math.max(highestScrolledPage, e.currentPage));
  };


  const onItemClick = ({ numPages }) => {
    pageRefs.current[numPages - 1].scrollIntoView({ behavior: 'smooth' });
    console.log("badu weda")
  };

  useEffect(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      // Or, set as string for other uses
      setObjectId(userInfo.object_id); 
      console.log("meka user ID",objectId,uploadedFiles)

    } else {
      console.log('User info not found in local storage');
    }
  }, [objectId]);

  const fileType = ['application/pdf']
  const handleChange = async (e) => {

    try {

      if (filename) {
        console.log(filename);
      } else {
        console.log('this is the first render'); // Or handle accordingly
      }

      const response = await axios.put(`${BACKEND_ADDRESS}/updatepage`, {
          filename: filename,
          currentPage: highestScrolledPage,
      });

      if (response.status === 200) {
        console.log('success')
      } else {
        console.error('Failed to update transaction status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating transaction status:', error);
    }

    let selectedFile = e.target.files[0]
    setViewPdf(null)
    console.log(selectedFile)
    if (selectedFile) {
      if(selectedFile && fileType.includes(selectedFile.type)){
        try {
          const formData = new FormData();
          formData.append('document', selectedFile);

          const response = await axios.post(`${BACKEND_ADDRESS}/upload-document`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            params: { 
              userId: objectId  // Send userId as a query parameter
            },
            onUploadProgress: (progressEvent) => {
              setisbaruploading(true); // Indicate that the upload has started
              if (progressEvent.total) {
                setTotalBytes(progressEvent.total);
                const progressPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setLoadingProgress(progressPercent); // Update loading progress percentage
              }
              setLoadedBytes(progressEvent.loaded);
            }
            
          });

          if (response.status === 201) {
            setfilename(response.data.document.filename)
            setNumPages(response.data.document.total_page_count);
            setHighestScrolledPage(response.data.document.current_page);
            console.log('Document uploaded successfully:', selectedFile);
            setPDFFile(response.data.document.presigned_url);
            setViewPdf(pdfFile)
            
            
              
          } else {
            setErrorMessage(response.data.error || 'Failed to upload document');
            console.error('Error:', response.data);
          }
        } catch (error) {
          setErrorMessage(error.response?.data?.error || 'Error uploading document');
          console.error('Error:', error);
        } finally {
          setIsLoading(false); // Hide loading indicator
        }
        setisbaruploading(false);
        
      }
      else{
        setPDFFile(null)
      }
    }
    else{
      console.log("please select")
    }
  }

  {/*const handlePageChange = (pageNumber) => {
    const realpageNumber = pageNumber.currentPage;
    if (numPages > 0) { // Only update if numPages is valid
      setHighestScrolledPage(Math.max(highestScrolledPage, realpageNumber));
    }
  };*/}

  useEffect(() => {
    if (viewPDF && numPages > 0) {
      const progress = Math.round((highestScrolledPage / numPages) * 100);
      setReadingProgress(progress);
    }
  }, [highestScrolledPage, numPages, viewPDF]); // Depend on all relevant values


  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection.isCollapsed) { // Check if there's actual selected text
        const selectedText = selection.toString();
        // Call your function to handle the selected text
        handleSelectedText(selectedText); 
      }
    };

    const pdfViewerElement = pdfViewerRef.current;
    if (pdfViewerElement) {
      pdfViewerElement.addEventListener("mouseup", handleSelection);

      // Cleanup: Remove the event listener when the component unmounts
      return () => {
        pdfViewerElement.removeEventListener("mouseup", handleSelection);
      };
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleSelectedText = (text) => {
    // Your custom function to handle the selected text
    console.log("Selected text:", text);
    if (text) {
      setSelectedWord(text);
    }
    // ... do something with the text ...
  };

  const handleDocumentLoad = (e) => {
    console.log(`Number of pages: ${e.numPages}`);
};

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleDefine = async () => {
    if (selectedWord) {
      try {
        const response = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en_US/${selectedWord}`
        );

        const meanings = response.data[0]?.meanings;

        if (meanings && meanings.length > 0) {
          const definition = meanings[0]?.definitions[0]?.definition;
          setDefinition(definition);
          console.log(definition)
          toggleModal();
        } else {
          console.log(`Definition not found for ${selectedWord}.`);
        }
      } catch (error) {
        console.error("Error fetching definition:", error);
      }
    } else {
      console.log("No word selected to define.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    if(pdfFile !== null) {
      setViewPdf(pdfFile)
    }
    else{
      setViewPdf(null)
    }
  }

  const handleToggleFileList = (file) => {
    setShowFileList(!showFileList);
  };

  

  const handleTogglepdfview = async (file) => {

    try {
      console.log(file)
      if (file.name) {
        console.log(file.name);
      } else {
        console.log('file name ekak nahhh'); // Or handle accordingly
      }

      const response = await axios.put(`${BACKEND_ADDRESS}/updatepage`, {
          filename: file.name,
          currentPage: file.current_page,
      });

      if (response.status === 200) {
        console.log('success')
      } else {
        console.error('Failed to update transaction status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating transaction status:', error);
    }
    
    console.log("filelist",file.presigned_url)
    setPDFFile(file.presigned_url);
    setfilename(file.filename)
    setNumPages(file.total_page_count);
    setHighestScrolledPage(file.current_page);
    console.log('Document uploaded successfully:', selectedFile);
  

    if(pdfFile !== null) {
      setViewPdf(pdfFile)
      console.log("pdffile khyna ela",pdfFile)
    }
    else{
      setViewPdf(null)
    }
  }

  useEffect(() => {
    let isMounted = true; // Track component mount state
    const controller = new AbortController();
  
    const fetchFiles = async () => {
      if (showFileList && !isLoading) {
        setIsLoading(true);
        try {
          console.log("making a call",numRecords)
          const response = await fetch(
            `${BACKEND_ADDRESS}/getdocuments?userId=${objectId}&numRecords=${numRecords}`
          );
          if (response.ok) {
            const data = await response.json();
            console.log("response",data); 
  
            if (isMounted) {  // Update state only if component is mounted
              setUploadedFiles(data.files); 
              setIsLoading(false);
            }
          } else {
            console.error("Error fetching files:", response.status);
            if (isMounted) setIsLoading(false); // Reset loading state on error
          }
        } catch (error) {
          console.error("Network error:", error);
          if (isMounted) setIsLoading(false); // Reset loading state on error
        }
      }
    };
  
    fetchFiles();
  
    return () => {
      isMounted = false; // Cleanup on unmount
      controller.abort(); // Abort ongoing fetch on unmount
    };
  
  }, [showFileList]);

  const handleNotesButtonClick = () => {
    setShowNotesPanel(!showNotesPanel);
  };

  const [glossary, setGlossary] = useState([]);

  const handleAddToGlossary = () => {
    console.log("ava")
    if (selectedWord) {
      setGlossary((prevGlossary) => [...prevGlossary, selectedWord]);
      toast.success(`"${selectedWord}" Added To Glossary`, {
        position: 'top-right',
      });
      setSelectedWord('');
    }
    else{
      toast.error(`No Word Selected To Add to Glossary!`, {
        position: 'top-right',
      });
    }
  };

  const [showGlossaryModal, setShowGlossaryModal] = useState(false);
  const [glossaryWithDefinitions, setGlossaryWithDefinitions] = useState([]);
  const [notes, setNotes] = useState({});
  const [selectedNotes, setSelectedNotes] = useState("");

  const handleViewGlossary = async () => {
    setShowGlossaryModal(!showGlossaryModal);

    const glossaryWithDefinitions = await Promise.all(
      glossary.map(async (word) => {
        const definition = await getDefinition(word);
        return { word, definition };
      })
    );

    setGlossaryWithDefinitions(glossaryWithDefinitions);
  };

  const getDefinition = async (word) => {
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`
      );
      const meanings = response.data[0]?.meanings;

      if (meanings && meanings.length > 0) {
        return meanings[0]?.definitions[0]?.definition;
      } else {
        console.log(`Definition not found for ${word}.`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching definition:", error);
      return null;
    }
  };

  const getNotesForCurrentPDF = () => {
    const pdfKey = selectedFile ? selectedFile.name : null;
    return notes[pdfKey] || '';
  };

  const handleNotesChange = (event) => {
    const pdfKey = selectedFile ? selectedFile.name : null;
    const newNotes = event.target.value;
    setNotes((prevNotes) => ({
      ...prevNotes,
      [pdfKey]: newNotes,
    }));
    setSelectedNotes(newNotes);
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  useEffect(() => {
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  const [showQuizContainer, setShowQuizContainer] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [numCorrectAnswers, setNumCorrectAnswers] = useState(0); // New state variable to track the number of correct answers
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [showQAContainer, setShowQAContainer] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedLanguageDropdown, setSelectedLanguageDropdown] = useState('English');
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language
  const [answer, setAnswer] = useState('');
  const [userInput, setUserInput] = useState('');

  const generateQuiz = async () => {
    try {
      setShowQuizContainer(true);
      setCurrentQuestionIndex(0)
      setNumCorrectAnswers(0)
      const response = await axios.get(`${BACKEND_ADDRESS}/generateQuiz`);
      setQuizQuestions(response.data);
      console.log("Meka: ", quizQuestions, correctAnswer)
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };  
  
  const generateQA = async () => {
    try {
      setShowQAContainer(true);

    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < 10) {
      if (selectedOption === correctAnswer) {
        setNumCorrectAnswers(prevCount => prevCount + 1); // Increment the count of correct answers
        console.log("YayySelected: ", selectedOption, "  Correct: ", correctAnswer)
      } else {
        console.log("NooSelected: ", selectedOption, "  Correct: ", correctAnswer)
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      console.log(currentQuestionIndex)
      const response = await axios.get(`${BACKEND_ADDRESS}/generateQuiz`);
      setQuizQuestions(response.data);
    } else {
      console.log(currentQuestionIndex, "DONEE")
      console.log("Number of correct answers:", numCorrectAnswers);
    }
  };

  const handleHideQuizContainer = () => {
    setShowQuizContainer(false);
  }; 
  const handleHideQAContainer = () => {
    setShowQAContainer(false);
  };

    // Modify the handleLanguageChange function to update selectedLanguageDropdown
    const handleLanguageChange = (event) => {
      const selectedValue = event.target.value;
      setSelectedLanguageDropdown(selectedValue); // Update the selected language in the dropdown
      // You can optionally set selectedLanguage here if needed
      if(selectedValue === "English") {
        setSelectedLanguage("en");
      } else if(selectedValue === "Sinhala") {
        setSelectedLanguage("si");
      } else if(selectedValue === "Tamil") {
        setSelectedLanguage("ta");
      }
    };

    const handleGenerateAnswer  = async() => {
      try {
        const response = await axios.post(`${BACKEND_ADDRESS}/generateAnswer`, {
          question: userInput,
          input_lan:selectedLanguage
        });
  
        setAnswer(response.data);
      } 
      catch (error) {
        console.error('Error translating text:', error);
      }
      // Here you can generate the answer based on the userInput
      // For demonstration purposes, I'm just setting a dummy answer
    };

    const handleInputChange = (e) => {
      setUserInput(e.target.value);
    };

    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
      // Reset timer when pdfUrl changes
      setElapsedTime(0);
  
      const interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000); // Increment every second
  
      return () => clearInterval(interval); // Clean up interval
    }, [pdfUrl]); // Only re-run effect when pdfUrl changes

    const formatTime = (timeInSeconds) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };


    return(
      <div className="form1">
        <Container>
          <Row>
            <Col xs={2}>
              <Button className="hidebuttons" variant="secondary" onClick={() => setShowUploadArea(!showUploadArea)}>
                  {showUploadArea ? "Hide Upload Area" : "Show Upload Area"}
              </Button>
              <div><br /></div>
              <Button className="hidebuttons" variant="secondary" onClick={handleToggleFileList}>
                  {showFileList ? "Hide File List" : "Show File List"}
              </Button>
              {showFileList && (
                <>
                  <div><br /></div>
                  <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        value={numRecords}
                        onChange={(e) => setNumRecords(e.target.value)}
                        style={{width:'25%'}}
                        className='mx-auto mb-4'
                      />
                  <ListGroup style={{ width: '100%' }}>
                    {uploadedFiles ? ( // Check if uploadedFiles is defined and has items
                      uploadedFiles.map((file, index) => (
                        <ListGroup.Item key={index} className="d-flex flex-column align-items-center">
                          <div className="w-100 text-truncate mb-2">{file.name}</div>
                          <Button variant="secondary" onClick={() => handleTogglepdfview(file)}>
                            View
                          </Button>
                        </ListGroup.Item>
                      ))
                    ):("no files uploaded") }
                  </ListGroup>
                </>
              )} 
              </Col>
              <Col xs={8}>
                {baruploading && (
                  <ProgressBar className='my-4 mx-4' now={loadingProgress} label={`${loadingProgress}%`} />
                )} 
                
                {showUploadArea && (
                  <div className="sub-container">
                    <form onSubmit={handleSubmit}>
                        <p>Choose a PDF file</p>
                        <Form.Label></Form.Label>
                        <input type = 'file' className='form-control' onChange={handleChange}/>
                        <br></br>
                        <Button variant="primary" type='submit' >
                          Upload
                        </Button>
                    </form>
                  </div>
                )}
                {viewPDF && (
                  <div>
                      {/*<div>Reading Progress: {readingProgress}%</div>*/}
                      <ProgressBar className='my-4 mx-4' now={readingProgress} label={`${readingProgress}%`} />
                  </div>
                )}
                <div>{viewPDF && <p>Reading Time: {formatTime(elapsedTime)}</p>}</div>
            
              <div className='pdf-container' ref={pdfViewerRef}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    {viewPDF && (
                      <>
                        
                        <Viewer 
                          fileUrl={pdfFile} 
                          plugins={[pageNavigationPluginInstance]}
                          onPageChange={handlePageChange}
                          onDocumentLoadSuccess={({ numPages }) => {
                            setHighestScrolledPage(1); // Reset for new document
                          }}
                          onPageClick={onItemClick}
                          initialPage={highestScrolledPage}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems:'center', marginBottom: '1rem', marginTop:'20px'}}>
                          <GoToPreviousPage>
                            {(props) => (
                              <button 
                              onClick={props.onClick} 
                              disabled={props.isDisabled} 
                              className="custom-button next-button"
                              style={{ 
                                width: '150px' , 
                                marginRight:'10px', 
                                backgroundColor: props.isDisabled ? '#ccc' : '#007bff',
                                borderRadius:'7px',
                                color: 'white',
                                cursor: props.isDisabled ? 'not-allowed' : 'pointer',
                                padding: '8px 16px',
                                margin: '0 5px',
                                
                              }}
                              >
                                Previous
                              </button>
                            )}
                          </GoToPreviousPage>
                          <CurrentPageInput />
                          <GoToNextPage>
                            {(props) => (
                              <button  
                              onClick={props.onClick} 
                              disabled={props.isDisabled}
                              className="custom-button next-button"
                              style={{ 
                                width: '150px' , 
                                marginRight:'10px', 
                                backgroundColor: props.isDisabled ? '#ccc' : '#007bff',
                                borderRadius:'7px',
                                color: 'white',
                                cursor: props.isDisabled ? 'not-allowed' : 'pointer',
                                padding: '8px 16px',
                                margin: '0 5px',
                                
                              }}
                              >
                                Next
                              </button>
                            )}
                          </GoToNextPage>
                        </div>
                      </>
                    )}
                    {!viewPDF && <>No PDF</>}
                  </Worker>
                 
                
                
              </div>

            </Col>
            </Row>
            </Container>
        
        <div className="allbuttons">
          <div className="mb-3">
            <Button variant="primary" onClick={handleDefine} className="mx-2" style={{ width: '150px' , marginRight:'10px' , marginTop:'10px'}}>
              Define
            </Button>
            <button className="notes-button mx-2" onClick={handleNotesButtonClick} style={{ width: '150px' , marginRight:'10px' , marginTop:'10px' }}>
              Notes
            </button>
            <Button variant="success" onClick={handleAddToGlossary} className="mx-2" style={{ width: '150px' , marginRight:'10px', marginTop:'10px' }}>
              Add To Glossary
            </Button>
            <Button variant="info" onClick={handleViewGlossary} className="mx-2" style={{ width: '150px' , marginRight:'10px' , marginTop:'10px'}}>
              View Glossary
            </Button>
            {showNotesPanel && (
              <div className="notes-panel">
                <textarea
                  placeholder="Enter your notes here..."
                  value={getNotesForCurrentPDF()}
                  onChange={handleNotesChange}
                />
              </div>
            )}

          </div>
        
          <Modal show={showModal} onHide={toggleModal}>
            <Modal.Header closeButton>
              <Modal.Title>Definition</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedWord ? (
                <p>
                  <strong>{selectedWord}:</strong> {definition}
                </p>
              ) : (
                <p>No word selected.</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={toggleModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showGlossaryModal} onHide={handleViewGlossary}>
            <Modal.Header closeButton>
              <Modal.Title>Glossary</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {glossaryWithDefinitions.length > 0 ? (
                <ul>
                  {glossaryWithDefinitions.map((item, index) => (
                    <li key={index}>
                      <strong>{item.word}:</strong>{" "}
                      {item.definition ? item.definition : "Definition not found"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No words in the glossary.</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleViewGlossary}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Col>
            <Button variant="primary" onClick={generateQuiz} className="mx-2" style={{  marginTop:'10px', width:'140px'}} >
              Generate Quiz
            </Button>
            <Button variant="primary" onClick={generateQA} className="mx-2" style={{  marginTop:'10px', width:'140px' }}>
              Ask Question
            </Button>
          </Col>
          
          </div>
          {showQuizContainer && (
            <Container className="quiz-container">
              {quizQuestions.length > 0 && currentQuestionIndex < 10 ? (
                <div>
                  <h3>Quiz Questions</h3>
                  <br></br>
                  <h5 style={{ fontWeight: 'bold' }}>{quizQuestions[0]}</h5>
                  <hr></hr>
                  {quizQuestions[1].map((option, index) => (
                    <Row key={index} className="mb-2">
                      <Col>{option}<hr></hr></Col>
                      <Col xs="auto">
                        <Form.Check
                          type="radio"
                          label=""
                          name={`question_${quizQuestions[0]}`}
                          value={option}
                          onChange={handleOptionChange}
                          inline
                        />
                      </Col>
                    </Row>
                  ))}
                </div>
              ) : (
                <div>
                  <h3>Quiz Completed</h3>
                  <br />
                  <h5>Your Score: {numCorrectAnswers} out of 10</h5>
                  <Col xs="auto">
                      <Button variant="secondary" onClick={handleHideQuizContainer}>
                        Hide Quiz
                      </Button>
                    </Col>
                </div>
              )}
              {currentQuestionIndex < 10 && (
                <div className="quiz-controls">
                  <Row>
                    <Col xs="auto">
                      <Button variant="secondary" onClick={handleHideQuizContainer}>
                        Hide Quiz
                      </Button>
                    </Col>
                    <Col className="text-end">
                      <Button variant="primary" onClick={handleNextQuestion}>
                        Next Question
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}
              </Container>
              )}

            {showQAContainer && (
                    <Container className="quiz-container">
                      <Form.Group controlId="languageSelect">
                        <Form.Label>Choose a language:</Form.Label>
                        <Form.Control className="language-select" as="select" value={selectedLanguageDropdown} onChange={handleLanguageChange}>
                          <option value="English">English</option>
                          <option value="Sinhala">Sinhala</option>
                          <option value="Tamil">Tamil</option>
                        </Form.Control>
                      </Form.Group>
                      <br></br>
                      <br></br>
                      <Form.Control className="placeholder-color" type="text" value={userInput} onChange={handleInputChange} placeholder="Enter your input" />
                      <br />
                      {answer && <p>{answer}</p>}
                      <br />
                      <div className="quiz-controls">
                        <Row>
                          <Col xs="auto">
                            <Button variant="secondary" onClick={handleHideQAContainer}>
                              Hide QA
                            </Button>
                          </Col>
                          <Col className="text-end">
                            <Button variant="primary" onClick={handleGenerateAnswer}>
                              Generate Answer
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Container>
                  )}

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </div>
        
    )

}

export default PDFViewer