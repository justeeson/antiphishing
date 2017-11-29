//resolve urls to the final redirected destination
function replaceUrls(){
  
  //Initialize listener
  function foo(request, sender, sendResponse) {
    if(request.greeting == 'Final URL Dest'){
      //have a new attribute with the final dest after redirects
      linkList[request.index].setAttribute('redirectLink', request.data);
      
      var disallowed = /[^a-z0-9_.,-]/i;
      if (disallowed.test( decodeURI(request.data))){
         alert("URL contains non-ASCII character! index: " + request.index);
      }
      var innerHTML_ = linkList[request.index].innerHTML;
      var strTitle = '\n';
      //highlight unsafe links
      if(!request.safe){
        strTitle = strTitle + 'Warning: BlackListed Link';
        //linkList[request.index].setAttribute('title', 'Warning: BlackListed Link');
	  	  linkList[request.index].innerHTML = "<span style=\"background-color: #FFFF00\">" + innerHTML_ + "</span>";
      }
      
      strTitle = linkList[request.index].getAttribute('href') + strTitle;
      
      linkList[request.index].setAttribute('title', strTitle);
      //I recommend that we do the link safety checks here since we cannot guarantee order of execution
      
      //alert('index: ' + request.index + '    link: ' + linkList[request.index].getAttribute('href') + '\nisSafe: ' + request.safe + '\n');
          
    }
  }
  
  chrome.runtime.onMessage.addListener(foo);
  
  //collect links
  var linkList = document.getElementsByTagName("a");
  //limited looping for testing
	for (i = 0; i < linkList.length; i++) {
	  item = linkList[i];
  	  //alert(i + '   '  + linkList[i]);
	  
	  //make url parsable
		var url;
		var parser;
		if(item){
  		if (item.getAttribute('href')){
  		  
    		url = item.getAttribute('href');
    		console.log('index: ' + i + '   url: ' +url);
    	  parser = document.createElement('a');
        parser.href = url;
        url = parser.href;
  		}
		}
    
	  //alert('parser: ' + parser.href + '\n\nurl:    ' + url + '\n\nequal: ' + b);
	  //send the url to main.js to be resolved
	  chrome.runtime.sendMessage({greeting: 'Find Redirects', url: url, index: i});
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

/*window.onload = function() {
    //replaceUrls();
};*/

//window.addEventListener("load", replaceUrls);
