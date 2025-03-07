import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyC-FKme7_x1rGHx4W_D5IKdC8vbol_Ra0w",
    authDomain: "quizzer-platform.firebaseapp.com",
    databaseURL: "https://quizzer-platform-default-rtdb.firebaseio.com",
    projectId: "quizzer-platform",
    storageBucket: "quizzer-platform.firebasestorage.app",
    messagingSenderId: "130083875488",
    appId: "1:130083875488:web:ab888e75292d17a77af7c5"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);