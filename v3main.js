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

    const curQuesNum = quesNumGlobal();
    self.quesNum = curQuesNum;

    if (typeof IS_QUES_PAGE === 'undefined' || IS_QUES_PAGE === false) { return "Cancelling all code" };


    let udf, tvmcalc, tvmexpl, capbudg, Finance; // classes
    let jsInfo;
    let ques = null;


    function buildPage(varsObj_objQuesVarsActual) {
        // This is invoked only after all the scripts are loaded

        // varObj has all variables to use for customizing each question & solution in Qualtrics.
        // Those might be variables created by the question itself milliseconds earlier,
        // or they could be variables from embedded data.

        // Each question has a pageContent function which returns an object.
        // That object has 3+ properties: "stem", "solution", "allVars," and usually "ansBoxMessage"
        // Stem, Solution, and ansBoxMessage properties are pure HTML specific to that question.

        // The next line calls that pageContent function and passes it the actual variables to use when building the page.
        // It also returns objContent.allVars, which is every variable defined in quesVars, calcVars, and displayVars.
        let objContent = {};
        addToObjContent({ "quesNum": self.quesNum }); // same as --> objContent.quesNum = self.quesNum;
        Object.assign(objContent, ques.pageContent(varsObj_objQuesVarsActual));

        // This function adds key:value pairs to the upper-level objContent object
        // I pulled this out as its own function to make it easier to track the properties being written in sub-sub-sub-functions
        function addToObjContent(objKVPair) { return Object.assign(objContent, objKVPair) };

        const
            divIDRoot = '#divQues' + self.quesNum,
            $divStem = $(divIDRoot + '-stem'),
            $divSolution = $(divIDRoot + '-solution'),
            $divResponse = $(divIDRoot + '-response');

        // The structure diverges between Stem pages and Solution/Response pages.
        // Stem: Button handler reads student's submissions | Solution & Response content does not show
        // Solution/ Response: Button handler doesn't do anything | Solution & Response content show
        const
            blnWriteStem = !($divStem.length === 0),
            blnWriteSolution = !($divSolution.length === 0),
            blnWriteResponse = !($divResponse.length === 0);


        // STEM
        if (blnWriteStem) { writeHTMLStem(objContent.stem) };
        function writeHTMLStem(objContent_stem) {
            try {
                const strHTMLStem = `<div class="my-qtrx-page qtrx-page-elem ques-stem">${objContent_stem}</div>`;
                $(divIDRoot + '-stem').html(strHTMLStem); // HTML built by the ques file
                return true;
            } catch (stem_error) {
                console.log(Error(`Error trying to write the stem HTML: `), stem_error);
                return false;
            }
        }

        // POPULATE THE STUDENT'S ANSWER(S)
        // If this is a question the student has seen before, plug in the student's previous entries


        // WRITE THE VARIABLES INTO LONG-TERM STORAGE (embedded data)
        // This stores the objContent variable as strQues433VarsStorage within the embedded data
        storeQuesRespVarsInED(objContent)
            .then(
                storeQuesRespVars_success => console.log('storeQuesRespVars_success', storeQuesRespVars_success),
                storeQuesRespVars_error => console.log('storeQuesRespVars_error', storeQuesRespVars_error)
            );

        function storeQuesRespVarsInED(objContentStoreQRVinED) {
            // Stores question variables and other important (and mutable) information in embedded data
            return new Promise((storeQRVResolve, storeQRVReject) => {
                // Each student sees variables unique to that student (randomly generated). This function writes those embedded data.
                // When the student leaves the page, the student's submission is combined with those variables.
                let sqrvObjContent = {
                    "quesNum": objContentStoreQRVinED.quesNum,
                    "objQuesVars": objContentStoreQRVinED.allVars, // this property stores the object
                    "correctAns": objContentStoreQRVinED.allVars.correctAns
                };
                const strQuesVarsStorageKey = "strQues" + sqrvObjContent.quesNum + "VarsStorage"; // strQues433VarsStorage
                const strQuesVarsStorageVal = JSON.stringify(sqrvObjContent);
                console.log(strQuesVarsStorageKey + ' about to be written to embedded data: ', strQuesVarsStorageVal.substring(0, 20) + "... (very long)");

                if (IS_PRODUCTION) {
                    $.when(udf.setEDValue(strQuesVarsStorageKey, strQuesVarsStorageVal))
                        .then(
                            setQtrxResp_success => {
                                console.log(`From setEDValue for ${strQuesVarsStorageKey}:`, setQtrxResp_success);
                                return storeQRVResolve;
                            },
                            setQtrxResp_err => {
                                return storeQRVReject(Error("Encountered an error trying to store variables in Qualtrics: " + setQtrxResp_err, objQuesResp))
                            }
                        );
                } else {
                    console.log("In testing mode, so no setEDValue for " + strQuesVarsStorageKey + ": " + strQuesVarsStorageVal.substring(0, 20) + "... (very long)");
                    return storeQRVResolve;
                }
            });
        }

        // SOLUTION
        if (blnWriteSolution) { writeHTMLSolution(objContent.solution) };
        function writeHTMLSolution(objContent_solution) {
            try {
                const strHTMLSolution = `<div class="my-qtrx-page qtrx-page-elem ques-solution">${objContent_solution}</div>`;
                $(divIDRoot + '-solution').html(strHTMLSolution); // HTML built by the ques file
                return true;
            } catch (solution_error) {
                console.log(Error(`Error trying to write the solution HTML: `), solution_error);
                return false;
            }
        }


        // RESPONSE
        if (blnWriteResponse) { writeHTMLResponse() };
        function writeHTMLResponse() {

            // Read in object with student submission information

            // THIS IS THE CODE I NEED TO RE-WRITE TO WORK FOR THE -response SECTION
            // writeHTMLSolution(objContent.solution);
            // function writeHTMLSolution(objContent_solution) {
            //     try {
            //         const strHTMLSolution = `<div class="my-qtrx-page qtrx-page-elem ques-solution">${objContent_solution}</div>`;
            //         $(divIDRoot + '-solution').html(strHTMLSolution); // HTML built by the ques file
            //         return true;
            //     } catch (solution_error) {
            //         console.log(Error(`Error trying to write the solution HTML: `), solution_error);
            //         return false;
            //     }
            // }
        };


        // BUTTON HANDLER : Writes submission information into long-term storage (embedded data)
        if (blnWriteStem && !blnWriteSolution) {

            if (IS_PRODUCTION) {
                const qse = Qualtrics.SurveyEngine;
                // addOnPageSubmit is a Qualtrics function. It's like an event listener for the Qualtrics buttons.
                qse.addOnPageSubmit(function (submitType) {
                    addToObjContent({ "qtrxQuesID": Object.keys(qse.QuestionInfo)[0] }); // QID num (e.g., QID124)
                    addToObjContent({ "submitType": submitType }); // button type (e.g., "next")

                    qtrxButtonHandler(objContent);
                });
            } else {
                addToObjContent({ "qtrxQuesID": "QID124" });
                addToObjContent({ "submitType": "next" });

                if (confirm('Want to simulate a button click? If so, click yes and wait 3 seconds')) timeFunction();
                function timeFunction() {
                    setTimeout(() => qtrxButtonHandler(objContent), 1000);
                }
                // Create a fake button to help with testing and put an eventHandler on it
                // const strFakeBtn = '<div><button id="NextButton" style="margin-top: 20px;" onclick="qtrxButtonHandler">Fake next button</button></div>';
                // $('#kxAutoRender').after(strFakeBtn);
                return;
            };

            function qtrxButtonHandler(objContentBH = objContent) {
                // This adds code to Qualtrics questions that fire when the user clicks a button.
                // It only gets loaded on the -stem pages. On the Solution/Resp pages, there's not special about the buttons.        

                // The gatherStuSubmission creates objStuSubmission, which is stored as a property on objContent.stuSubmission
                gatherStuSubmission(objContentBH).then(
                    (objContentStuSubmission) => {
                        addToObjContent({ "stuSubmission": objContentStuSubmission }); // objContent.stuSubmission: "stuQues470":{}
                        // Write the responses to long-term storage (embedded data)
                        storeStuSubmissionToED(objContent).then(
                            storeStuSubmission_success => console.log('storeStuSubmission_success', storeStuSubmission_success),
                            storeStuSubmission_error => console.log('storeStuSubmission_error', storeStuSubmission_error)
                        );
                    }
                );

                function storeStuSubmissionToED(objContentToStore) {
                    // Stores question variables and other important (and mutable) information in embedded data
                    return new Promise((storeQRVResolve, storeQRVReject) => {
                        // This leaves the objContent variable untouched, creating a near duplicate object.
                        // I wanted to leave objContent stable in case [when!] there are coding errors and I need to troubleshoot using a student's historical record of submissions
                        const fnQuesName = Object.keys(objContentToStore.stuSubmission)[0];
                        let sssObjContent = {
                            "quesNum": objContentToStore.quesNum,
                            "objQuesVars": objContentToStore.allVars, // this property stores the object
                            "correctAns": objContentToStore.allVars.correctAns,
                            "stuSubmission": objContentToStore.stuSubmission,
                            "percCorrect": objContentToStore.stuSubmission[fnQuesName].percCorrect
                        };
                        const strQuesVarsStorageKey = "strQues" + sssObjContent.quesNum + "VarsStorage"; // strQues433VarsStorage
                        const strQuesVarsStorageVal = JSON.stringify(sssObjContent);
                        console.log(strQuesVarsStorageKey + ' about to be written to embedded data with student submission results: ', strQuesVarsStorageVal.substring(0, 20) + "... (very long)");

                        if (IS_PRODUCTION) {
                            $.when(udf.setEDValue(strQuesVarsStorageKey, strQuesVarsStorageVal))
                                .then(
                                    setQtrxResp_success => {
                                        console.log(`From setEDValue for ${strQuesVarsStorageKey}:`, setQtrxResp_success);
                                        return storeQRVResolve;
                                    },
                                    setQtrxResp_err => {
                                        return storeQRVReject(Error("Encountered an error trying to store variables in Qualtrics: " + setQtrxResp_err, objQuesResp))
                                    }
                                );
                        } else {
                            console.log("In testing mode, so no setEDValue for " + strQuesVarsStorageKey + ": " + strQuesVarsStorageVal.substring(0, 20) + "... (very long)");
                            return storeQRVResolve;
                        }
                    });
                }


                function gatherStuSubmission(objContentStuSubmit) { // returns objStuSubmission with student data
                    return new Promise((gatherStuSubmissionFulfilled) => {
                        // Reads the student's submitted answer(s) to the question and 
                        // returns the object with those answers as a new stuResp property

                        // Create the object that holds the student's submission information
                        const strStuSubmitTopKey = "stuQues" + objContentStuSubmit.quesNum; // stuQues470
                        // The main key for these data is stuQues470.
                        // This will eventually be stored as objContent.stuSubmission.stuQues470.
                        let objStuSubmissionToReturn = {};
                        objStuSubmissionToReturn[strStuSubmitTopKey] = {};
                        let objSS = () => {
                            return objStuSubmissionToReturn[strStuSubmitTopKey]; // objContent.stuSubmission.stuQues470{}
                            // (this is only in a function because I wanted to shrink my comments here)
                            // objSS is like stuQues470 = {}; it's just shorthand to make it easier when writing the code.
                            // The data are written one level below. Here are some examples:
                            // REGULAR QUALTRICS QUESTION
                            // stuQues470 = { QID225: {submitValue:123, correctAns:321, percCorrect:0 }, percCorrect:0};
                            // MULTIPART QUESTION (capital budgeting)
                            // stuQues470 = {
                            //     ip: {submitValue:-900, correctAns:-900, percCorrect:1 },
                            //     ane: {submitValue:9876, correctAns:9876, percCorrect:1 },
                            //     percCorrect: 1
                            // }
                            // MULTIPART QUESTION (multiple IRR questions on the same page)
                            // stuQues470 = {
                            //     irr_1: {submitValue:0.123, correctAns:0.321, percCorrect:0 },
                            //     irr_2: {submitValue:0.456, correctAns:0.456, percCorrect:1 }
                            // };
                            // All custom input fields have a data-submit-field tag.
                            // The selector here creates a collection of those for processing.
                        }

                        const $dataSubmitFields = $("body [data-submit-field]");

                        if ($dataSubmitFields.length === 0) {
                            // DEFAULT: There are no custom fields, so just pull the student's submitted response from Qualtrics' response area.

                            fnStuSubmissionSingleQues().then(objForED => {
                                objStuSubmissionToReturn[strStuSubmitTopKey] = objForED;
                                gatherStuSubmissionFulfilled(objStuSubmissionToReturn);
                            });

                            function fnStuSubmissionSingleQues() {
                                return new Promise(resolveSingleQues => {

                                    let stuRespInitial = '';
                                    if (IS_PRODUCTION) {
                                        const qtrxQuesID = objContentStuSubmit.qtrxQuesID;
                                        stuRespInitial = document.getElementById("QR~" + qtrxQuesID).value;
                                    } else {
                                        stuRespInitial = "123123123"; //objSS["QID99999"].submitValue = "123123123";
                                    };

                                    const objSingleAns = fnobjPropertiesForSingleQues(objContentStuSubmit, prepStuRespValForStorage(stuRespInitial));

                                    // Return objSS with the new student results included
                                    resolveSingleQues(Object.assign(objSS, objSingleAns));
                                });

                                function fnobjPropertiesForSingleQues(objContentSSSingQues, stuResp) {
                                    // Returns an object that has the student's results for single-answer questions
                                    const thePercCorrect = respPercCorrect(stuResp, objContentSSSingQues.correctAns);
                                    return {
                                        "percCorrect": percCorrect, // overall percCorrect for the question
                                        [qtrxQuesID]: {
                                            "submitValue": cleanStuResp,
                                            "correctAns": objContentSSSingQues.allVars.correctAns,
                                            "percCorrect": thePercCorrect // percCorrect for the subpart. For single values, however, this is the same as the overall
                                        }
                                    };

                                }
                            }


                        } else {
                            // If the code reaches here, it means there are custom fields.
                            // We'll collect the student's submitted responses what becomes objStuSubmission.

                            fnStuSubmissionMultiQues().then(objForED => {
                                objStuSubmissionToReturn[strStuSubmitTopKey] = objForED;
                                gatherStuSubmissionFulfilled(objStuSubmissionToReturn);
                            })

                            function fnStuSubmissionMultiQues() {
                                return new Promise(resolveMultiQues => {

                                    fnobjCustomSubmission()
                                        .then((objMultiSubmit_success) => {
                                            // Sum the total score on the question based on all sub components
                                            let objMulti = objMultiSubmit_success;
                                            // Right now, this treats all subparts of a question as equal weight. E.g., identifying EQP (usually $0) and calculating ENEPI are worth the same
                                            // Count all the keys at the newParentKey level
                                            const pointsPossible = Object.keys(objContent.allVars.correctAns).length;
                                            const aryStuPercentCorrect = Object.keys(objMulti).map(elem => objMulti[elem].percCorrect);
                                            const pointsEarned = udf.arraySum(aryStuPercentCorrect);
                                            // store the student's overall percent correct for the question
                                            objMulti.percCorrect = pointsEarned / pointsPossible;
                                            resolveMultiQues(Object.assign(objSS, objMulti));
                                        })

                                    function fnobjCustomSubmission() { // returns objMultiSubmit
                                        return new Promise(fulfillMultiQues => {
                                            // Any of the custom textboxes I create with code -- such as those for the capital budgeting problems -- 
                                            // has an attribute tag of 'data-submit-field' with the name for that field.
                                            // This function return and object with the student's entries in all the fields on the page.

                                            // objMultiSubmit is at the same level as objSS (objContent.stuSubmission.stuQues470)
                                            let objMultiSubmit = {}; // { correctAns = objContentStuSubmit.correctAns };
                                            const $dataSubmitFields = $("body [data-submit-field]");


                                            $dataSubmitFields.each(function (idx) {
                                                const $dsField = $(this);
                                                const parentKey = $dsField.data("submit-field"); // ip, atp, etc.

                                                // If a data-submit-field name appears on 1+ questions on an page, the field name is modified
                                                // to include a counter number. That way, each field name is unique to the page.
                                                let newParentKey = '';
                                                // Take action based on the number of keys currently in the object
                                                switch (numExistingKeyMatches(parentKey)) {
                                                    case 0: // most typical
                                                        newParentKey = parentKey;
                                                        break;
                                                    case 1:
                                                        // Rename existing key to append number
                                                        const renameKey = parentKey + '_1';
                                                        // E.g., obj["myKey"] would become obj["myKey_1"] and the orig obj["myKey"] is deleted
                                                        objMultiSubmit[renameKey] = objMultiSubmit[parentKey];
                                                        delete objMultiSubmit[parentKey];
                                                        // Append next number to newParentKey
                                                        newParentKey = parentKey + '_2';
                                                        break;
                                                    default: // 2+
                                                        // look for any existing "myKey_" keys. To get the next number in the list,
                                                        // remove "myKey_", leave only the number oat the end, and take max + 1
                                                        regex = new RegExp(parentKey + "_");
                                                        const newMatches = aryExistingKeyMatches.map((theDSField) => parseInt(theDSField.replace(regex, '')));
                                                        newParentKey = parentKey + '_' + (Math.max(...newMatches) + 1);
                                                        break;
                                                }

                                                const inputBoxContent = readInputVal($dsField);

                                                // Store as the stuQues470 property of objStuSubmission
                                                // objMultiSubmit[newParentKey].submitValue=123 is like writing stuQues470.irr_2.submitValue=123
                                                objMultiSubmit[newParentKey] = fnobjPropertiesForMultipartQuesSubpart(newParentKey, objContent, prepStuRespValForStorage(inputBoxContent));
                                            });


                                            function readInputVal($inputBox) {
                                                // reads the value from the input box, sanitizes it, converts it to a number, and stores it.
                                                let submissionValInitial = '';
                                                try { submissionValInitial = $inputBox.val(); }
                                                catch (err_getInputBoxVal) {
                                                    console.log(Error(newParentKey + " error with reading from input box. " + err_getInputBoxVal));
                                                    submissionValInitial = 'Error with reading val() from user input for key ' + newParentKey;
                                                }
                                                finally {
                                                    return submissionValInitial;
                                                }

                                            }

                                            function fnobjPropertiesForMultipartQuesSubpart(fieldKey, objContentSSMultQues, stuResp) {
                                                // Returns an object that has the student's results for one part of a multi-answer question
                                                // E.g., in stuQues470.irr_2.submitValue=123, this is returning everything at the .submitValue level
                                                const correctAns = objContentSSMultQues.allVars.correctAns[fieldKey];
                                                const thePercCorrect = respPercCorrect(stuResp, correctAns);
                                                return {
                                                    "submitValue": stuResp,
                                                    "correctAns": correctAns,
                                                    "percCorrect": thePercCorrect // percCorrect for the subpart
                                                };
                                            }

                                            function numExistingKeyMatches(keyCheck) {
                                                // Returns number of keys in the object that have the same root as the parentKey
                                                // e.g. {irr_1: 0.123, irr_2: 0.455} --> 2 if the keyCheck is 'irr'
                                                const regExpression = new RegExp('^' + keyCheck);
                                                const aryExistingKeyMatches = Object.keys(objMultiSubmit).filter(k => k.match(regExpression));
                                                return aryExistingKeyMatches.length;
                                            }

                                            fulfillMultiQues(objMultiSubmit);
                                        });
                                    }
                                });
                            }

                        }

                        function prepStuRespValForStorage(userInput) {
                            if (!userInput) { return 0; } // if it's falsy (e.g., null), just put 0
                            else if (typeof userInput === 'number') { return userInput; } // if it's already a number, it's perfect
                            try {
                                return Number(userInput);
                            }
                            catch {
                                // Looks like it's a text string
                                sanitizeInput(userInput)
                                    .then(
                                        saniResp => convertRespToNum(saniResp),
                                        saniErr => saniErr
                                    )
                                    .then(
                                        numResp => numResp,
                                        numReject => prepReject('NonNumeric response ' + numReject)
                                    )
                                    .catch(err_prepStuRespVal => Error("Student submission not stored due to error in code. " + err_prepStuRespVal));
                            }
                        };

                        function convertRespToNum(theResp) {
                            return new Promise((numResolve, numReject) => {
                                let strStuResp = theResp.toString().trim();

                                const charsToRemove = [",", "\\$"];
                                jQuery.each(charsToRemove, function (idx, char) {
                                    const regex = new RegExp(char, "g");
                                    strStuResp = strStuResp.replace(regex, '');
                                });
                                try {
                                    if (strStuResp.length === 0) { strStuResp = 0; }
                                    strStuResp = isNaN(parseFloat(strStuResp)) ? strStuResp : parseFloat(strStuResp);
                                    numResolve(strStuResp);
                                } catch (errConvToNum) {
                                    console.log("converRespToNum caught an error: ", Error("see: " + errConvToNum), strStuResp);
                                    numReject(strStuResp);
                                }
                            });
                        }

                        function sanitizeInput(userInput) {
                            // Takes a string and cleans out some of the HTML to make it safer to store on my system
                            // Returns a string ready to be stored
                            // Code mostly from https://stackoverflow.com/questions/2794137/sanitizing-user-input-before-adding-it-to-the-dom-in-javascript
                            return new Promise((sanitizedResolve, sanitizedReject) => {
                                const charMap = {
                                    '&': '&amp;',
                                    '<': '&lt;',
                                    '>': '&gt;',
                                    '"': '&quot;',
                                    "'": '&#x27;',
                                    "/": '&#x2F;',
                                    "`": '&grave;'
                                }; const regex = /[&<>"'/]/ig;
                                try {
                                    const sanitizedSubmission = userInput.replace(regex, (match) => (charMap[match]));
                                    sanitizedResolve(sanitizedSubmission);
                                } catch (saniErrorCatch) {
                                    console.log("Error during sanitization", Error(saniErrorCatch));
                                    sanitizedReject("Error during sanitization");
                                }
                            });
                        }

                        // Most questions can be graded with this; the ones that can't will do their own grading within each question.
                        // Pass a single answer to check or pass arrays of answers.
                        function respPercCorrect(stuResp, correctAns, rawTolerance) {

                            // Return 0 if stuResp is null or empty (this will allow stuResp = 0)
                            if (stuResp === null || stuResp === "") { return 0; }

                            // If this is only checking a single value, run the check and return 1/0
                            if (!Array.isArray(correctAns)) { return percCorrect(stuResp, correctAns, rawTolerance); }

                            let ptsPossible = 0;
                            let ptsEarned = 0;

                            // If the student submitted only one answer, convert it to an array
                            stuResp = !Array.isArray(stuResp) ? stuResp.split() : stuResp

                            // For multi-answer questions, assign 1 point to each answer.
                            // Students can earn a point each time through.
                            $.each(correctAns, (index, curAns) => {
                                ptsPossible += 1;
                                const curResp = stuResp[index] || 0;
                                ptsEarned += percCorrect(curResp, curAns, rawTolerance);
                            });

                            return ptsEarned / ptsPossible;

                            function percCorrect(respToEvaluate, paramCorrectAns, rawTolerance) {
                                let curCorrectAns = parseFloat(paramCorrectAns);

                                // If a rawTolerance is passed, the code will accept answers +/- that amount.
                                // Otherwise, it uses a percent difference (i.e., curCorrectAns +/- 1.25% ).
                                // The default is 0.0125 (2^-3) because the binary system is happier with that.
                                const tolAmt = rawTolerance || curCorrectAns * 0.0125;

                                const isCorrect = Math.abs(respToEvaluate - curCorrectAns) < Math.abs(tolAmt);

                                return isCorrect ? 1 : 0;
                            }

                        }
                    });
                };

            }



            //     ).then(
            //         sqrvSuccess_objQuesResp => {
            //             console.log('This should be objQuesResp', sqrvSuccess_objQuesResp);
            //             createHTMLFeedbackToStudent(sqrvSuccess_objQuesResp)
            //                 .then(
            //                     htmlFdbkToStu_success => {
            //                         objContent.response = htmlFdbkToStu_success;
            //                         const strHTMLResponse = `<div class="my-qtrx-page qtrx-page-elem resp-to-student">${objContent.response}</div>`;
            //                         $(divIDRoot + '-response').html(strHTMLResponse);
            //                         return objContent
            //                     },
            //                     htmlFdbkToStu_err => { console.error(Error("Stupid error. " + htmlFdbkToStu_err)) }
            //                 );
            //         },
            //         sqrvSuccess_err => {
            //             console.log('Why is there an error? ', sqrvSuccess_err); return objContent;
            //         }
            //     )
            //         .then(
            //             (objFromSQRV_success_objContentIThink) => {
            //                 // Add code to take actions when student clicks a button
            //                 // Most importantly, it waits for the Qualtrics to populate the variable object.
            //                 console.log('objFromSQRV_success_objContentIThink', objFromSQRV_success_objContentIThink);
            //                 $.when(qtrxButtonHandler(self.quesNum)) // FIXX: Even though it errored above (returning err), it still advanced to here
            //                     .then((resp) => console.log("This runs last! Yay!", resp));
            //             },
            //             objFromSQRV_err_objContentIThink => {
            //                 console.log('objFromSQRV_err_objContentIThink', objFromSQRV_err_objContentIThink, Error("Error at end of storeQuesRespVars.then() chain. "));
            //             });



            function createHTMLFeedbackToStudent(objAllVars) {
                // Returns the HTML that will populate the page

                return new Promise((resolveWithStuResp, rejectWithoutStuResp) => {
                    // This function fetches the variables specific to this question from Qualtrics embedded data and loads the response text 
                    const $divQuesRespName = $("#divQues" + self.quesNum + "-response"); // divQues470-response
                    // Only run this on pages with a 'response' element
                    if ($divQuesRespName.length) {
                        if (IS_PRODUCTION) {
                            $.when(udf.getEDValue("objQuesResp" + self.quesNum)).then(function (edValue) {
                                resolveWithStuResp(() => htmlFeedback(edValue)); // returns the HTML that will populate the page
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

        }




    }



    // THIS RUNS FIRST
    // Load all the JS files
    loadJSFiles()
        // the 'Then' statement waits for a promise from the loadJSFiles function
        .then(
            (respObj_success) => {
                // Get the variables that we'll use in the question, either from the ques itself (origVars) or from Qualtrics embedded data
                const origVars = ques.defineVariables();
                if (IS_PRODUCTION) {
                    return fetchQuesVars(origVars, respObj_success["quesNum"]);
                } else {
                    return origVars;
                };
            },
            (respObj_reject) => {
                console.log('Error in the .then coming after loadJSFiles: ', respObj_reject, Error(" Error here for some reason."));
                return origVars;
            })
        // Now that we have the variables, call the code that actually builds the page.
        .then(
            (varsObj_success) => buildPage(varsObj_success),
            (varsObj_err) => {
                console.log('varsObj_err', varsObj_err);
                buildPage(varsObj_err);
            });

    // If the variable is already in the embedded data, we'll use that. Otherwise, the code stores the variable in the embedded data based on our definition.
    function fetchQuesVars(objVars, quesNum = self.quesNum) {
        // Change the values so they're unique before long-term storage by adding a prefix to variable names
        const objUniqueNames = quesPrefix(objVars, quesNum, "include"); // The 'include' argument adds the unique identifier

        let objQuesVarsActual = {};
        if (!IS_PRODUCTION) { return objVars; };
        $.each(objUniqueNames, function (theKey, valueFromQues) {
            $.when(udf.getEDValue(theKey))
                .then(
                    // If the key exists within the embedded data, use that value
                    getEDValue_success => {
                        let edValue = getEDValue_success;
                        if (edValue) {
                            console.log(`Reading ${theKey} from embedded data (${edValue}) and adding it to objQuesVarsActual.`);
                            objQuesVarsActual[theKey] = edValue;
                        } else {
                            // If the key does not exist within the ED, set it and return the same value that we started with
                            console.log(`Writing ${theKey} to embedded data: ${edValue}`);
                            $.when(udf.setEDValue(theKey, valueFromQues))
                                .then(
                                    function () {
                                        console.log(`Wrote ${theKey} to embedded data. Now adding it to objQuesVarsActual.`);
                                        objQuesVarsActual[theKey] = valueFromQues;
                                    });
                        };
                    },
                    edValue_reject => {
                        console.log('getEDValue came back with a rejection. Not sure what that means: ', edValue_reject, Error(" Failure by getEDValue."));
                    });
        });

        // Remove the prefixes and return the object with the correct values
        return quesPrefix(objQuesVarsActual, quesNum, "remove"); // The 'remove' argument removes the unique identifier so the variables can be used in the questions
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
                    function (jsonResp) { objJSPaths.ques = 'ques/' + jsonResp[self.quesNum].filename; }
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
