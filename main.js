initializeDefaultValues();

function initializeDefaultValues() {
    if (localStorage.getItem('default_values_initialized')) {
        return;
    }
    
    // set default values for your variable here
    localStorage.setItem('on', 'true');
    alert(localStorage.getItem('on'));
    localStorage.setItem('default_values_initialized', true);
}

//Listens for a url from content.js to be be resolved
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var xhr = new XMLHttpRequest();
    
    xhr.open('GET', request.url, true);
  	
    xhr.onload = function () {
      var finalURL = this.responseURL.toString();
              //parse url to http(s)://hostname/pathname
      var parser = document.createElement('a');
      parser.href = finalURL;
      finalURL = parser.href;
      
      if(request.greeting == 'Find Redirects'){
        checkDataBase(finalURL, request.index, sender.tab.id, true);
      }
      else if(request.greeting == 'Find Image Redirects'){
        checkDataBase(finalURL, request.index, sender.tab.id, false);
      }
     
    };
    
    xhr.send(null);
  });

function checkDataBase(url, index, tab, isHREF){
  /*If you want to phishtank to check for you
  var phishTankURL = 'http://checkurl.phishtank.com/checkurl/';
  var phishTankKey = '0721d56cc2db3b2564ff700fa375d1c8f33875b6a12431410969c612d12c714a';
  //var testXML = 'https://www.w3schools.com/xml/books.xml';
  */
  
  var http = new XMLHttpRequest();
  
  /*If you want to phishtank to check for you
  var params = 'url=' + url + '&format=xml&app_key=' + phishTankKey;
  http.open("POST", phishTankURL, true);
  */
  
  //search local xml file downloaded from phishtank.com
  http.open('GET', './test.xml', true);
  
  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
  http.onreadystatechange = function() {
      if(http.readyState == 4 && http.status == 200) {
          //parse the xml file
          var parser = new DOMParser();
          var doc = parser.parseFromString(this.responseText, "text/xml");
          var isSafeLink = true;
          //get all the url elements
          //XML file only contains active phishes so no checks for validity are necessary
          var validURLList = doc.getElementsByTagName('url');
          
          //For each badURL in our database
          for(i = 0; i < validURLList.length; i++){
            //Parse url into host+path
            var xmlURL = validURLList[i].childNodes[0].nodeValue;
            var p = document.createElement('a');
            var q = document.createElement('a');
            p.href = xmlURL;
            q.href = url;
            
        
            //Bad link if whole url matches or hostname / pathname are a match
            if(p.pathname == '/'){
              if(xmlURL == url || ( p.hostname == q.hostname) || q.href.includes(p.href)){
                //Identify the link as unsafe
                isSafeLink = false;
                
                //exit the for loop and send message back to content.js
                i = validURLList.length;
              }
            }
            else {
              if(xmlURL == url || ( (p.hostname + p.pathname) == (q.hostname + q.pathname)) || q.href.includes(p.href)){
                //Identify the link as unsafe
                isSafeLink = false;
                
                //exit the for loop and send message back to content.js
                i = validURLList.length;
              }
            }
          }
          
          if(isHREF){
            //send message back to the page with the url, index in the page, and status in the database 
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tab, {greeting: "Final URL Dest", data: url, index: index, safe: isSafeLink, protocol: q.protocol}, function(response) {
                //
              });
            });
          }
          else{
            //send message back to the page with the url, index in the page, and status in the database 
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tab, {greeting: "Final IMG Dest", data: url, index: index, safe: isSafeLink, protocol: q.protocol}, function(response) {
                //
              });
            });
          }
          
      }
     
  };
  http.send();
  //if you want to phishtank to check for you
  //http.send(params);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.greeting == 'ON'){
      sendResponse({status: localStorage.getItem('on')});
    }
  });

chrome.browserAction.onClicked.addListener(
  function(){
    if(localStorage.getItem('on') == 'true'){
      localStorage.setItem('on', 'false');
      alert('I\'m so turned off right now.....');
    }
    else{
      localStorage.setItem('on', 'true');
      alert('I\'m so turned on (;');
    }
    
    
  }
);
