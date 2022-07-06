import { initializeApp } from "firebase/app";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import appConfig from 'webpack-config-loader!../app-config.js';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export default class Firebase {
  constructor() {
    const app = initializeApp(appConfig.firebaseConfig);
    this.auth = getAuth(app);
    this.db = getFirestore(app);
    this.storage = getStorage(app);
  }
 
  createUser = (auth, em, pw) => createUserWithEmailAndPassword(auth, em, pw);

  signUserIn = (auth, em, pw) => signInWithEmailAndPassword(auth, em, pw);

  passwordReset = em => this.auth.sendPasswordResetEmail(em);

  updatePassword = pw => this.auth.currentUser.updatePassword(pw);

  signOut = () => this.auth.signOut();
}
