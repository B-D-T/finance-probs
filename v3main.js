// main.js

// GLOBAL

if (typeof IS_PRODUCTION == 'undefined') {
    var IS_PRODUCTION = true;
}
IS_PRODUCTION = !window.Qualtrics === false;

if (typeof IS_QUES_PAGE == 'undefined') {
    var IS_QUES_PAGE;
}

function quesNumGlobal() {
    // reads 'divQues470-stem' and returns 470
    const divID = jQuery("#kxAutoRender>div").attr('id');
    if (!divID) {
        IS_QUES_PAGE = false;
        return undefined;
    } else {
        IS_QUES_PAGE = true;
        const regexMatch = divID.match(/(divQues)(\d*)(\-*)/);
        return parseInt(regexMatch[2]);
    }
}

function mainFunc($) {
    "use strict";
    const self = this;
    console.log("Here I am", IS_PRODUCTION, IS_QUES_PAGE);

    self.quesNum = quesNumGlobal(); // FIX: I need a better way to do the quesNum. 

    if (typeof IS_QUES_PAGE === 'undefined' || IS_QUES_PAGE === false) { return "Cancelling all code" };


    let udf, tvmcalc, tvmexpl, capbudg, Finance; // classes
    let jsInfo;
    let ques = null;


    function buildPage(varsObj) {
        const v = varsObj;
        const objContent = ques.pageContent(varsObj);

        const divRoot = '#divQues' + self.quesNum;
        $(divRoot + '-stem').html(objContent.stem);
        $(divRoot + '-solution').html(objContent.solution);
        $(divRoot + '-response').html(objContent.response);


        // // received from addOnPageSubmit
        // function fnQuesResp(objPageSubmit){
        //     const qtrxDivID = "#divQues" + objPageSubmit.strQuesNum;
        //     if (!(jQuery(`${qtrxDivID}-response`).length)){
        //         let objRespFeedback = objPageSubmit;
        //         return setEDQuesRespVars(objRespFeedback);
        //     }
        // }


    }






    // THIS RUNS FIRST
    // Load all the JS files
    // $.when(loadJSFiles())
    //     // Then get the variables from the question
    //     .then((respObj) => {
    //         console.log('ques', ques, 'respObj', respObj, 'quesNum', respObj["quesNum"]);
    //         console.log(`Apparently, I'm done with loadJSFiles. Here's the response:`, respObj);
    //         const origVars = ques.defineVariables();
    //         return (IS_PRODUCTION) ? fetchQuesVars(origVars, respObj["quesNum"]) : origVars;
    //     })
    //     .then((varsObj) => buildPage(varsObj));

        loadJSFiles();

        setTimeout(() => {
            console.log('ques', ques, 'respObj', 'quesNum');
            console.log(`Apparently, I'm done with loadJSFiles. Here's the response:`);
            const origVars = ques.defineVariables();
            const varsObj = (IS_PRODUCTION) ? fetchQuesVars(origVars,468) : origVars;
            buildPage(varsObj)
        }, 10000);
        
        // $.when(loadJSFiles())
        // // Then get the variables from the question
        // .then((respObj) => {
        //     console.log('before SET TIMEOUT');
        //     setTimeout(() => {
        //         console.log('ques', ques, 'respObj', respObj, 'quesNum', respObj["quesNum"]);
        //         console.log(`Apparently, I'm done with loadJSFiles. Here's the response:`, respObj);
        //         const origVars = ques.defineVariables();
        //         const varsObj = (IS_PRODUCTION) ? fetchQuesVars(origVars, respObj["quesNum"]) : origVars;
        //         buildPage(varsObj)
        //     }, 3000);
        // });


    // If the variable is already in the embedded data, we'll use that. Otherwise, the code stores the variable in the embedded data based on our definition.
    function fetchQuesVars(objVars, quesNum = self.quesNum) {
        // Change the values so they're unique before long-term storage by adding a prefix to variable names
        const objUniqueNames = quesPrefix(objVars, quesNum, "include");

        let objQuesVarsActual = {};
        if (!IS_PRODUCTION) { return objVars; };
        $.each(objUniqueNames, function (theKey, valueFromQues) {
            $.when(self.getEDValue(theKey)).then(function (edValue) {
                // If the key exists within the embedded data, use that value
                if (edValue) {
                    objQuesVarsActual[theKey] = edValue;
                    // If the key does not exist within the ED, set it and return the same value that we started with
                } else {
                    $.when(self.setEDValue(theKey, valueFromQues)).then(function () {
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


    // // Add prefix to create a key that's unique across ALL questions in the course
    // varsForStorage = addQuesPrefix(varsForStorage, quesNum());

    // // This add a prefix to each key in an object of variables so that key is unique within the question. E.g., if quesVars and displayVars both have a Rate variable.
    // // This receives something like ({Rate:.05, PV:1000}, "var") and returns ({varDiscRate:.05, varPV:1000}
    // function addVarTypePrefix(varObj, typePrefix) {
    //     let newObj = {};
    //     $.each(varObj, (theKey, theValue)=>{
    //         const newKey = theKey.startsWith(typePrefix) ? theKey : typePrefix + theKey;
    //         newObj[newKey] = theValue;
    //     });
    //     return newObj;
    // }
    

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
        console.log('jsInfo', jsInfo, typeof jsInfo);

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
            console.log('THIS IS THE ISSUE ');
            // const regex = new RegExp("(function)\\s(fnQues\\d*)\\s*\\("); // Assumes question file starts with `function fnQues470 (objFromMainQues) {`
            // const quesFunction = jsText.split(regex)[2]; // returns fnQues470
            let quesFunction = jsInfo.ques.split('/');
            quesFunction = quesFunction[quesFunction.length - 1].split('.');
            quesFunction = 'fnQues'+quesFunction[0];

            console.log('THIS IS THE ISSUE22 ', quesFunction);

            // Creates constructor based on that finance question (e.g., function fnQues470)
            // Also passes all the JS files to the question, received as objFromMain. The question then chooses which ones to use.
            // const objToQues = { "IS_PRODUCTION": IS_PRODUCTION, "udf": udf, "tvmexpl": tvmexpl, "tvmcalc": tvmcalc, "capbudg": capbudg, "Finance":new udf.financejs };
            objJS[quesFunction] = new window[quesFunction]($, objJS);
            return resolve(objJS[quesFunction]);
        }));

        
        udf = await udfLoad();
        Finance = await financeLoad();
        tvmcalc = await tvmcalcLoad();
        tvmexpl = await tvmexplLoad();
        capbudg = await capbudgLoad();
        ques = await quesLoad();
        
        return jsInfo;
        
    };
} // end of mainFunc

if (IS_PRODUCTION) {
    console.log("bottom");
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
