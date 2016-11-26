import { CACHE_NAME } from "./serviceWorker";
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
    .debounce(500)
    .filter(event => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.exec(event.target.value) !== null);
    
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
