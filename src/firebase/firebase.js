import app from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDIVIi2WFVoVUh2S9oDAuMfwki-jqfD3SA",
  authDomain: "unblock-auth-dev.firebaseapp.com",
  projectId: "unblock-auth-dev",
  storageBucket: "unblock-auth-dev.appspot.com",
  messagingSenderId: "46308360656",
  appId: "1:46308360656:web:6d17f886725fef944ab9d5"
};

export default class Firebase {
  constructor() {
    if (!app.apps.length) app.initializeApp(firebaseConfig);

    this.auth = app.auth();
  }

  createUser = (em, pw) => this.auth.createUserWithEmailAndPassword(em, pw);

  signUserIn = (em, pw) => this.auth.signInWithEmailAndPassword(em, pw);

  passwordReset = em => this.auth.sendPasswordResetEmail(em);

  updatePassword = pw => this.auth.currentUser.updatePassword(pw);

  signOut = () => this.auth.signOut();
}
