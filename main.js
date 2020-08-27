// Declare the object that accepts each question's object of variables
let objQuesCaller = {};
// let objFromQues = {}; I don't need this, but someday I might, so I'm keeping it around

const baseURL = 'https://cdn.jsdelivr.net/gh/B-D-T/finance-probs/';

// We could pass 3 informational args to the function, but no need. scriptLoaded = function( data, textStatus, jqxhr )
scriptLoaded = function(){
	fnToCall = window[objQuesCaller.fnName];
    objFromQues = fnToCall(objQuesCaller.quesVars);
    // There's nothing left to do at this point
	return objFromQues;
}

jsonLoaded = function(objQuesFileInfo) {
	const quesNum = objQuesCaller.fnName.slice(6);
	scriptToLoad = baseURL + 'ques/' + objQuesFileInfo[quesNum].filename;
	// scriptLoaded happens ONLY after the external 433.js is loaded.
	jQuery.getScript( scriptToLoad, scriptLoaded);
}

// This loads first because it's called by the HTML
function loadQues(paramQuesCaller){
	// This is where we populate objQuesCaller so it can be used globally
	objQuesCaller = paramQuesCaller;
	
	// The first argument fetches objQuesFileInfo.json.
	// The 1st arg passes the JSON, as an object, the second argument (the callback).
	// The second argument only runs once it gets objQuesFileInfo from the first argument. 
	jQuery.getJSON(baseURL + 'supporting/objQuesFileInfo.json', jsonLoaded);
}