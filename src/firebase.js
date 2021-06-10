import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDnOiBWkUk8_eD_F6lKC7WC2p1RWyf8700",
  authDomain: "ecom-5c69b.firebaseapp.com",
  projectId: "ecom-5c69b",
  storageBucket: "ecom-5c69b.appspot.com",
  messagingSenderId: "658776014011",
  appId: "1:658776014011:web:bfa700846446f3df6fbd9e",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()