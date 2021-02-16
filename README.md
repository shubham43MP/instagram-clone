# This is an Intagram clone build with React and firebase.

# Add a firebase.js file inside with the directory src/firebase.js via signing in from firebase storage as well.

1) npm i
2) npm start


contents of firebase.js would be: 
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  // Actual values
	apiKey: "",
	authDomain: "",
	databaseURL: "",
	projectId: "",
	storageBucket: "",
	messagingSenderId: "",
	appId: "1:",
	measurementId: ",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
