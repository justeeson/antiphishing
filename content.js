function printLinksOnPage(){
  var linkList = document.getElementsByTagName("a");
  var str = 'Links On Page: \n';
  for (i = 20; i < 27; i++){
    str = str + 'index: ' + i + ', link: ' + linkList[i].getAttribute('href') + '\n';
  }
  //alert(str);
}

function replaceUrls(){
  var linkList = document.getElementsByTagName("a");
  
	for (i = 20; i < 27/*linkList.length*/; i++) {
	  item = linkList[i];
	  
		var url = item.getAttribute("href");
		
	  var parser = document.createElement('a');
    parser.href = url;
    
    //if the href is just a pathname
    if (url.charAt(0) == '/'){
      //preprend the domain to make a full url
	    url = parser.hostname + parser.pathname;
	    parser.href = url;
    }
    
    /*assume http if protocol is unspecified, 
    if https is available it will be updated when redirects are resolved*/
    if(!url.includes(parser.protocol)){
      url = 'http://' + url;
    }
  
    //alert('feoaefae: ' + url);
    //send the url to main.js to be resolved
    chrome.runtime.sendMessage({greeting: 'Find Redirects', url: url, index: i});
  
    //var innerHTML_ = item.innerHTML;
		//item.innerHTML = "<span style=\"background-color: #FFFF00\">" + innerHTML_ + "</span>";
	} 
	var str = 'ereraea: \n';
  
  var count = 20;
  function foo(request, sender, sendResponse) {
    if(request.greeting == 'Final URL Dest'){
      linkList[request.index].setAttribute('href', request.data);
      //alert('index: ' + request.index + '    link: ' + linkList[request.index].getAttribute('href') + '\n');
      
      count++;
      
    }
  }
  
  
  chrome.runtime.onMessage.addListener(foo);
  
  
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

window.onload = function() {
  //replaceUrls();
  
  //printLinksOnPage();
};