import { CACHE_NAME } from "./serviceWorker";
import { urlB64ToUint8Array } from "./utils";
require("rx");
require("rx-dom");

var registerServiceWorker = require("serviceworker!./serviceWorker.es6");

registerServiceWorker({ scope: "/" }).then(
  registration => { 
    console.log("Service worker registered succesfully!");
  },
  error => {
    console.log(`Service worker registration failed: ${error}`);
  }
);

function initialize() {
  let searchBox = $("#search-box");
  searchBox.focus();
  let searchBoxInputChange = Rx.Observable.fromEvent(searchBox, "input")
    // .debounce(500)
    .filter(event => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.exec(event.target.value) !== null);
    
  if ("showNotification" in ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready
    .then(registration => {
      console.log("Registering notifications.");
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array("BNAzKEHIochdAz2jkJ9A0edl7cWIWN9pxokxrOZSykvH5K43uN44RaCJ3VKqepHyexsB2Ha2Vet3m4cMCc5Ph-U")
      });
    })
    .then(subscription => {
      console.log("Registered notifications.");
    })
    .catch(error => {
      consol.log("Error registering notifications.");
    });
  }

    
  searchBoxInputChange.subscribe((event) => {
    const ip_url = `https://ipapi.co/${event.target.value}/json/`;
    $("#country-label").html("");
    
    caches.match(ip_url).then(response => {
      if(response) {
        console.log(response.json().then(data => $("#country-label").html(data.country)));
        return response;
      }
    });
    
    var corsRequest = new Request(ip_url, {mode: "cors"});
    fetch(corsRequest)
    .then(response => {
      caches.open(CACHE_NAME).then(cache => {
        return cache.add(response.url);
      });
      return response.json();
    }).then(data => $("#country-label").html(data.country));
    
  });
}

Rx.DOM.ready().subscribe(initialize);

require("file?name=[name].[ext]!./index.html");
require("file?name=[name].[ext]!./index-offline.html");
