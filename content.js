function getColor(threat){
  if(threat == 1){
    return 'FFFF00';
  }
  else if(threat == 2){
    return 'FFA533';
  }  
  else if(threat >= 3){
    return 'FF3333';
  }  
}

//resolve urls to the final redirected destination
function processURLs(){
  
  //URL processor for listener to call upon received message
  function processURLThreatLevel(request, sender, sendResponse) {
    //We are getting a redirected URL
    
    
    if(request.greeting == 'Final URL Dest'){
      //to be used to assess threats
      var strTitle = '';
      var threat = 0;
      var ascii = /^[ -~]+$/;
      var innerHTML_;
      //have a new attribute with the final dest after redirects
      //allows us to retain original link
      linkList[request.index].setAttribute('redirectLink', request.data);
      
      //Flag blacklisted site
      if(!request.safe){
        strTitle = strTitle + '\nWarning: BlackListed Link';
        threat += 3;
      }
    
      //Flag foreign (unusable ASCII) characters
      if (!ascii.test( decodeURI(request.data))){
         strTitle = strTitle + '\nWarning: Foreign Characters Detected';
         threat += 2;
         
      }
      
      //Flag unsecure link
      if(request.protocol != 'https:'){
        strTitle = strTitle + '\nWarning: Unsecured Link';
        threat += 1;
      }
      
      //modify title of link to report the threat
      strTitle = linkList[request.index].getAttribute('href') + strTitle;
      linkList[request.index].setAttribute('title', strTitle);
      
      //highlight according to threat
      innerHTML_ = linkList[request.index].innerHTML;
      if(threat > 0){
        var color = getColor(threat);
        linkList[request.index].innerHTML = "<span style=\"background-color: #" + color +"\">" + innerHTML_ + "</span>";
      }
      
    }
    else if(request.greeting == 'Final IMG Dest'){
      var strTitleI = '';
      var threatI = 0;
      var asciiI = /^[ -~]+$/;
      var innerHTML_I;
      //have a new attribute with the final dest after redirects
      //allows us to retain original link
      if(imgList[request.index]){
        imgList[request.index].setAttribute('redirectLink', request.data);
      }
      
      //Flag blacklisted site
      if(!request.safe){
        strTitleI = strTitleI + '\nWarning: BlackListed Link';
        threatI += 3;
      }
    
      //alert(request.data);
      //Flag foreign (unusable ASCII) characters
      if (!asciiI.test( decodeURI(request.data))){
        
         strTitleI = strTitleI + '\nWarning: Foreign Characters Detected';
         threatI += 2;
         //alert('foreign image, threat: ' + threatI); 
      }
      
      //Flag unsecure link
      if(request.protocol != 'https:'){
        strTitleI = strTitleI + '\nWarning: Unsecured Link';
        threatI += 1;
      }
      
      //modify title of link to report the threat
      strTitleI = imgList[request.index].getAttribute('src') + strTitleI;
      imgList[request.index].setAttribute('title', strTitleI);
      
      //highlight according to threat
      innerHTML_I = imgList[request.index].innerHTML;
      if(threatI > 0){
        var badLinkReplacement = "https://s3.minijuegosgratis.com/media/video-collection-img/video-collection-trollface-thumb.jpg?v=_1510313260";
		    imgList[request.index].setAttribute('src', badLinkReplacement);
      }
      
    }
  }
  
  //begin listening
  chrome.runtime.onMessage.addListener(processURLThreatLevel);
  
  //to be used to parse the links
  var url;
	var parser;
	
  //collect links
  var linkList = document.getElementsByTagName("a");
  //limited looping for testing
	for (i = 0; i < linkList.length; i++) {
	  item = linkList[i];
	  
	  //make url parsable
		
		if(item){
  		if (item.getAttribute('href')){
  		  
    		url = item.getAttribute('href');
    		console.log('index: ' + i + '   url: ' +url);
    	  parser = document.createElement('a');
        parser.href = url;
        url = parser.href;
  		}
		}
    
	  //send the url to main.js to be resolved
	  chrome.runtime.sendMessage({greeting: 'Find Redirects', url: url, index: i});
  }
  
  //collect links
  var imgList = document.getElementsByTagName("img");
  //limited looping for testing
	for (j = 0; j < imgList.length; j++) {
	  item = imgList[j];
	  
	  //make url parsable
		if(item){
  		if (item.getAttribute('src')){
  		  
    		url = item.getAttribute('src');
    		console.log('index: ' + j + '   IMG: ' + url);
    	  parser = document.createElement('a');
        parser.href = url;
        url = parser.href;
  		}
		}
    
	  //send the url to main.js to be resolved
	  chrome.runtime.sendMessage({greeting: 'Find Image Redirects', url: url, index: j});
  }
}



window.onload = function() {
    //processURLs();
};
