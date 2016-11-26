var registerServiceWorker = require("serviceworker!./serviceWorker.es6");

registerServiceWorker({ scope: "/" }).then(
  registration => { 
    console.log("Service worker registered succesfully!");
  },
  error => {
    console.log(`Service worker registration failed: ${error}`);
  }
);
