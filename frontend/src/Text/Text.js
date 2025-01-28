import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import axios from "axios";
import "./text.css"; // Import the CSS file
import { BACKEND_ADDRESS } from '../config';  // Import the backend address

const Text = () => {
  const [userInput, setUserInput] = useState('');
  const [translation, setTranslation] = useState('');
  const [summary, setSummary] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeContent, setActiveContent] = useState(''); // Track active content type

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleTranslateButton = async () => {
    setShowModal(true);
    setActiveContent('translation'); // Set active content type
  };

  const handleSummarizeButton = async () => {
    try {
      const response = await axios.post(`${BACKEND_ADDRESS}/summarize`, {
        text: userInput,
      });

      setSummary(response.data.summary);
      setActiveContent('summary'); // Set active content type
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTranslationOption = async (language) => {
    try {
      const response = await axios.post(`${BACKEND_ADDRESS}/translate`, {
        text: userInput,
        target_language: language,
      });

      setTranslation(response.data.translation);
      setActiveContent('translation'); // Set active content type
    } 
    catch (error) {
      console.error('Error translating text:', error);
    }

    setShowModal(false);
  };

  return (
    <div className="form1">
      <div className="mx-auto custom-width mb-3 mt-2">
        <Form.Group controlId="userInput" className="mb-3">
          {/*<Form.Label>Enter Text Below</Form.Label>*/}
          <Form.Control
            as="textarea"
            rows={19}
            value={userInput}
            onChange={handleUserInputChange}
            style={{ borderRadius: '20px' }} // Adding border radius
          />
        </Form.Group>
      </div>


      {/* Paragraph Action Buttons */}
      <Row className="mb-3">
        <Col></Col>
        <Col>
          <Button className="button2" variant="primary" onClick={handleTranslateButton}>
            Translate Paragraph
          </Button>
          <Button className="button2" variant="info" onClick={handleSummarizeButton}>
            Summarize Text
          </Button>
        </Col>
        <Col></Col>
      </Row>

      {/* Translation Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Translation Option</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="primary" onClick={() => handleTranslationOption('si')}>
            Translate from English to Sinhala
          </Button>
          <Button variant="primary" onClick={() => handleTranslationOption('ta')}>
            Translate from English to Tamil
          </Button>
        </Modal.Body>
      </Modal>

      {/* Display Content */}
      {activeContent === 'translation' && translation && (
        <Container className="mt-3">
          <h5>Result</h5>
          <p className="translated-text">{translation}</p>
        </Container>
      )}

      {activeContent === 'summary' && summary && (
        <Container className="mt-3">
          <h5>Summary</h5>
          <p className="translated-text">{summary}</p>
        </Container>
      )}
    </div>
  );
};

export default Text;
