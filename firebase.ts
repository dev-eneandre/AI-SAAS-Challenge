import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVONzDFjw3r1Eoth7M-WOgKsXJ_8UejZs",
  authDomain: "chat-with-pdf-69ef4.firebaseapp.com",
  projectId: "chat-with-pdf-69ef4",
  storageBucket: "chat-with-pdf-69ef4.appspot.com",
  messagingSenderId: "478938574266",
  appId: "1:478938574266:web:e9d2c384c607e246540183",
};
// Is the app already initialized, if so use the initialized instance else initialize a new one
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
