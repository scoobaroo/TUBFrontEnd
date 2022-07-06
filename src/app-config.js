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
    apiBaseUrl: "http://localhost:4000/",
    
    firebaseConfig: {
      apiKey: "AIzaSyCcr9kAj2SaHgQDw7TIUKcxebtP8g70LaY",
      authDomain: "taskunblock.firebaseapp.com",
      projectId: "taskunblock",
      storageBucket: "taskunblock.appspot.com",
      messagingSenderId: "310172300563",
      appId: "1:310172300563:web:0b91a912c97eaa4240d6e6",
      measurementId: "G-C2H6ZQ0QBM"
    },

    timeOutDelay: 1800, // in seconds

    azure: {
      sasToken: "?sv=2020-08-04&ss=bfqt&srt=co&sp=rwdlacupitfx&se=2022-07-23T18:17:05Z&st=2022-05-23T10:17:05Z&spr=https&sig=3iY8kxXesIg7siSjHsub6c%2BkdK%2BNZRchJC80G5AKKlw%3D",
      storageAccountName: "cs210032001e644aa1d",
    },
  },
  production: {
    apiBaseUrl: "http://localhost:4000/",

    firebaseConfig: {
      apiKey: "AIzaSyDIVIi2WFVoVUh2S9oDAuMfwki-jqfD3SA",
      authDomain: "unblock-auth-dev.firebaseapp.com",
      projectId: "unblock-auth-dev",
      storageBucket: "unblock-auth-dev.appspot.com",
      messagingSenderId: "46308360656",
      appId: "1:46308360656:web:6d17f886725fef944ab9d5",
    },

    timeOutDelay: 3600, // in seconds
    
    azure: {
      sasToken: "?sv=2020-08-04&ss=bfqt&srt=co&sp=rwdlacupitfx&se=2022-07-23T18:17:05Z&st=2022-05-23T10:17:05Z&spr=https&sig=3iY8kxXesIg7siSjHsub6c%2BkdK%2BNZRchJC80G5AKKlw%3D",
      storageAccountName: "cs210032001e644aa1d",
    },
  },
};

