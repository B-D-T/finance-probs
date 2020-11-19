// main.js

// GLOBAL

if (typeof IS_PRODUCTION == 'undefined') { var IS_PRODUCTION = true; }
IS_PRODUCTION = !window.Qualtrics === false;

if (typeof IS_QUES_PAGE == 'undefined') { var IS_QUES_PAGE; }

function quesNumGlobal() {
    // reads 'divQues470-stem' and returns 470
    const divID = jQuery("#kxAutoRender>div").attr('id');
    if (!divID) {
        IS_QUES_PAGE = false;
        return undefined;
    } else {
        // Right now this only works for capital budgeting questions.
        // If students are working on any earlier questions, quit out of here by setting IS_QUES_PAGE to false.
        const regexMatch = divID.match(/(divQues)(\d*)(\-*)/);
        const thisQuesNum = parseInt(regexMatch[2]);
        const capBudgQues = [467, 468, 469, 470, 471];
        IS_QUES_PAGE = capBudgQues.includes(thisQuesNum);

        return thisQuesNum;
    }
}

function mainFunc($) {
    "use strict";
    const self = this;

    self.quesNum = quesNumGlobal(); // FIX: I need a better way to do the quesNum. 

    if (typeof IS_QUES_PAGE === 'undefined' || IS_QUES_PAGE === false) { return "Cancelling all code" };


    let udf, tvmcalc, tvmexpl, capbudg, Finance; // classes
    let jsInfo;
    let ques = null;


    function buildPage(varsObj) {
        // This is invoked only after all the scripts are loaded

        // varObj has all variables to use for customizing each question & solution in Qualtrics.
        // Those might be variables created by the question itself milliseconds earlier,
        // or they could be variables from embedded data.

        // Each question has a pageContent function which returns an object.
        // That object has 2+ properties: "stem", "solution", and usually "ansBoxMessage"
        // Each of those properties are pure HTML specific to that question.
        // The next line calls that function and passes it all the variables to use when building the page
        // It also returns objContent.allVars, which is every variable defined in quesVars, calcVars, and displayVars
        const objContent = ques.pageContent(varsObj);

        const divIDRoot = '#divQues' + self.quesNum;
        const strHTMLStem = `<div class="my-qtrx-page qtrx-page-elem ques-stem">${objContent.stem}</div>`;
        const strHTMLSolution = `<div class="my-qtrx-page qtrx-page-elem ques-solution">${objContent.solution}</div>`;
        $(divIDRoot + '-stem').html(strHTMLStem); // HTML built by the ques file
        $(divIDRoot + '-solution').html(strHTMLSolution); // HTML built by the ques file
        storeQuesRespVars(objContent.allVars)
            .then(
                objQuesResp => {
                    console.log('This should be objQuesResp',objQuesResp);
                    createHTMLFeedbackToStudent(objQuesResp)
                    .then(
                        htmlResp => {
                            objContent.response = htmlResp;
                            const strHTMLResponse = `<div class="my-qtrx-page qtrx-page-elem resp-to-student">${objContent.response}</div>`;
                            $(divIDRoot + '-response').html(strHTMLResponse);
                            return objContent
                        },
                        err => {console.error(Error("Stupid error. "+err))}
                        );
                    },
                err => {
                    console.log('Why is there an error? ',err); return objContent;
                }
            )
            .then((obj) => {
                // Add code to take actions when student clicks a button
                // Most importantly, it waits for the Qualtrics to populate the variable object.
                $.when(qtrxButtonHandler(self.quesNum))
                    .then((resp) => console.log("This runs last! Yay!", resp));
            });
    }

    function storeQuesRespVars(theQuesVars) {
        // Each student sees variables unique to that student (randomly generated)
        // This function writes those embedded data.
        // When the student leaves the page, 
        // the student's answer will be combined with those variables and written as a different variable in the Qualtrics embedded data.

        return new Promise((storeQRVResolve, storeQRVReject) => {
            let objQuesResp = {
                "quesNum": self.quesNum,
                "objQuesVars": theQuesVars, // the property stores an object
                "correctAns": theQuesVars.correctAns
            };
            let strQuesVarsStorageKey = "strQues" + objQuesResp.quesNum + "VarsStorage"; // strQues433VarsStorage
            //console.log('udf -> objQuesResp = ', objQuesResp);
            let strQuesVarsStorageVal = JSON.stringify(objQuesResp);

            if (IS_PRODUCTION === true) {
                udf.setEDValue(strQuesVarsStorageKey, strQuesVarsStorageVal)
                    .then(
                        (qtrxResp) => storeQRVResolve(objQuesResp),
                        (err) => storeQRVReject(Error("Encountered an error trying to store variables in Qualtrics: " + err, objQuesResp)))
            } else {
                // console.log("No setEDValue for " + strQuesVarsStorageKey + ": " + strQuesVarsStorageVal);
                storeQRVResolve(objQuesResp);
            }
        });
    }

    function createHTMLFeedbackToStudent(objAllVars) {
        // Returns the HTML that will populate the page

        return new Promise((resolveWithStuResp, rejectWithoutStuResp) => {
            // This function fetches the variables specific to this question from Qualtrics embedded data and loads the response text 
            const $divQuesRespName = $("#divQues" + self.quesNum + "-response"); // divQues470-response
            // Only run this on pages with a 'response' element
            if ($divQuesRespName.length) {
                if (IS_PRODUCTION) {
                    $.when(udf.getEDValue("objQuesResp" + self.quesNum)).then(function (edValue) {
                        resolveWithStuResp(()=> htmlFeedback(edValue)); // returns the HTML that will populate the page
                    });
                } else {
                    console.log("Loading response in testing mode");
                    const strFakeQuesRespInfo = JSON.stringify({ "stuResp": "123123", "percCorrect": 0.08 });
                    const htmlResp = htmlFeedback(strFakeQuesRespInfo); // returns the HTML that will populate the page
                    resolveWithStuResp(htmlResp);
                }
            } else {
                rejectWithoutStuResp(`<div>No response text available</div>`);
            }
        });

        function htmlFeedback(strEDQuesResp) {
            let objQuesResp = JSON.parse(strEDQuesResp);
            let dispPercCorrect, resultIcon, stuRespLocal;

            try {
                dispPercCorrect = parseFloat(objQuesResp.percCorrect * 100).toFixed(0) + "%";
                resultIcon = dispPercCorrect == "100%"
                    ? `<span style="color: green;">&#10004;</span>`
                    : `<span style="color: red;">&#10008;</span>`;
                stuRespLocal = objQuesResp.stuResp;
                
            }
            catch (err) {
                console.log("Error trying to set the dispPercCorrect variable");
                stuRespLocal = "Your response is stored in the system, but it cannot be retrieved at this time.";
                dispPercCorrect = "Not available.";
                resultIcon = "";
            }

            const htmlQuesResp = `
                <div class="section-head head1">Your submission</div>
                <div class="section-head head2">Your answer</div>
                <div class="stu-submission">
                    <div class="stu-entry">${stuRespLocal}</div>
                </div>
                <div class="section-head head2">Your score</div>
                <div class="stu-score">
                    <div class="stu-score-icon">${resultIcon}</div>
                    <div class="stu-perc-correct">${dispPercCorrect}</div>
                </div>
            `;

            return htmlQuesResp;
        }
    }




    // This function writes the student-question-specific variables (and student answer)
    // into long-term storage (i.e., Embedded Data).
    // The objRenderQuesResp parameter is from submitPageActions
    function setEDQuesRespVars(objRenderQuesResp) {

        // Retrieve stored question information from Embedded data
        let strQuesVarsStorageKey = "strQues" + objRenderQuesResp.strQuesNum + "VarsStorage";
        jQuery.when(udf.getEDValue(strQuesVarsStorageKey)).then(function (edValue) {
            // Convert stored string into an object (for now)
            objRenderQuesResp["varsStorage"] = JSON.parse(edValue);

            // Check answer, then add the score to the QuesResp object
            objRenderQuesResp["percCorrect"] = respPercCorrect(objRenderQuesResp.stuResp, objRenderQuesResp["varsStorage"].correctAns);

            // Store feedback that will be shown to user when they see the Solution
            // FIX: I don't have the feedback feature right now.
            objRenderQuesResp["stuResp"] = objRenderQuesResp.stuResp;

            // Create a unique name for the object
            const strObjName = "objQuesResp" + objQuesResp.quesNum.toString(); // objRespQues433
            const strQuesRespED = JSON.stringify(objQuesResp);

            // Write quesResp to Embedded Data
            if (IS_PRODUCTION) {
                $.when(udf.setEDValue(strObjName, strQuesRespED))
                    .then((stored) => objRenderQuesResp);
            } else {
                console.log(strObjName + " would have been written to ED: ", objRenderQuesResp)
                return objRenderQuesResp;
            }
        });
    }








    function qtrxButtonHandler(intQuesNum) {
        // This adds code to Qualtrics questions that fire when the user clicks a button

        let objRenderQuesResp = { "strQuesNum": intQuesNum.toString() };
        objRenderQuesResp.isProduction = IS_PRODUCTION; // storeQuesRespVars and setEDQuesRespVars use this property 
        let varsSetInED = false; // will automatically return true during testing

        // I only need to run this on pages where the students submit answers (-stem only pages),
        // so the next lines prevent it from running if it finds the -response element.
        const $divResp = $('#divQues' + intQuesNum + '-response');
        if ($divResp.length) { return true } // FIX: PUT ME BACK IN!! Commented out just for testing.

        // Read the student's submission, then write it to long-term storage (embedded data)
        fetchStuSubmission(objRenderQuesResp)
            .then(
                objRenderQuesResp => {
                    submitPageActions(objRenderQuesResp)
                        .then(resp => console.log(resp))
                },
                rejected => { console.log("Why is there an error under fetchStuSubmission? " + Error(rejected)) });


        function submitPageActions(objRenderQuesResp) {
            return new Promise(function (resolver, rejecter) {

                if (IS_PRODUCTION) {
                    const qse = Qualtrics.SurveyEngine;
                    // addOnPageSubmit is a Qualtrics function. It's like an event listener for the Qualtrics buttons.
                    qse.addOnPageSubmit(function (submitType) {
                        objRenderQuesResp["qtrxQuesID"] = Object.keys(qse.QuestionInfo)[0]; // QID num (e.g., QID124)
                        objRenderQuesResp["submitType"] = submitType; // button type (e.g., "next")
                        // Reads the student's response, adds it to the feedback object (objRenderQuesResp in here),
                        // and writes it to long-term storage (embedded data)
                        return resolver(setEDQuesRespVars(objRenderQuesResp));
                    });
                } else {
                    objRenderQuesResp["qtrxQuesID"] = "QID124"; // This might throw an error
                    objRenderQuesResp["submitType"] = "next";
                    return resolver("Added to objRenderQuesResp object [LOCAL MODE]");
                };

            }).then((fulfilledPromise) => { console.log("Again? " + fulfilledPromise); return "poodle"; }).catch("Error in submitPageActions.then()."); // end of Promise wrapper
        }

        // Reads the student's submitted answer to the question and 
        // returns the object with those answers as a new stuResp property
        function fetchStuSubmission(objRenderQuesResp) {
            return new Promise((stuSubmitResolve, stuSubmitReject) => {
                // Check to see if there are any custom fields on this page.
                const customFieldCount = $("body [data-submit-field]").length;
                if (customFieldCount !== 0) {
                    // If there are custom fields, collect the student's submitted responses
                    // in an object (quesSubmissions) and store that object in objRenderQuesResp.
                    fnobjCustomSubmission()
                        .then(objOfStuResp => { objRenderQuesResp.stuResp = objOfStuResp; return objRenderQuesResp })
                        .then(obj => stuSubmitResolve(obj));
                } else {
                    // If there are no custom fields, pull the student's submitted response
                    // from Qualtrics' response area (i.e., the default).

                    // Read student answer from Qualtrics, or use a dummy value if on local
                    let stuResp = IS_PRODUCTION === true ?
                        document.getElementById("QR~" + objRenderQuesResp.qtrxQuesID).value :
                        "123123123";

                    prepSubmissionForStorage(stuResp)
                        .then(
                            cleanResp => { objRenderQuesResp.stuResp = cleanResp; return objRenderQuesResp; },
                            err => { objRenderQuesResp.stuResp = err; return objRenderQuesResp; })
                        .then(
                            obj => stuSubmitResolve(obj),
                            obj => stuSubmitResolve(obj))
                        .catch(
                            bigError => stuSubmitReject(bigError));
                }
            });
        }


        function fnobjCustomSubmission() {
            // Any of the custom textboxes I create with code -- such as those for the capital budgeting problems -- 
            // has an attribute tag of 'data-submit-field' with the name for that field.
            // This function return and object with the student's entries in all the fields on the page.
            let quesSubmissions = {};
            const $dataSubmitFields = $("body [data-submit-field]");
            $dataSubmitFields.each((idx, elem) => {
                const $elem = $(elem);
                const theKey = $elem.data("submit-field"); // ip, atp, etc.

                // If a data-submit-field name appears on 1+ questions on an page, the field name is modified
                // to include a counter number. That way, each field name is unique to the page.
                let newKey = '';

                // How many keys like this already exist in the object? (usually 0)
                let regex = new RegExp('^' + theKey);
                let aryExistingKeyMatches = Object.keys(quesSubmissions).filter(k => k.match(regex));

                // Take action based on the number of keys currently in the object
                switch (aryExistingKeyMatches.length) {
                    case 0: // most typical
                        newKey = theKey;
                        break;
                    case 1:
                        // Rename existing key to append number
                        const renameKey = theKey + '_1';
                        // E.g., obj["myKey"] would become obj["myKey_1"] and the orig obj["myKey"] is deleted
                        quesSubmissions[renameKey] = quesSubmissions[theKey];
                        delete quesSubmissions[theKey];
                        // Append next number to newKey
                        newKey = theKey + '_2';
                        break;
                    default: // 2+
                        // look for any existing "myKey_" keys. Remove "myKey_", leaving only the number oat the end
                        regex = new RegExp(theKey + "_");
                        const newMatches = aryExistingKeyMatches.map((elem) => parseInt(elem.replace(regex, '')));
                        newKey = theKey + '_' + (Math.max(...newMatches) + 1);
                        break;
                }
                // reads the value from the input box, sanitizes it, converts it to a number, and stores it.
                let submissionVal = '';
                try {
                    submissionVal = $elem.val()
                }
                catch (error) {
                    Error("Error with reading from input box for key: " + newKey);
                }
                finally {
                    submissionVal = 'Error with reading val() from user input for key ' + newKey;
                };
                prepSubmissionForStorage(submissionVal).then(
                    // Store the student's submitted value in the object
                    stuResp => quesSubmissions[newKey] = stuResp,
                    err => quesSubmissions[newKey] = err);
            });
            return quesSubmissions;
        }

        function prepSubmissionForStorage(userInput) {
            return new Promise((prepResolve, prepReject) => {
                console.log("I'm in prepSubmissionForStorage: " + userInput);
                if (!userInput) { return 0; }
                else if (typeof userInput === 'number') { return userInput; }
                else {
                    sanitizeInput(userInput)
                        .then(
                            saniResp => {
                                console.log("I received " + saniResp + " from sanitizeInput");
                                return convertRespToNum(saniResp)
                            },
                            saniErr => saniErr
                        )
                        .then(
                            numResp => {
                                console.log("I received " + numResp + " from convertRespToNum");
                                return prepResolve(numResp);
                            },
                            numReject => prepReject('NonNumeric response ' + numReject)
                        )
                        .catch(err => Error("Student submission not stored due to error in code. " + err));
                }
            });
        }

        function convertRespToNum(theResp) {
            return new Promise((numResolve, numReject) => {
                let resp = theResp.toString().trim();

                const charsToRemove = [",", "\\$"];
                jQuery.each(charsToRemove, function (i, char) {
                    const regex = new RegExp(char, "g");
                    resp = resp.replace(regex, '');
                });
                try {
                    console.log("converRespToNum is about to try: " + resp);
                    if (resp.length === 0) { resp = 0; }
                    resp = isNaN(parseFloat(resp)) ? resp : parseFloat(resp);
                    return numResolve(resp);
                } catch (error) {
                    console.log("converRespToNum caught an error: ", Error("see: " + error), resp);
                    return numReject(Error(error + ' ' + resp));
                }
            });
        }

        function sanitizeInput(userInput) {
            return new Promise((sanitizedResolve, sanitizedReject) => {
                // Code mostly from https://stackoverflow.com/questions/2794137/sanitizing-user-input-before-adding-it-to-the-dom-in-javascript
                console.log("I'm in sanitizeInput: " + userInput);
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
                try {
                    const sanitizedSubmission = userInput.replace(reg, (match) => (map[match]));
                    return sanitizedResolve(sanitizedSubmission);
                } catch (error) {
                    return sanitizedReject("Error during sanitization: " + Error(error));
                }
            });
        }


    }







    // THIS RUNS FIRST
    // Load all the JS files
    loadJSFiles()
        // the 'Then' statement waits for a promise from the loadJSFiles function
        .then((respObj) => {
            // Get the variables that we'll use in the question, either from the ques itself (origVars) or from Qualtrics embedded data
            const origVars = ques.defineVariables();
            return (IS_PRODUCTION) ? fetchQuesVars(origVars, respObj["quesNum"]) : origVars;
        })
        // Now that we have the variables, call the code that actually builds the page.
        .then((varsObj) => buildPage(varsObj));

    // If the variable is already in the embedded data, we'll use that. Otherwise, the code stores the variable in the embedded data based on our definition.
    function fetchQuesVars(objVars, quesNum = self.quesNum) {
        // Change the values so they're unique before long-term storage by adding a prefix to variable names
        const objUniqueNames = quesPrefix(objVars, quesNum, "include");

        let objQuesVarsActual = {};
        if (!IS_PRODUCTION) { return objVars; };
        $.each(objUniqueNames, function (theKey, valueFromQues) {
            $.when(udf.getEDValue(theKey)).then(function (edValue) {
                // If the key exists within the embedded data, use that value
                if (edValue) {
                    objQuesVarsActual[theKey] = edValue;
                    // If the key does not exist within the ED, set it and return the same value that we started with
                } else {
                    $.when(udf.setEDValue(theKey, valueFromQues)).then(function () {
                        objQuesVarsActual[theKey] = valueFromQues;
                    });
                };
            });
        });

        // Remove the prefixes and return the object with the correct values
        return quesPrefix(objQuesVarsActual, quesNum, "remove");
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
                $.getJSON(
                    baseURL + "supporting/objQuesFileInfo.json",
                    function(jsonResp) { objJSPaths.ques = 'ques/' + jsonResp[self.quesNum].filename; }
                )
                .then((resp) => $.each(objJSPaths, (key, value) => objJSPaths[key] = baseURL + value)) // Prepend each file in the objJSPaths object with the baseURL
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
            const quesFunction = 'fnQues' + self.quesNum;

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

// Self-invokes the file. Putting .bind allows me to use self=this inside the function, which wouldn't have worked otherwise in strict mode
if (IS_PRODUCTION) {
    Qualtrics.SurveyEngine.addOnload(function () { jQuery(document).ready(() => { mainFunc.bind(mainFunc, jQuery)(); }); });
} else { jQuery(document).ready(() => { mainFunc.bind(mainFunc, jQuery)(); }); }
