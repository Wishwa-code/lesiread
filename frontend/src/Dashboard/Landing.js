import React from 'react';
import { Card, CardContent,Container, Grid, Typography, Button } from '@mui/material';
import heroImg from '../assets/chatpdf.jpg';
import heroImg2 from '../assets/chatpdf.png';
import "./dashboard.css";
import logo from "../assets/logo.png"

import heroImg3 from '../assets/quiz.webp'
const Hero = () => {
  return (
    
    <section className='sectionnew' style={{padding: '70px 0' }}>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

    <div className='flex justify-center	w-full mx-auto text-center content-center items-center font-normal' style={{ maxWidth: '100%', height: 'auto' }}>
      <img src={logo} alt="LesiRead Logo" style={{ maxWidth: '25%', height: 'auto' }} />  
      <div className='sm:text-lg md:text-5xl lg:text-8xl' style={{ maxWidth: '75%', height: 'auto' }}>Welcome to LesiRead™</div>
    </div>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>

      <Container maxWidth="lg">
        <Grid container spacing={5} alignItems="center">
          <Grid item md={6} sm={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <img src={heroImg} alt="heroImg" style={{ maxWidth: '90%', height: 'auto' }} />
          </Grid>

          <Grid item md={6} sm={12}>
            <div>
              <Typography variant="h2" gutterBottom>
                Analyze and Summarize Any PDF 
              </Typography>
              <Typography variant="body1" paragraph>
                Easily summarize, define and understand large pdf documents, supports any document (thesis, research papers, legal documents)
              </Typography>
              <div>
                <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
                  Get it on Chrome
                </Button>
                <Button variant="contained" color="secondary">
                  Get it on Firefox
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
        <br></br>
        <br></br>
        <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
      </Container>
      <Container maxWidth="lg">
        <Grid container spacing={5} alignItems="center">
          <Grid item md={6} sm={12}>
            <div>
              <Typography variant="h2" gutterBottom>
                Ask Questions From Any PDF
              </Typography>
              <Typography variant="body1" paragraph>
                Ask any question from the context of the PDF, no more unnecessary reading anymore! 
              </Typography>
              <div>
                <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
                  Primary Button
                </Button>
                <Button variant="contained" color="secondary">
                  Secondary Button
                </Button>
              </div>
            </div>
          </Grid>

          <Grid item md={6} sm={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <img src={heroImg2} alt="heroImg" style={{ maxWidth: '100%', height: 'auto' }} />
          </Grid>
        </Grid>
      </Container>
      <br></br>
        <br></br>
        <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
      <Container maxWidth="lg">
        <Grid container spacing={5} alignItems="center">
          <Grid item md={6} sm={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <img src={heroImg3} alt="heroImg" style={{ maxWidth: '95%', height: 'auto' }} />
          </Grid>

          <Grid item md={6} sm={12}>
            <div>
              <Typography variant="h2" gutterBottom>
                Generate Quizes From Any PDF
              </Typography>
              <Typography variant="body1" paragraph>
               Test and evaluate yourself by answering a quiz from the context of the Provided PDF, beat your high scores and you will recieve rewards!
              </Typography>
              <div>
                <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
                  Get it on Chrome
                </Button>
                <Button variant="contained" color="secondary">
                  Get it on Firefox
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>

      </Container>
    </section>
    
  );
};

export default Hero;
