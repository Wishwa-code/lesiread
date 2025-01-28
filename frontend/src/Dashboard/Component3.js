// Component3.js
import React, { useEffect, useState } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from 'react-datepicker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import component3Styles from './component3Styles';  // Import the styles object
import 'react-datepicker/dist/react-datepicker.css';
import './goals.css'

const Component3 = () => {
  const [goal, setGoal] = useState('');
  const [targetDateTime, setTargetDateTime] = useState(null);
  const [goals, setGoals] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const storedProgress = localStorage.getItem('progress');
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }
  }, []);

  const saveGoalsToLocalStorage = (newGoals) => {
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
  };

  const handleDateTimeChange = (dateTime) => {
    setTargetDateTime(dateTime);
  };

  const handleAddGoal = () => {
    if (goal && targetDateTime) {
      const newGoal = {
        id: Date.now(),
        goal,
        targetDateTime: targetDateTime.toISOString(),
      };

      const newGoals = [...goals, newGoal];
      saveGoalsToLocalStorage(newGoals);

      setGoal('');
      setTargetDateTime(null);

      const { days, hours, minutes } = calculateTimeRemaining(new Date(targetDateTime));
      const remainingMinutes = days * 24 * 60 + hours * 60 + minutes;

      if (remainingMinutes === 60 || remainingMinutes === 30) {
        toast.info(`${goal} - ${remainingMinutes} minutes remaining`, {
          position: 'top-right',
        });
      }
    }
  };

  const handleRemoveGoal = (id) => {
    const newGoals = goals.filter((goal) => goal.id !== id);
    saveGoalsToLocalStorage(newGoals);
  };

  const calculateTimeRemaining = (deadline) => {
    const now = new Date();
    const diff = deadline - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  const handleCompleteGoal = (selectedGoal) => {
    const targetDateTime = new Date(selectedGoal.targetDateTime);
    const now = new Date();
  
    if (now <= targetDateTime) {
      // Goal completed before the deadline
      setProgress(progress + 5);
      console.log(progress)
      localStorage.setItem('progress', JSON.stringify(progress));
      toast.success(`Congratulations! You just got rewarded 20 Points for completing ${selectedGoal.goal}!`, {
        position: 'top-right',
      });
    } else {
      // Deadline passed
      toast.error(`Aww, you missed the deadline for ${selectedGoal.goal}. Better luck next time!`, {
        position: 'top-right',
      });
    }
  
    // Remove the completed goal from state and local storage
    const newGoals = goals.filter((goal) => goal.id !== selectedGoal.id);
    saveGoalsToLocalStorage(newGoals);
  
    // Add any additional logic or state updates as needed
  };

  return (
    <Container style={{ textAlign: 'center', paddingTop: '20px' }} className={component3Styles.container}>
      <h2 className={component3Styles.compHeading}>Set Reading Goals</h2>
      <br></br>

      <Row className="justify-content-center">
        <Col xs={12} sm={6} className={component3Styles.formContainer}>
          <Form>
            <h6>Goal</h6>
            <Form.Group controlId="goal" className={component3Styles.formGroup}>
              {/*<Form.Label className={component3Styles.formLabel}>Goal</Form.Label>*/}
              <Form.Control
                type="text"
                placeholder="Enter your goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className={component3Styles.formControl}
              />
            </Form.Group>
            <Form.Group controlId="targetDateTime">
              <br></br>
              <h6>Target Date and Time</h6>
              {/*<Form.Label className={component3Styles.formLabel}>Target Date and Time</Form.Label>*/}
              
              <DatePicker
                selected={targetDateTime}
                onChange={handleDateTimeChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="dd/MM/yyyy h:mm aa"
                minDate={new Date()}
                isClearable
                placeholderText="Select date and time"
                className={`${component3Styles.formControl} ${component3Styles.datePicker}`}

              />
            </Form.Group>
            <br></br>
            <Button variant="primary" onClick={handleAddGoal} className={component3Styles.btnPrimary}>
              Add Goal
            </Button>
          </Form>
        </Col>
      </Row>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      {goals.length > 0 && (
        <Row className="justify-content-center" style={{ marginTop: '20px' }}>
          <Col xs={12} sm={8} className={component3Styles.tableContainer}>
            <h3>Goals List</h3>
            <Table striped bordered hover className={component3Styles.table}>
              <thead>
                <tr>
                  <th>Goal</th>
                  <th>Deadline</th>
                  <th>Time Remaining</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {goals.map((goal) => {
                  const targetDateTime = new Date(goal.targetDateTime);
                  const { days, hours, minutes } = calculateTimeRemaining(targetDateTime);

                  return (
                    <tr key={goal.id}>
                      <td>{goal.goal}</td>
                      <td>{targetDateTime.toLocaleString()}</td>
                      <td>
                        {days === 0
                          ? `${hours} hours ${minutes} minutes`
                          : `${days} days ${hours} hours`}
                      </td>
                      <td>
                       <Button variant="success" onClick={() => handleCompleteGoal(goal)} className={component3Styles.btnSuccess}>
                          Complete
                        </Button>
                        {' '}
                        <Button variant="danger" onClick={() => handleRemoveGoal(goal.id)} className={`${component3Styles.btnDanger} ml-2`}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </Container>
  );
};

export default Component3;
