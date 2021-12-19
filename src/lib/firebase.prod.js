import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// import { seedDatabase } from '../seed'

const config = {
  apiKey: "AIzaSyDCo7wZpSLxw6X87EkQAIdnrbPUaJYynlo",
  authDomain: "minorproject-fb093.firebaseapp.com",
  databaseURL: "https://minorproject-fb093-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "minorproject-fb093",
  storageBucket: "minorproject-fb093.appspot.com",
  messagingSenderId: "798049006149",
  appId: "1:798049006149:web:9a5226996230adb385692c"
};

const firebase = Firebase.initializeApp(config);
// seedDatabase(firebase);
export { firebase };
