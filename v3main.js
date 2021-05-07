// main.js

// GLOBAL

if (typeof IS_PRODUCTION == 'undefined') {var IS_PRODUCTION = true;}
IS_PRODUCTION = !window.Qualtrics === false;

if (typeof IS_QUES_PAGE == 'undefined') {var IS_QUES_PAGE;}

function quesNumGlobal() {
    // reads 'divQues470-stem' and returns 470 as an integer
    const divID = jQuery("#kxAutoRender>div").attr('id');
    if (!divID) {
        IS_QUES_PAGE = false;
        return undefined;
    } else {
        // Right now this only works for capital budgeting questions and questions from Sport Data Analytics (IDs >31400)
        // If students are working on any earlier questions, quit out of here by setting IS_QUES_PAGE to false.
        const regexMatch = divID.match(/(divQues)(\d*)(\-*)/);
        const thisQuesNum = parseInt(regexMatch[2]);
        const capBudgQues = [467,468,469,470,471];
        if ( capBudgQues.includes(thisQuesNum) || (thisQuesNum > 31400) ){IS_QUES_PAGE = true}

        return thisQuesNum;
    }
}

function mainFunc($) {
    "use strict";
    const self = this;
    const getEDValue = (edKey) => Qualtrics.SurveyEngine.getEmbeddedData(edKey);
    const setEDValue = (edKey, edValue) => Qualtrics.SurveyEngine.setEmbeddedData(edKey, edValue);

    // Returns the question number as an integer, and sets the IS_QUES_PAGE variable
    // E.g., self.quesNum = 470
    self.quesNum = quesNumGlobal(); // FIX: I need a better way to do the quesNum. 

    if (typeof IS_QUES_PAGE === 'undefined' || IS_QUES_PAGE === false) {
        console.log('Not a v3 problem. Cancelling any further v3 references and code.');
        return "Cancelling all code";
    };


    let udf, tvmcalc, tvmexpl, capbudg, Finance; // classes
    let jsInfo;
    let ques = null;


    // buildPage is called after loadJSFiles is done.
    // It receives an object (varsObj) that contains all the variables for this question (quesVars, calcVars, and displayVars), either from Qualtrics embedded data or from the question definition (e.g., 468.js).
    // Those variables have the simple variable names, NOT the long, unique ones with prefixes. 
    function buildPage(varsObj) {
        // const v = varsObj; // Do I need this? I don't think I do.

        // We pass the varsObj to the question itself (e.g., 468.js), which has the pageContent function.
        // That function returns an object with ansBoxMessage, stem, solution, and response; those are mostly just HTML. We duplicate that object here as objPageContent.
        const objPageContent = ques.pageContent(varsObj);

        // objPageContent is used to populate the HTML on the page itself. We also store it as part of the embedded data, even though it's wasteful to do so; I think it will make it easier to re-create student's questions for them after the fact or in other mediums (e.g., within Python)
        const divRoot = '#divQues' + self.quesNum;
        $(divRoot + '-stem').html(objPageContent.stem);
        $(divRoot + '-solution').html(objPageContent.solution);

        // Create aryAnsboxKeys, an array of variable names from the data-ansboxkey values.
        // These are in the order in which they appear on the page (though it doesn't matter what order they're in, as long as the order stays constant).
        // Sample data returned: ["ansPaybackPeriodReg", "ansPaybackPeriodDisc", "ansNPV"]
        const aryAnsboxKeys = $(divRoot + '-stem input, ' + divRoot + '-stem select').map(function() {
            return jQuery(this).data('ansboxkey'); 
        }).get();
console.log('aryAnsboxKeys', aryAnsboxKeys);
        // Pre-populate the boxes if the student has already submitted answers, clicks off, and then clicks back to this question again
        // Fetch an object with the student's previous responses to this question
        const objStuRespAnsbox = fetchStuRespAnsbox(aryAnsboxKeys);
console.log('fetchStuRespAnsbox returned objStuRespAnsbox as',udf.logObj(objStuRespAnsbox) );
        // If the object comes back empty, do nothing. Otherwise, populate the answer boxes with the student's submissions.
        if (jQuery.isEmptyObject(objStuRespAnsbox)) {
            // Do nothing
            console.log('objStuRespAnsbox returned empty from fetchStuRespAnsbox');
        } else {
            jQuery.each(aryAnsboxKeys, (idx, theAnsboxValue) => { 
                // Return the full element that has this finance variable as the value of data-ansboxKey. This is the <input> or <select> box.
                const objTheElement = document.querySelectorAll(`[data-ansboxkey='${theAnsboxValue}']`)[0];
                objTheElement.value = objStuRespAnsbox[theAnsboxValue];
            });
        }

        // Check that the response DIV does NOT exist on this page (e.g., there's no divQues470-response). If there's no response DIV (i.e., the if statement returns true), we know this is a Question page and not a Solution page.
        // Solution pages READ data, but we want to prevent them from WRITING any of their data (i.e., we don't want to store anything from a Solution page into Qualtrics embedded data).
        if (!(jQuery("#divQues" + self.quesNum + "-response").length)) {

            // Returned true, which means it did NOT find the response DIV.
            // Thus, we know this is a Question page and we want to write variables from it to Qualtrics embedded data. 

// console.log('varsObj:', varsObj);

            if (IS_PRODUCTION) {

                // Store the existing variables and question HTML as a stringified JSON variable (e.g., strQues468VarsStorage) in Qualtrics embedded data
                // Later, when the page is submitted, we'll append the student's submission(s) to this variable.
                storeQuesRespVars(varsObj, varsObj.calcTheAns, objPageContent);

                // addOnPageSubmit is a Qualtrics function that accepts an optional parameter called 'type' (which we call 'submitType'). https://s.qualtrics.com/WRAPI/QuestionAPI/classes/Qualtrics%20JavaScript%20Question%20API.html#method_addOnPageSubmit
                // When the user clicks a button, Qualtrics passes the 'type' parameter ('submitType', as we call it) to addOnPageSubmit.
                // Possible values from submitType: ["jump", "next", "prev"]. It depends on how the page was submitted (i.e., which button was clicked). Clicking to go to another question via the floating menu counts as a 'jump'.
                Qualtrics.SurveyEngine.addOnPageSubmit(function (submitType) {
                    // qtrxQuesID is the internal, stable ID of the question within Qualtrics (e.g., QID1310444524)
                   const qtrxQuesID = Object.keys(Qualtrics.SurveyEngine.QuestionInfo)[0];

                    // The built-in Qualtrics system only long-term saves the responses when the user clicks 'Next.' I warn the students about that, as does Qualtrics.
                    // My system should save the response no matter what button the student clicks. 
                   const qtrxSubmitType = submitType;

                    // For v1 and v2 of these Problem Sets, this addOnPageSubmit code was stored in Qualtrics for each individual question. That code within Qualtrics prepared objRenderQuesResp and sent it to fnQuesResp(objPageSubmit) on main.js, who renamed the object twice (i.e., objRenderQuesResp == objPageSubmit == objRespFeedback). In v3, we're cutting out that back & forth by handling the whole process on v3main.js.

                    // TWO WAYS FOR STUDENTS TO SUBMIT ANSWERS (mutually exclusive)
                        // 1. QualtricsInputBox: Qualtrics Text-input-type question with a single input box
                        // or
                        // 2. CustomInputBoxes: Qualtrics text/graphic-type question with no input boxes, other than the 1+ boxes that we create when building the question (all of which have the HTML tag "data-ansboxkey")
                    // Must be choice #1 or #2 -- we cannot create boxes on a question (#2) that also has the Qualtrics input box (#1). (well, we could, but my scoring code wouldn't work)
                    // Choice #2 could only have 1 box, however. Thus, someday we could replace all Qualtrics questions and just use custom boxes instead.
                    
                    // If the Qualtrics input box exists, pull the student's submitted answers from there.
                    // Otherwise, pull the submissions from the fields we create as part of the code (e.g., for the multipart capital budgeting problems).
                    // Any field we create must be an 'input' element with a "data-ansboxkey" HTML attribute that is unique for that page (e.g., the same page cannot have two "ansIRR" boxes)

                    // Check if there is an input box with that id on the page.
                    // If it doesn't exist, qtrxInputBox returns null and we assume that the page only has our boxes.
                    const qtrxInputBox = document.getElementById("QR~" + qtrxQuesID); 
                    const respSubmitMethod = !qtrxInputBox ? "CustomInputBoxes" : "QualtricsInputBox";

                    let objStuResp={};
                    let objCorrectAns={};
                    let percCorrect=0;

                    if (respSubmitMethod=="QualtricsInputBox"){

                        // Sanitize student submission and convert empties to 0s
                        const stuRespToReturn = prepareStudentSubmissionValue(qtrxInputBox.value)
                        // This creates an object with one key:value pair, and the key is always "theStuResp"
                        objStuResp = {theStuResp: stuRespToReturn};

                        // This creates an object with one key:value pair, and the key is always "theAns"
                        objCorrectAns = {theAns: varsObj.calcTheAns};

                        // Determine student's score on the question
                        percCorrect = respPercCorrect(objStuResp.theStuResp, objCorrectAns.theAns);

                    } else { // respSubmitMethod == CustomInputBoxes
                        // There is NOT a Qualtrics input box on that page. In that case, we'll only look at our boxes (input and select).

                        const objCustomInputBoxStuSubmit = createCustomInputBoxStuSubmit(varsObj, aryAnsboxKeys);
                        objStuResp = objCustomInputBoxStuSubmit.stuRespObject;
                        objCorrectAns = objCustomInputBoxStuSubmit.correctAnsObject;
                        percCorrect = objCustomInputBoxStuSubmit.thePercCorrect;
                    };

                    // Read the embedded data variable from Qualtrics (e.g., strQues468VarsStorage),
                    // append the student's answer(s) to that object, then re-write the object back to embedded data
   
                    // Retrieve stored question information from Embedded data and convert it to an object
                    let strQuesVarsStorageKey = "strQues" + self.quesNum + "VarsStorage";

                    // Once the old data have been read into memory, append the results based on the student's responses
                    jQuery.when(getEDValue(strQuesVarsStorageKey))
                    .then(function (edValue) {    
                        let objQuesResp = JSON.parse(edValue);

                        // Student's submission(s) for the question
                        objQuesResp["objStuResp"] = objStuResp;

                        objQuesResp["objCorrectAns"] = objCorrectAns;

                        // Add the score to the QuesResp object
                        objQuesResp["percCorrect"] = percCorrect;

                        // Store feedback that will be shown to user when they see the Solution
                        objQuesResp["respFeedback"] = feedbackToShow(objQuesResp);
// console.log('****This is what will be written back into the embedded data for '+strQuesVarsStorageKey+' after student submits (in theory):', udf.logObj(objQuesResp));
                        const strQuesRespED = JSON.stringify(objQuesResp);
                        return strQuesRespED;
                    })
                    .done(function(strQuesRespED){
                        // Write quesResp to Embedded Data (assuming we're in production, although I don't think this function ever gets called during testing anyway).
                        return setEDValue(strQuesVarsStorageKey,strQuesRespED);
                    });

                });
            } else { // IN TESTING ENVIRONMENT               
                let objStuResp={}; let objCorrectAns={}; let percCorrect=0;
                const objCustomInputBoxStuSubmit = createCustomInputBoxStuSubmit(varsObj, aryAnsboxKeys);
                objStuResp = objCustomInputBoxStuSubmit.stuRespObject; objCorrectAns = objCustomInputBoxStuSubmit.correctAnsObject; percCorrect = objCustomInputBoxStuSubmit.thePercCorrect;
                console.log('objStuResp',objStuResp); console.log('objCorrectAns',objCorrectAns); console.log('percCorrect',percCorrect);
            };
        } else { // This is a Solution page
            let strFeedback='';

            if (IS_PRODUCTION) {

                // Retrieve stored question information from Embedded data and convert it to an object
                let strQuesVarsStorageKey = "strQues" + self.quesNum + "VarsStorage";

                // Once the old data have been read into memory, append the results based on the student's responses
                jQuery.when(getEDValue(strQuesVarsStorageKey)).then(function (edValue) {
                    let objQuesResp = JSON.parse(edValue);
                    strFeedback = objQuesResp["respFeedback"];
                });
            } else { // TESTING solution page
                strFeedback = "No feedback available in testing mode."
            }

            // I haven't messed with this much yet, but if I wanted,
            // I could include responses from the questions themselves (e.g., based on certain student answers).
            // Just add obj.response=`Some text to show user`; to each question file (e.g., 471.js)
            const strQuesSpecificResponse = !objPageContent.response ? '' : objPageContent.response;
            
            $(divRoot + '-response').html(strFeedback + '<br />' + strQuesSpecificResponse);
    
        } // End of solution page

        // Returns HTML for displaying score to students
        function feedbackToShow(objQuesResp) {
            let dispPercCorrect, resultIcon, stuRespLocal;
            
            try {
                dispPercCorrect = parseFloat(objQuesResp.percCorrect * 100).toFixed(0) + "%";
                resultIcon = dispPercCorrect == "100%"
                    ? `<span style="color: green;">&#10004;</span>`
                    : `<span style="color: red;">&#10008;</span>`;
                stuRespLocal = "Your answer is embedded in the question at the top of the page."
            }
            catch (err) {
                console.log("Error trying to set the dispPercCorrect variable");
                stuRespLocal = "The response is stored in the system, but it cannot be retrieved at this time.";
                dispPercCorrect = "Not available.";
                resultIcon = "";
            }
            // finally {
            //     stuRespLocal = "The response is stored in the system, but it cannot be retrieved at this time.";
            //     dispPercCorrect = "Not available.";
            //     resultIcon = "";
            // }
        
            let dispQuesResp = `
                ${stuRespLocal}
                <br />
                Score: ${dispPercCorrect}
                ${resultIcon}
            `;
        
            return dispQuesResp;
        }
        
        // Each student sees variables unique to that student (randomly generated).
        // This function writes those to Qualtrics embedded data when the Question page is first generated.
        // When the student leaves the Question page (even if he/she doesn't submit a response), 
        // the student's answer will be combined with these variables and written as a different variable (e.g., strQues470VarsStorage) in the Qualtrics embedded data.
        function storeQuesRespVars (theQuesVars, theAns, thePageContent) {
            let objQuesResp = {
                "quesNum": self.quesNum,
                "objQuesVars": theQuesVars, // the property stores the variables as an object
                "objPageContent": thePageContent // this is what the student sees. It's only for our reference, and maybe recreating the problems for students after the fact or in Python.
            };
            const strQuesVarsStorageKey = "strQues" + self.quesNum + "VarsStorage"; // strQues468VarsStorage
            const strQuesVarsStorageVal = JSON.stringify(objQuesResp);

            // 
            if (IS_PRODUCTION) {
                setEDValue(strQuesVarsStorageKey, strQuesVarsStorageVal);
            } else { console.log("No setEDValue for " + strQuesVarsStorageKey + ": " + strQuesVarsStorageVal) }
        }

        // This function could live within the if(IS_PRODUCTION) section above, but I keep it here so it can be used when testing locally too.
        function createCustomInputBoxStuSubmit(varsObj, aryAnsboxKeys){

            // Use aryAnsboxKeys to parse out the correct answers from varsObj.calcTheAns
            // These are stored in an array that's in the same order as aryAnsboxKeys.
            // Sample output: [1.9986096628432395, 2.310157473062218, 613013.901619191]
            const aryCorrectAnswers = aryAnsboxKeys.map(function(theAnsboxValue){ return varsObj.calcTheAns[theAnsboxValue]; });

            // aryStuSubmissions is an array of the student's answers in the same order as aryAnsboxKeys.
            // Sample output when the middle field is left blank: ["123", 0, "789"]
            const aryStuSubmissions = aryAnsboxKeys.map(function(theAnsboxValue) { 
                // Return the full element that has this variable as the value of data-ansboxKey. This is the <input> or <select> box.
                const objTheElement = document.querySelectorAll(`[data-ansboxkey='${theAnsboxValue}']`)[0];

                // If it's a select box or Excel formula, use it as is. Otherwise, sanitize the student's response before going any further.
                let sanitizedStuResp = '';
                if (jQuery(objTheElement).is("select") || jQuery(objTheElement).hasClass("excel-formula") ) {
                    // We don't want to sanitize Excel formulas because we'll lose key parts of the formula itself
                    sanitizedStuResp = objTheElement.value;
                } else {
                    sanitizedStuResp = sanitizeInput(objTheElement.value);
                };

                // If the input/select box is empty, return a 0
                return !sanitizedStuResp ? 0 : sanitizedStuResp;
            });
//console.log('createCustomInputBoxStuSubmit has aryStuSubmissions as', aryStuSubmissions);

            // Convert two arrays into an object of key:value pairs where the finance variables are the keys and other info are the values (e.g., the student's responses) 
            const stuRespObject = Object.fromEntries(aryAnsboxKeys.map((_, idx) => [aryAnsboxKeys[idx], aryStuSubmissions[idx]]));
            const correctAnsObject = Object.fromEntries(aryAnsboxKeys.map((_, idx) => [aryAnsboxKeys[idx], aryCorrectAnswers[idx]]));
            
            // Determine points earned for the question.
            // Each part of the question (i.e., ansbox) is worth the same amount; e.g., if there are 4 ansbox input spaces, each is worth 25% of the question overall.
            const thePercCorrect = respPercCorrect(aryStuSubmissions, aryCorrectAnswers);
console.log("thePercCorrect",thePercCorrect);
            return {stuRespObject, correctAnsObject, thePercCorrect};
        };

        // Pass a single submission (and answer) to check or pass arrays of submissions (and correct answers).
        // You can pass a number, string, or RegExp as the correctAns. E.g., const theRegex = new RegExp("^abc$", "ig"); respPercCorrect("ab", theRegex);
        function respPercCorrect(stuResp, correctAns, rawTolerance) {
console.log("########## respPercCorrect received the following. stuResp:", stuResp, "correctAns:",correctAns);
            // Return 0 if stuResp is null or empty (but allow stuResp = 0 to continue)
            if (stuResp === null || stuResp === "") { return 0; }

            // If this is only checking a single value, run the check and return 1/0
            if (!Array.isArray(correctAns)) { return percCorrect(stuResp, correctAns, rawTolerance); }

            let ptsPossible = 0;
            let ptsEarned = 0;

            // If the student submitted only one answer, convert it to an array
            stuResp = !Array.isArray(stuResp) ? stuResp.split() : stuResp

            // For multi-answer questions, assign 1 point to each answer.
            // Students can earn a point each time through.
            jQuery.each(correctAns, (index, curAns) => {
                ptsPossible += 1;
                const curResp = stuResp[index] || 0; // replace empty student responses with 0s
                ptsEarned += percCorrect(curResp, curAns, rawTolerance);
            });

            return ptsEarned / ptsPossible;

            function percCorrect(respToEvaluate, paramCorrectAns, rawTolerance) {
                
                let curCorrectAns = parseFloat(paramCorrectAns);
                let isCorrect;

                // If using parseFloat creates an NaN error,
                // we assume that the correct answer is a string and compare string to the RegEx (or the other string).
                // Otherwise, we continue with the code and evaluate the numbers.
                if (!curCorrectAns){
                    const blnCorrectAnsIsRegex = paramCorrectAns instanceof RegExp;
                    if (blnCorrectAnsIsRegex){
                        isCorrect = paramCorrectAns.test(respToEvaluate.toString()); // Returns true/false based on the regex
                    } else {
                        // Since paramCorrectAns isn't a number, and it's not a RegExp, it must be a string.
                        if (!respToEvaluate){return 0};
                        isCorrect = respToEvaluate.toString().toLowerCase() == paramCorrectAns.toLowerCase();
                    };
                    return isCorrect ? 1 : 0;
                }
                
                // If a rawTolerance is passed, the code will accept answers +/- that amount.
                // Otherwise, it uses a percent difference (i.e., curCorrectAns +/- 1.25% ).
                // The default is 0.0125 (2^-3) because the binary system is happier with that.
                const toleranceAmt = rawTolerance || Math.abs(curCorrectAns) * 0.0125;

                // Clean text in the student's answer
                const numRespToEvaluate = convertRespToNum(respToEvaluate);
                isCorrect = Math.abs(numRespToEvaluate - curCorrectAns) <= toleranceAmt; // must use <= to allow for 0 values

                return isCorrect ? 1 : 0;
            }

            function convertRespToNum(theResp) {
                let resp = theResp.toString().trim();

                const charsToRemove = [",", "\\$"];
                jQuery.each(charsToRemove, function (i, char) {
                    const regex = new RegExp(char, "g");
                    resp = resp.replace(regex, '');
                });

                return parseFloat(resp);
            }
        }

        
        function prepareStudentSubmissionValue(stuRespOrig){
            // Sanitize the student's response
            const sanitizedStuResp = sanitizeInput(stuRespOrig);

            // If the input box is empty, return a 0
            const stuRespToReturn = !sanitizedStuResp ? 0 : sanitizedStuResp;
            
            return stuRespToReturn;
        }

        
        function sanitizeInput(userInput) {
            // Code from https://stackoverflow.com/questions/2794137/sanitizing-user-input-before-adding-it-to-the-dom-in-javascript
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                "/": '&#x2F;',
                "`": '&grave;'
            };
            const reg = /[&<>"'/]/ig;
            return userInput.replace(reg, (match) => (map[match]));
        }



    } // End of buildPage






    // THIS RUNS FIRST
    // Load all the JS files
    loadJSFiles()
        // the 'Then' statement waits for a promise from the loadJSFiles function
        .then((respObj) => {
            // Get the variables that we'll use in the question

            // The 'ques' in 'ques.defineVariables()' refers to the class within the question file (e.g., fnQues468 within 468.js)
            // Thus, 'ques.defineVariables()' is like running the defineVariables() function on 468.js
            const origVars = ques.defineVariables();

            // We first try to get the variables from Qualtrics embedded data.
            // If that doesn't work, we'll get them from the ques itself (the origVars variable is stored in the line above)
            return (IS_PRODUCTION) ? fetchQuesVars(origVars, respObj["quesNum"]) : origVars;
        })
        .then((varsObj) => buildPage(varsObj));

    // If the variable is already in the embedded data, we'll use that. Otherwise, the code stores the variable in the embedded data based on our definition.
    function fetchQuesVars(objVars, quesNum = self.quesNum) {
        // Change the values so they're unique before long-term storage by adding a prefix to variable names
        const objUniqueNames = quesPrefix(objVars, quesNum, "include");

        let objQuesVarsActual = {};
        if (!IS_PRODUCTION) { return objVars; };
        $.each(objUniqueNames, function (theKey, valueFromQues) {
            $.when(getEDValue(theKey)).then(function (edValue) {
                // If the key exists within the embedded data, use that value
                if (edValue) {
                    objQuesVarsActual[theKey] = edValue;
                    // If the key does not exist within the ED, set it and return the same value that we started with
                } else {
                    $.when(setEDValue(theKey, valueFromQues)).then(function () {
console.log('objQuesVarsActual',udf.logObj(objQuesVarsActual));
console.log(`setEDValue ran. Now objQuesVarsActual[theKey] = valueFromQues ---> objQuesVarsActual[${theKey}] = ${valueFromQues};`);
                        objQuesVarsActual[theKey] = valueFromQues;
                    });
                };
            });
        });

        // Remove the prefixes and return the object with the correct values
        return quesPrefix(objQuesVarsActual, quesNum, "remove");
    }

    // If the student has values already in the embedded data, we'll pre-populate the boxes with those. Otherwise, we'll leave the boxes empty.
    function fetchStuRespAnsbox(aryAnsboxKeys) {

        // Retrieve stored question information from Embedded data and convert it to an object
        const strQuesVarsStorageKey = "strQues" + self.quesNum + "VarsStorage";

        
        let objStuRespAnsbox = {};
        
        if (!IS_PRODUCTION){return {}};

        jQuery.when(getEDValue(strQuesVarsStorageKey))
        .then(function (edValue) {

            // The storage key doesn't exist the first time the page is loaded, so we'll return an empty object
            if (!edValue) { return {} };

            const objQuesResp = JSON.parse(edValue);
// console.log('objQuesResp returned from embedded data is', udf.logObj(objQuesResp)); // This is coming back with the right stuff
            // Student's submission(s) for the question
            const objStuResp = objQuesResp["objStuResp"];

            if (!objStuResp){
                // No student response data for that question, probably because it's the first time the page has loaded
                return {};
            } else {
                jQuery.each(aryAnsboxKeys, (idx, strAnsboxKey) => objStuRespAnsbox[strAnsboxKey] = parseFloat(objStuResp[strAnsboxKey]));

                // If all the responses are 0, that probably means the student just clicked past the question without submitting an answer.
                // We want them to see the placeholder text for that question, so we return null instead of 0.
                const sumOfValues = Object.values(objStuRespAnsbox).reduce((a, b) => a + b);
                if (sumOfValues==0) { objStuRespAnsbox = {} };

                return objStuRespAnsbox;
            };
        })
        .done(()=>{return objStuRespAnsbox});

// console.log('This is objStuRespAnsbox being returned from fetchStuRespAnsbox', udf.logObj(objStuRespAnsbox));
        return objStuRespAnsbox;
    }

    // Add prefix to create a key that's unique across ALL questions in the course.
    // This can be passed a string or an object.
    // If passed an object, it will iterate over the object to add/remove prefixes to all the Keys.
    // Passing an empty string returns only the prefix. E.g., strPrefix = quesPrefix(''); // returns "var_q433z__"
    function quesPrefix(caller, quesNum = self.quesNum, action = "include") {
        const strPrefix = "var_q" + quesNum + "z__";
        const hasPrefix = (curKeyName) => curKeyName.startsWith(strPrefix);
        const addPrefix = (curKeyName) => strPrefix + curKeyName;
        const removePrefix = (curKeyName) => curKeyName.split(strPrefix)[1];

        if (typeof caller === "string") { return action === "include" ? addPrefix(caller) : removePrefix(caller) };

        if (typeof caller === "object") {
            let objToReturn = {};
            switch (action) {
                case "include":
                    // Check each key to see if it has a prefix. If so, store the key as is (objToReturn[key]=value).
                    // If not, add the prefix to the key before storing (objectToReturn[var_q470z__key]=value).
                    $.each(caller, (key, value) => objToReturn[hasPrefix(key) ? key : addPrefix(key)] = value);
                    break;
                case "remove":
                    $.each(caller, (key, value) => objToReturn[hasPrefix(key) ? removePrefix(key) : key] = value);
                    break;
                default:
                    objToReturn = caller;
                    break;
            };
            return objToReturn;
        };
    }
    

    // Load each of the scripts in order using async-await Promises.
    async function loadJSFiles() {
        // This file begins by invoking itself and loading any of the other necessary files. 
        // The UDF script loads first. ONLY ONCE THAT IS LOADED does it try to load the next script.
        // Only once that script is loaded does it try to load the following, and so on.
        // At the end, once all the necessary supporting scripts are loaded, it loads ques (the actual script for the given question).
        // Once that final script is loaded (i.e., ONLY after the external 433.js is loaded),
        // it calls the function to start doing the rest of the work.
        const jsPaths = () => {
            const baseURL = IS_PRODUCTION ? "https://b-d-t.github.io/finance-probs/" : "./"
            let objJSPaths = {
                udf: "supporting/v3user-defined-functions.js",
                tvmexpl: "supporting/v3tvm-explanations.js",
                tvmcalc: "supporting/v3tvm-calcs.js",
                capbudg: "supporting/v3capbudg.js",
                ques: ''
            };
            return new Promise((resolve) => {
                // Find the location for the JSON that has all the file names for each question and add it to the jsLocation object
                $.when($.getJSON(baseURL + "supporting/objQuesFileInfo.json", resp => objJSPaths.ques = 'ques/' + resp[self.quesNum].filename))
                    // Prepend each file in the objJSPaths object with the baseURL
                    .then((resp) => $.each(objJSPaths, (key, value) => objJSPaths[key] = baseURL + value))
                    .done((resp) => {
                        if (typeof objJSPaths['quesNum'] == 'undefined') {
                            objJSPaths['quesNum'] = self.quesNum;
                        }
                        resolve(objJSPaths)
                    });
            });
        }

        let objJS = { "IS_PRODUCTION": IS_PRODUCTION };
        jsInfo = await jsPaths();

        const udfLoad = () => new Promise(resolve => $.getScript(jsInfo.udf, () => {
            objJS.udf = new UDFClass($, objJS);
            return resolve(objJS.udf);
        }));
        const financeLoad = () => new Promise(resolve => {
            objJS.Finance = new udf.financejs; // this is already loaded as part of UDF, so the class here is more like a shortcut
            return resolve(objJS.Finance);
        });
        const tvmcalcLoad = () => new Promise(resolve => $.getScript(jsInfo.tvmcalc, () => {
            objJS.tvmcalc = new TVMCalcsClass($, objJS);
            return resolve(objJS.tvmcalc);
        }));
        const tvmexplLoad = () => new Promise(resolve => $.getScript(jsInfo.tvmexpl, () => {
            objJS.tvmexpl = new TVMExplanation($, objJS);
            return resolve(objJS.tvmexpl);
        }));
        const capbudgLoad = () => new Promise(resolve => $.getScript(jsInfo.capbudg, () => {
            objJS.capbudg = new CapitalBudgeting($, objJS);
            return resolve(objJS.capbudg)
        }));
        const quesLoad = () => new Promise(resolve => $.getScript(jsInfo.ques, () => {
            // Get the name of the top-level function in the ques file that we loaded (e.g., fnQues470)
            const quesFunction = 'fnQues'+self.quesNum;

            // Creates constructor based on that finance question (e.g., function fnQues470)
            // Also passes all the JS files to the question, received as objFromMain. The question then chooses which ones to use.
            objJS[quesFunction] = new window[quesFunction]($, objJS);
            return resolve(objJS[quesFunction]);
        }));

        
        udf = await udfLoad();
        Finance = await financeLoad();
        tvmcalc = await tvmcalcLoad();
        tvmexpl = await tvmexplLoad();
        capbudg = await capbudgLoad();
        ques = await quesLoad();
        
        return jsPaths(); //jsPaths() serves as the Promise to return to the caller
        
    };
} // end of mainFunc

if (IS_PRODUCTION) {
    Qualtrics.SurveyEngine.addOnload(function () {
        // Self-invokes the file. Putting .bind allows me to use self=this inside the function, which wouldn't have worked otherwise in strict mode
        jQuery(document).ready(() => {
            mainFunc.bind(mainFunc, jQuery)();
        });
    });
} else {
    // Self-invokes the file. Putting .bind allows me to use self=this inside the function, which wouldn't have worked otherwise in strict mode
    jQuery(document).ready(() => {
        mainFunc.bind(mainFunc, jQuery)();
    });
}
