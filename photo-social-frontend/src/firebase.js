import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // for authentication
import 'firebase/compat/firestore'; // for cloud firestore
import 'firebase/compat/storage'; // for storage
import 'firebase/compat/database'; // for realtime database

const firebaseConfig = {
  apiKey: "AIzaSyCTCekLAzjODpYXBUHbmMR40KktVxPl8bU",
  authDomain: "photo-social-mern-527b3.firebaseapp.com",
  projectId: "photo-social-mern-527b3",
  storageBucket: "photo-social-mern-527b3.appspot.com",
  messagingSenderId: "379539604781",
  appId: "1:379539604781:web:f5a8b9cba7e769e22a7fa4"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, storage }