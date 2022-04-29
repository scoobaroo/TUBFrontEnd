import app from 'firebase/app';
import 'firebase/auth';
import appConfig from 'webpack-config-loader!../app-config.js';

export default class Firebase {
  constructor() {
    if (!app.apps.length) app.initializeApp(appConfig.firebaseConfig);

    this.auth = app.auth();
  }

  createUser = (em, pw) => this.auth.createUserWithEmailAndPassword(em, pw);

  signUserIn = (em, pw) => this.auth.signInWithEmailAndPassword(em, pw);

  passwordReset = em => this.auth.sendPasswordResetEmail(em);

  updatePassword = pw => this.auth.currentUser.updatePassword(pw);

  signOut = () => this.auth.signOut();
}
