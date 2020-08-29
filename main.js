// Declare the object that accepts each question's object of variables
let objQuesCaller = {};

const BASE_URL = "./"; //'https://cdn.jsdelivr.net/gh/B-D-T/finance-probs@latest/'; //"./";

// We could pass 3 informational args to the function, but no need. scriptLoaded = function( data, textStatus, jqxhr )
scriptLoaded = function(){
	fnToCall = window[objQuesCaller.fnName];
    objFromQues = fnToCall(objQuesCaller.quesVars);
	return objFromQues;     // There's nothing left to do at this point, but I'm return the object anyway
}

jsonLoaded = function(objQuesFileInfo) {
	const quesNum = objQuesCaller.fnName.slice(6);
	//const scriptToLoad = BASE_URL + 'ques/' + objQuesFileInfo[quesNum].filename;
	const scriptToLoad = objQuesFileInfo[quesNum].filename; // TESTING - use line above in production
	//const udfScript = BASE_URL + 'supporting/user-defined-functions.js';
	const udfScript = "https://dl.dropbox.com/s/f8rgqsuc94cn0lf/user-defined-functions.js";// TESTING - use line above in production

	// scriptLoaded happens ONLY after the external 433.js is loaded.
	// We also need udfScript to finish loading. 
	// The code below uses nested callbacks, though this risks callback hell if we keep going.
	jQuery.getScript( scriptToLoad, function() {
		jQuery.getScript( udfScript, scriptLoaded);
	});
}

// This loads first because it's called by the HTML
function loadQues(paramQuesCaller){
	// This is where we populate objQuesCaller so it can be used globally
	objQuesCaller = paramQuesCaller;
	
	// The first argument fetches objQuesFileInfo.json.
	// The 1st arg passes the JSON, as an object, the second argument (the callback).
	// The second argument only runs once it gets objQuesFileInfo from the first argument. 
	//jQuery.getJSON(BASE_URL + 'supporting/objQuesFileInfo.json', jsonLoaded);
	jQuery.getJSON("https://dl.dropbox.com/s/0try408etjvmyc0/objQuesFileInfo.json", jsonLoaded); // TESTING - use line above in production
}