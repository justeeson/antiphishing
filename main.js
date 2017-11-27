
//Listens for a url from content.js to be be resolved
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var count = 0;
    if(request.greeting == 'Find Redirects'){
      //alert('finding redirects');
      var xhr = new XMLHttpRequest();
    
      xhr.open('GET', request.url, true);
    	
    	
      xhr.onload = function () {
        finalURL = this.responseURL.toString();
        
                //parse url to http(s)://hostname/pathname
        var parser = document.createElement('a');
        parser.href = finalURL;
        finalURL = parser.protocol + '//' + parser.hostname + parser.pathname;
        
        //send the Final URL Dest back to the the correct tab with the index of the url in linkList
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          
          chrome.tabs.sendMessage(sender.tab.id, {greeting: "Final URL Dest", data: finalURL, index: request.index}, function(response) {
            //
          });
        });
       
      };
      
      xhr.send(null);
    }
  });


function checkDataBase(url){
  var phishTankURL = 'http://checkurl.phishtank.com/checkurl/';
  var phishTankKey = '0721d56cc2db3b2564ff700fa375d1c8f33875b6a12431410969c612d12c714a';
  //var textXML = 'https://www.w3schools.com/xml/books.xml';
  
  var http = new XMLHttpRequest();
  
  
  var params = 'url=' + url + '&format=xml&app_key=' + phishTankKey;
  //http.open("POST", phishTankURL, true);
  http.open('GET', './verified_online.xml', true);
  
  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
        //alert('ere');
          var parser = new DOMParser();
          var doc = parser.parseFromString(this.responseText, "text/xml");
          var validURLList =doc.getElementsByTagName('url');
          
          for(i = 0; i < validURLList.length; i++){
            var xmlURL = validURLList[i].childNodes[0].nodeValue;
            if(xmlURL == url){
              alert(xmlURL + ' found at index: ' + i);
            }
          }
          //alert(doc.getElementsByTagName('url')[0].childNodes[0].nodeValue);
          
      }
  };
  http.send(params);
}

checkDataBase('http://paypal.co.uk.userjcgw75avdau.gospite.com/acc1/sd/?em=&amp;ses=cc0396621d252f2dbd34ae5ddc0a3a2a');






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
