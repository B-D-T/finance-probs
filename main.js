// main.js
let strCurrentPackage = "0.1.3";

// Declare the object that accepts each question's info
objQuesCaller = { "isProduction": false };
if (objQuesCaller.isProduction = false) {
	// Do nothing
} else {
	let getEDValue = x => x;
	let setEDValue = x => x;
}

baseURL = function() {
	return (objQuesCaller.isProduction) ?  baseURLProduction() : "./"

	function baseURLProduction(){
		console.log("main.js loaded from version ", strCurrentPackage);
		return "https://cdn.jsdelivr.net/npm/finance-probs@" + strCurrentPackage + "/";
	}
}

// Returns the question number from my files (e.g., 433 for the algebra exponent question)
quesNum = () => objQuesCaller.fnName.slice(6)

// We could pass 3 informational args to the function, but no need. scriptLoaded = function( data, textStatus, jqxhr )
scriptsLoaded = function () {
	fnToCall = window[objQuesCaller.fnName];
	objFromQues = fnToCall(objQuesCaller);
	writeHTML(objFromQues);
	return objFromQues;
}

jsonLoaded = function (objQuesFileInfo) {

	const quesScriptLocation = baseURL() + "ques/" + objQuesFileInfo[quesNum()].filename;
	const udfScriptLocation = baseURL() + "supporting/user-defined-functions.js"

	// scriptLoaded happens ONLY after the external 433.js is loaded.
	// We also need udfScript to finish loading. 
	// The code below uses nested callbacks, though this risks callback hell if we keep going.
	jQuery.getScript(udfScriptLocation, function () {
		// At this point, the UDF script has been loaded
		jQuery.getScript(quesScriptLocation, scriptsLoaded);
	});
}


// This loads first because it's called by the HTML
function loadQues(paramQuesCaller, funcToGetED, funcToSetED) {
	jQuery.each(paramQuesCaller, function (theKey, theValue) {
		objQuesCaller[theKey] = theValue;
	});
	let jsonLocation = baseURL() + "supporting/objQuesFileInfo.json";

	if (objQuesCaller.isProduction) {
		// This is where we populate objQuesCaller and getED() so they can be used globally
		getEDValue = funcToGetED;
		setEDValue = funcToSetED;
	}

	// The first argument fetches objQuesFileInfo.json.
	// The 1st arg passes the JSON, as an object, the second argument (the callback).
	// The second argument only runs once it gets objQuesFileInfo from the first argument. 
	jQuery.getJSON(jsonLocation, jsonLoaded);

}

function writeHTML(obj) {
	let strQuesNum = quesNum().toString();
	const qtrxDivID = "#divQues" + strQuesNum;
	jQuery(qtrxDivID + "-stem").html(obj.stem);

	const qtrxQuesID = objQuesCaller.qtrxQuesInfo.questionId; // this is the internal Qualtrics ID
	jQuery("#" + qtrxQuesID + " .InputText").attr("placeholder", obj.ansBoxMessage);

	jQuery(`${qtrxDivID}-solution`).html(obj.solution);


	// Only run this on questions
	const divQuesRespName = `${qtrxDivID}-response`;
	if (jQuery(divQuesRespName).length) {
		jQuery(divQuesRespName).html(showFeedback(getEDValue("objQuesResp" + strQuesNum)));
	}

	renderMathInElement(document.getElementById('kxAutoRender'));
	cleanup();
}

// This is the last function run before returning to the HTML
function cleanup() {
	jQuery.each(objQuesCaller, function (key, val) {
		delete objQuesCaller[key];
	});
}