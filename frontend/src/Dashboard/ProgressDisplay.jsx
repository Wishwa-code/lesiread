import React,  { useState } from 'react';
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Box, Typography, Stack, Tooltip, LinearProgress } from '@mui/material';

function ProgressDisplay({ currentLevel, points, pointsToNextLevel }) {
  const percentage = (points / (points + pointsToNextLevel)) * 100;
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
        onMouseMove={handleMouseMove}> 
        <Tooltip 
        title={"carrot"}
        open={tooltipOpen}
        placement="top"
        arrow
        PopperProps={{
          anchorEl: {
            getBoundingClientRect: () => ({
              top: tooltipPosition.y,
              left: tooltipPosition.x,
              right: tooltipPosition.x,
              bottom: tooltipPosition.y,
              width: 0,
              height: 0
            })
          }
        }}
      ></Tooltip>
      <Stack direction="column" spacing={2} alignItems="center" >
      <LinearProgress variant="determinate" value={percentage} sx={{ width: '200px', height:'20px',borderRadius:'5px',backgroundColor:'#2a0944'}}/>
        <Typography variant="h6" color="white">Points</Typography>
      </Stack>
        <Stack direction="column" spacing={1} alignItems="center">
        <Typography variant="body1" color="white">Current Level: {currentLevel}</Typography>
        <Typography variant="body1" color="white">{pointsToNextLevel} Points to Level {currentLevel + 1}</Typography>
      </Stack>
    </Box>
  );
}

export default ProgressDisplay;