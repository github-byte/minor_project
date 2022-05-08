import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// import { seedDatabase } from '../seed'

const config = {
  // apiKey: "AIzaSyCzKnyASkhxcpGl6CHSPBQju8kANdRC6Ro",
  // authDomain: "major-project-b74b9.firebaseapp.com",
  // databaseURL: "https://major-project-b74b9-default-rtdb.asia-southeast1.firebasedatabase.app",
  // projectId: "major-project-b74b9",
  // storageBucket: "major-project-b74b9.appspot.com",
  // messagingSenderId: "672257085914",
  // appId: "1:672257085914:web:95915e62913016e78970e3"
  apiKey: "AIzaSyBA3eLDu8q4hBuPYM8Yiyg2FN3atoX7LdE",
  authDomain: "final-major-8a8df.firebaseapp.com",
  databaseURL:"https://final-major-8a8df-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "final-major-8a8df",
  storageBucket: "final-major-8a8df.appspot.com",
  messagingSenderId: "1087470506720",
  appId: "1:1087470506720:web:e5e0b29816d42b5b5e7685"
};

const firebase = Firebase.initializeApp(config);
// seedDatabase(firebase);
export { firebase };
