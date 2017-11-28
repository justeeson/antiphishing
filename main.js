function click(e) {
  chrome.tabs.executeScript(null,
      {code:"document.body.style.backgroundColor='" + e.target.id + "'"});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});
//chrome.browserAction.onClicked.addListener(
  //function (tab) {
    /*// ...check the URL of the active tab against our pattern and...
    if (urlRegex.test(tab.url)) {
        // ...if it matches, send a message specifying a callback too
        chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
    }*/
/*
    chrome.tabs.executeScript({ code: '(' + checkLinks + ')();'},
      (results) => {
        console.log('Popup script:');
        console.log(results[0]);
      }
    );
    
 }
);
*/
var mapOfLinks = new Map();

function collectLinks(){
  var links = document.getElementsByTagName("a");
  for (var item of links) {
		var url = item.getAttribute("href");
		
		//if the href is just a pathname
		if (url && url.charAt(0) == '/'){
			//prepend the domain to the pathname
			var length = window.location.hostname.length;
			length = length - window.location.pathname.length;
			url = window.location.hostname.substr(0, length) + url;
		}
		
		
		//Check for null links
		if(url)
		  mapOfLinks.set(url, {TEXT:item.text , THREAT:0});
	}
}

function checkLinks(){
    
    //Difficultly retrieveing settings due to async. Example below.
    var database = false
    chrome.storage.local.get('UseDatabase', function(response){database = response; console.log(response);});
    console.log(database)
    
    
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

//This only works for current tab I think
function checkHTTPSConn(url)
{
  if(location.protocol === 'https:'){
    //Then it is secure
  } else {
    //increment threat level
    //mapOfLinks[url].THREAT += 1? not sure how to increment this
  }
}

function changeURL()
{
	var linkList = document.getElementsByTagName("a");

	for (i = 0; i < linkList.length; i++) {
		item = linkList[i];
		var url = item.getAttribute("href");
	}
}


function unshortenURL(url) {
	var xmlHttp = new XMLHttpRequest();
	make_get_request(url, xmlHttp);
	
	url = xmlHttp.responseURL;
}

function make_get_request(url, xmlHttp)
{
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send();
}

//WORKS FOR TEXT
function highlightLinks(){
	var linkList = document.getElementsByTagName("a");

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
