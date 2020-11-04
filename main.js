
// main.js

strCurrentPackage = "0.2.8";

// Declare the object that accepts each question's info
objQuesCaller = { "isProduction": false };
if (objQuesCaller.isProduction == false) {
	// Do nothing
} else {
	let getEDValue = x => x;
	let setEDValue = x => x;
}

function baseURL() {
	return (objQuesCaller.isProduction) ? baseURLProduction() : "./"

	function baseURLProduction() {
		//return "https://cdn.jsdelivr.net/npm/finance-probs@" + strCurrentPackage + "/";
		return "https://b-d-t.github.io/finance-probs/";
	}
}

// Returns the question number from my files (e.g., 433 for the algebra exponent question)
function quesNum() { return objQuesCaller.fnName.slice(6) }

// We could pass 3 informational args to the function, but no need. scriptLoaded = function( data, textStatus, jqxhr )
function scriptsLoaded() {
	let fnToCall = window[objQuesCaller.fnName];
	let objFromQues = fnToCall(objQuesCaller);
	writeHTML(objFromQues);
	return objFromQues;
}

function jsonLoaded(objQuesFileInfo) {

	const quesScriptLocation = baseURL() + "ques/" + objQuesFileInfo[quesNum()].filename;
	const udfScriptLocation = baseURL() + "supporting/user-defined-functions.js";
	const tvmScriptLocation = baseURL() + "supporting/tvm-explanations.js";
	const tvmCalcsLocation = baseURL() + "supporting/tvm-calcs.js"


	// The code below uses nested callbacks, though this risks callback hell if we keep going.
	// We need udfScript to finish loading before we do anything else.
	jQuery.getScript(udfScriptLocation, function () {
		// At this point, the UDF script has been loaded.
		// Now, we can load other scripts.
		jQuery.getScript(tvmCalcsLocation, function () {
			// At this point, the TVM Calcs script has been loaded
			// The next line loads TVM Explanations, then continues loading scripts.
			jQuery.getScript(tvmScriptLocation, function () {
				// At this point, the TVM script has been loaded
				// The next line loads quesScriptLocation, then it calls the scriptLoaded function.
				// That is, scriptLoaded happens ONLY after the external 433.js is loaded.
				jQuery.getScript(quesScriptLocation, scriptsLoaded);

			});
		});
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
		var getEDValue = funcToGetED;
		var setEDValue = funcToSetED;
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

	jQuery(qtrxDivID + "-solution").html(obj.solution);



	// Only run this on questions
	const divQuesRespName = qtrxDivID + "-response";
	if (jQuery(divQuesRespName).length) {
		if (!(objQuesCaller.isProduction === false)) {
			jQuery.when(getEDValue("objQuesResp" + strQuesNum)).then(function (edValue) {
				jQuery(divQuesRespName).html(showFeedback(edValue));
			});
		} else {
			console.log("In testing mode");
			const strHiddenQuesRespInfo = JSON.stringify({ "respFeedback": { "stuResp": "123123" }, "percCorrect": 0.08 });
			jQuery(divQuesRespName).html(showFeedback(strHiddenQuesRespInfo));
		}
	}

	finalTouches();

	function finalTouches(){
		renderMathInElement(document.getElementById('kxAutoRender')); // this is a Katex-specific function
		cleanup();
	}

	
}

// This is the last function run before returning to the HTML
function cleanup() {
	jQuery.each(objQuesCaller, function (key, val) {
		delete objQuesCaller[key];
	});
}

console.log("main.js loaded from version ", strCurrentPackage);