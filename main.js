//Listens for a url from content.js to be be resolved
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.greeting == 'Find Redirects'){
      var xhr = new XMLHttpRequest();
    
      xhr.open('GET', request.url, true);
    	
    	
      xhr.onload = function () {
        var finalURL = this.responseURL.toString();
                //parse url to http(s)://hostname/pathname
        var parser = document.createElement('a');
        parser.href = finalURL;
        //finalURL = parser.href;
        
        checkDataBase(finalURL, request.index, sender.tab.id);
       
      };
      
      xhr.send(null);
    }
  });

function checkDataBase(url, index, tab){
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
            //p.href = p.hostname + p.pathname;
            //q.href = q.hostname + q.pathname;
            //alert('p: ' + p.href + '\nq: ' + q.href);
            
        
            //alert('xmlUrl: ' + xmlURL + '\nurl:  ' + url);
            //Bad link if whole url matches or hostname / pathname are a match
            if(p.pathname == '/'){
              if(xmlURL == url || ( p.hostname == q.hostname)){
                //Identify the link as unsafe
                isSafeLink = false;
                alert(
                  'found at index: ' + index + '\n\n' +
            		  'url: ' + url + '\n\n' +
            		  'xmlURL: ' + xmlURL + '\n\n' +
            		  'p.href: ' + p.href + '\n\n' +
            		  'q.href '  + q.href 
            		  );
                
                //exit the for loop and send message back to content.js
                i = validURLList.length;
              }
            }
            else {
              if(xmlURL == url || ( (p.hostname + p.pathname) == (q.hostname + q.pathname))){
                //Identify the link as unsafe
                isSafeLink = false;
                alert(
                  'found at index: ' + index + '\n\n' +
            		  'url: ' + url + '\n\n' +
            		  'xmlURL: ' + xmlURL + '\n\n' +
            		  'p.href: ' + p.href + '\n\n' +
            		  'q.href '  + q.href 
            		  );
                
                //exit the for loop and send message back to content.js
                i = validURLList.length;
              }
            }
          }
          
          //send message back to the page with the url, index in the page, and status in the database 
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tab, {greeting: "Final URL Dest", data: url, index: index, safe: isSafeLink}, function(response) {
              //
            });
          });
          
      }
     
  };
  http.send();
  //if you want to phishtank to check for you
  //http.send(params);
}







var mapOfLinks = new Map();

function collectLinks(){
  var links = document.getElementsByTagName("a");
  for (var item of links) {
		var url = item.getAttribute("href");
		
		//if the href is just a pathname
		if (url.charAt(0) == '/'){
			//prepend the domain to the pathname
			var length = window.location.hostname.length;
			length = length - window.location.pathname.length; 
			url = window.location.hostname.substr(0, length) + url;
		}
		
		mapOfLinks.set(url, {TEXT:item.text , THREAT:0});
	}
}

function checkLinks(){
		for (var element of mapOfLinks) {
		  /*
			//check that link text matches domain, if not increment threat
			function checkDomainMatch(List list){
				
			}
			//check that link text does not have foreign chars, if not increment threat
			checkForForeignCharacters(List list){
				
			}
			//check that link text isn’t in a database, if not increment threat
			checkAgainstDatabase(List list){
				
			}
			//check that link has https available if not increment threat
			checkHTTPSConn(List list){
				
			}
			*/
		}
}

//WORKS FOR TEXT
function highlightLinks(linkList){
	//var linkList = document.getElementsByTagName("a");

	for (i = 0; i < linkList.length; i++) {
		item = linkList[i];
		var url = item.getAttribute("href");
				
		//change item.text to be highlighted based on the THREAT level right now its just yellow
		var innerHTML_ = item.innerHTML;
		item.innerHTML = "<span style=\"background-color: #FFFF00\">" + innerHTML_ + "</span>";
	}
	
	var imgList = document.getElementsByTagName("img");
	for (i = 0; i < imgList.length; i++) {
		item = imgList[i];
		var badLinkReplacement = "https://s3.minijuegosgratis.com/media/video-collection-img/video-collection-trollface-thumb.jpg?v=_1510313260";
		
		//needs to compare against DB for whole and shortened link
		//if (item.getAttribute("src") == BAD_LINK){
			item.setAttribute("src", badLinkReplacement);
		//}
	}
}
