import { initializeApp } from "firebase/app";
import 'firebase/database';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyC__fitG2iWhRpQF-DVJss7ryrMJowUwoc",
  authDomain: "fir-react-crud-9f44b.firebaseapp.com",
  projectId: "fir-react-crud-9f44b",
  storageBucket: "fir-react-crud-9f44b.appspot.com",
  messagingSenderId: "149656070840",
  appId: "1:149656070840:web:d0a1a9a65f50ccfcb2a24d",
  measurementId: "G-GF8B0LV726"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const dbFile = getStorage(app);

export default app;

