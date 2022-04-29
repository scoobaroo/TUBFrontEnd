/**
 * Web app configuration
 *
 * Configuration thats imported into the bundle based
 * on the target environment by the app's config-loader
 *
 * From a client-side javascript file you can pull this
 * configuration in with:
 *
 *   var config = require('webpack-config-loader!../app-config.js');
 *
 * And access the appropriate nodes via:
 *
 *   console.log(config.apiBaseUrl);
 */
 module.exports = {
  development: {
    apiBaseUrl: 'http://localhost:4000/',
    
    firebaseConfig: {
      apiKey: "AIzaSyDIVIi2WFVoVUh2S9oDAuMfwki-jqfD3SA",
      authDomain: "unblock-auth-dev.firebaseapp.com",
      projectId: "unblock-auth-dev",
      storageBucket: "unblock-auth-dev.appspot.com",
      messagingSenderId: "46308360656",
      appId: "1:46308360656:web:6d17f886725fef944ab9d5"
    },
  },
  production: {
    apiBaseUrl: 'http://localhost:4000/',

    firebaseConfig: {
      apiKey: "AIzaSyDIVIi2WFVoVUh2S9oDAuMfwki-jqfD3SA",
      authDomain: "unblock-auth-dev.firebaseapp.com",
      projectId: "unblock-auth-dev",
      storageBucket: "unblock-auth-dev.appspot.com",
      messagingSenderId: "46308360656",
      appId: "1:46308360656:web:6d17f886725fef944ab9d5"
    },
  },
};

