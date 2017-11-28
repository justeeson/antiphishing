//does not work asynchronously
/*function printLinksOnPage(){
  var linkList = document.getElementsByTagName("a");
  var str = 'Links On Page: \n';
  for (i = 20; i < 27; i++){
    str = str + 'index: ' + i + ', link: ' + linkList[i].getAttribute('href') + '\n';
  }
  //alert(str);
}
*/


//chrome.runtime.onMessage.addListener(foo);
//resolve urls to the final redirected destination
function replaceUrls(){
  
  //Initialize listener
  function foo(request, sender, sendResponse) {
    if(request.greeting == 'Final URL Dest'){
      var x = linkList[request.index].getAttribute('href');
      linkList[request.index].setAttribute('href', request.data);
      
      /*
       *Uncomment this to see the it resolve extended or shortened urls
       *https://blog.bufferapp.com/url-shorteners is a good website for demo
       *alert('index: ' + request.index + '    before: ' + x + '    after: ' + linkList[request.index].getAttribute('href') + '\n');
       */
      
      //alert here gives correct information but only in this scope because of asynchronous messaging
      
      //I recommend that we do the link safety checks here since we cannot guarantee order of execution
      
      //alert('index: ' + request.index + '    link: ' + linkList[request.index].getAttribute('href')/* + ' isSafe: ' + request.safe*/ + '\n');
      
      
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
    	  parser = document.createElement('a');
        parser.href = url;
  		}
		}
		
    //if the href is just a pathname
    if(url && url.charAt(0) != 'h'){
      //if there is no p
      if (url && url.charAt(0) != '/'){
        url = '/' + url;
      }
      //preprend the domain to make a full url
	    url = parser.hostname + url;
	    parser.href = url;
	    
  	   /*assume http if protocol is unspecified, 
      if https is available it will be updated when redirects are resolved*/
      if(!url.includes(parser.protocol)){
        url = 'http://' + url;
      }
      
      
      
      //send the url to main.js to be resolved

      chrome.runtime.sendMessage({greeting: 'Find Redirects', url: url, index: i});
    
    
      //var innerHTML_ = item.innerHTML;
  		//item.innerHTML = "<span style=\"background-color: #FFFF00\">" + innerHTML_ + "</span>";
	  } 
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

window.onload = function() {
  replaceUrls();
  
  //printLinksOnPage();
};