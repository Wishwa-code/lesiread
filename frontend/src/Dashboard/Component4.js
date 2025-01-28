import React, {useEffect, useState} from "react";
import { CircularProgress, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import "./dashboard.css"; // Import other CSS files

const Component4 = () => {
  const [progress, setProgress] = useState(0); // Progress percentage
  const rewardPoints = 250; // Reward points earned
  const currentLevel = 5; // Current level
  const pointsToNextLevel = 15; // Points needed to reach the next level

  const goals = [
    { name: "Read Project Thesis", points: 50 },
    { name: "Complete Project Proposal", points: 100 },
    { name: "Read NLP Documentation", points: 150 }
  ];


  useEffect(() => {
    const storedProgress = localStorage.getItem('progress');
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }
  }, []);

  return (
    <div className="container">
      <div className="content">
        <br>
        </br>
        <br></br>
        <Typography variant="h4" style={{ textAlign: "center" }}>Reward Points Earned</Typography>
        <br></br>

        <div className="progress-container">
          <Typography variant="h5" style={{ marginRight: "20px" }}>Current Level : {currentLevel}</Typography>
          <CircularProgressWithLabel value={progress} />
          <Typography variant="h5" style={{ marginLeft: "20px" }}>{pointsToNextLevel} Points to Level {currentLevel + 1}</Typography>
        </div>
        <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }} className="reward-container">
          <Typography variant="h6">Total Reward Points Earned: {rewardPoints}</Typography>
          <List>
            {goals.map((goal, index) => (
              <ListItem key={index}>
                <ListItemText primary={goal.name} secondary={`Points: ${goal.points}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </div>
  );
};

// Custom circular progress component with label
function CircularProgressWithLabel({ value }) {
  return (
    <div style={{ position: 'relative' }}>
      <CircularProgress variant="determinate" value={value} style={{ width: '200px', height: '200px' }} thickness={5} color="secondary" />
      <Typography variant="h5" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{value} Points</Typography>
    </div>
  );
}

export default Component4;
