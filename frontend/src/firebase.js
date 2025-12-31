import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyAkCwoe8nGhMXHkfeq-xUMwWJUujfhN6Wc",

  authDomain: "tienda-online-5cc0d.firebaseapp.com",

  projectId: "tienda-online-5cc0d",

  storageBucket: "tienda-online-5cc0d.firebasestorage.app",

  messagingSenderId: "489929892366",

  appId: "1:489929892366:web:12890b5fac515c22c2525f",


  measurementId: "G-Q0CWKTVXKJ"

};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
