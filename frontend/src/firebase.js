import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4MMh534K-xWXWQ5Nxrn4vLj71877EXd8",
  authDomain: "lesiread.firebaseapp.com",
  projectId: "lesiread",
  storageBucket: "lesiread.appspot.com",
  messagingSenderId: "34439843759",
  appId: "1:34439843759:web:fe8bae5fd035edeaece95a",
  measurementId: "G-3EVZR1GEY9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the auth service instance

export { app, auth };
