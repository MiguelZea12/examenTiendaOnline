import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyCV3A430ASHwpo1lxkb6mAR31S4FVlrLXw",

  authDomain: "tienda-online-b1d83.firebaseapp.com",

  projectId: "tienda-online-b1d83",

  storageBucket: "tienda-online-b1d83.firebasestorage.app",

  messagingSenderId: "971516398792",

  appId: "1:971516398792:web:1a7bd0a5029d26e2a069fd",

  measurementId: "G-Q0CWKTVXKJ"

};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
