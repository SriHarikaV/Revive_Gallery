import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvFe5LURdbAMARXauX6HSpo5gym3_m-z8",
  authDomain: "revivegallery-984c0.firebaseapp.com",
  projectId: "revivegallery-984c0",
  storageBucket: "revivegallery-984c0.appspot.com",
  messagingSenderId: "889509963895",
  appId: "1:889509963895:web:debbb7e76997f2ef897e72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// used to store images to firebase
const imgDB = getStorage(app)

export {imgDB};