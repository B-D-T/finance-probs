
// user-defined-functions.js


// Each student sees variables unique to that student (randomly generated)
// This function writes those embedded data.
// When the student leaves the page, 
// the student's answer will be combined with those variables and written as a different variable in the Qualtrics embedded data.
function storeQuesRespVars(theQuesVars, theAns) {
    let objQuesResp = {
        "quesNum": quesNum(),
        "objQuesVars": theQuesVars, // the property stores an object
        "correctAns": theAns
    };
    let strQuesVarsStorageKey = "strQues" + objQuesResp.quesNum + "VarsStorage"; // strQues433VarsStorage
    let strQuesVarsStorageVal = JSON.stringify(objQuesResp);

    if (!(objQuesCaller.isProduction == false)) {
        setEDValue(strQuesVarsStorageKey, strQuesVarsStorageVal);
    } else { console.log("No setEDValue for " + strQuesVarsStorageKey + ": " + strQuesVarsStorageVal) }
}


// This function writes the student-question-specific variables (and student answer)
// into long-term storage (i.e., Embedded Data)
function setEDQuesRespVars(objRespFeedback) {

    // Read the student's response from the page and add it to the feedback object
    let stuResp = "123123123";
    if (!(objQuesCaller.isProduction == false)) {
        stuResp = document.getElementById("QR~" + objRespFeedback.qtrxQuesID).value; // read answer from Qualtrics page
    }
    stuResp = sanitizeInput(stuResp);
    objRespFeedback["stuResp"] = stuResp;

    // Retrieve stored question information from Embedded data and convert it to an object
    let strQuesVarsStorageKey = "strQues" + objRespFeedback.strQuesNum + "VarsStorage";
    jQuery.when(getEDValue(strQuesVarsStorageKey)).then(function (edValue) {
        
        let objQuesResp = JSON.parse(edValue);

        // Check answer, then add the score to the QuesResp object
        objQuesResp["percCorrect"] = respPercCorrect(objRespFeedback.stuResp, objQuesResp.correctAns);

        // Store feedback that will be shown to user when they see the Solution
        objQuesResp["respFeedback"] = objRespFeedback;

        const strObjName = "objQuesResp" + objQuesResp.quesNum.toString(); // objRespQues433
        const strQuesRespED = JSON.stringify(objQuesResp);

        // Write quesResp to Embedded Data (assuming we're in production,
        // although I don't think this function ever gets called during testing anyway).
        setEDValue(strObjName, strQuesRespED);

    });

}

function showFeedback(strEDQuesResp) {
    let objQuesResp = JSON.parse(strEDQuesResp);
    let dispPercCorrect, resultIcon, stuRespLocal;
    
    try {
        dispPercCorrect = parseFloat(objQuesResp.percCorrect * 100).toFixed(0) + "%";
        resultIcon = dispPercCorrect == "100%"
            ? `<span style="color: green;">&#10004;</span>`
            : `<span style="color: red;">&#10008;</span>`;
        stuRespLocal = objQuesResp.respFeedback.stuResp;
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
        Your answer: ${stuRespLocal}
        <br />
        Score: ${dispPercCorrect}
        ${resultIcon}
    `;

    return dispQuesResp;
}


// When you use console . log( someObj), it passes a REFERENCE to someObj.
// That means someObj will change as the code is running, and by the time you look at it,
// it will have the final values. If you want to see the object AT THE TIME the line of code happens,
// you need to use something like this: console . log("Here's the obj right now:", logObj(theObject) );
function logObj(someObj) {
    return JSON.parse(JSON.stringify(someObj));
}

function ansBoxMessages(msgKeyToReturn) {
    const objAnsBoxMessages = {
        percAsDecimal: "Submit answer as a decimal. E.g., 65.4321% would be 0.654321",
        decimalPlaces0: "Decimals are optional. You can round to nearest integer, though decimals are okay too",
        decimalPlaces2: "Include at least 2 decimal places in your answer",
        decimalPlaces4: "Include at least 4 decimal places in your answer",
        writeOutNums: "Write out numbers. E.g., write 12500000; don't write: '12.5'; '12.5 million'; 12,500,000; etc.",
        copyPasteFromWord: "Write your response in Word, then copy-paste into here",
        usePositiveIfAnsCouldBePosOrNeg: `<p>
            If the solution could be a positive or negative value,
            just put the positive number.<br>
            E.g., \\(x=\\sqrt{9}\\) could be \\(-3\\) or \\(+3\\);
            your answer should just be \\(3\\).
            </p>`,
        ansreminderDefault: "Enter your response carefully.", // Default text
    };
    // Return the default message if the caller asks for a non-existent key
    const theKey = msgKeyToReturn in objAnsBoxMessages ? msgKeyToReturn : "ansreminderDefault"
    return objAnsBoxMessages[theKey];
}

// Use scientific notation trick to improve rounding accuracy
function uRound(value, decimals) { return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals) };

// Use "ln" for natural log (log base e). I'm just renaming an existing method here, but it's easier to understand when it's "ln."
function uLn(value) { return Math.log(value) };

// Generate a random number between two numbers
function uRand(min, max, step) {
    if (arguments.length < 2) { max = min; min = 0; }
    if (!step) { step = 1; }
    // The adjFactor is to account for computers' binary adding problem. It multiplies at first and divides at the end.
    const adjFactor = countDecimals(step) === 0 ? 1 : 1 + "0".repeat(countDecimals(step));
    min *= adjFactor; max *= adjFactor; step *= adjFactor;

    const delta = max + step - min; // allows for max to be inclusive
    const range = delta / step;
    let rand;
    rand = Math.random() * range;
    rand = Math.floor(rand);
    rand *= step;
    rand += min;
    rand /= adjFactor;
    return rand;
}

function countDecimals(value) {
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
}

// Calculate the nth root of a number (from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-26.php)
// r^n = x, so the nth root of x is r (n√x = r)
function uthRoot(num, nArg, precArg) {
    const n = nArg || 2; // defaults to square root
    const prec = precArg || 100;

    let x = 1; // Initial guess
    for (let i = 0; i < prec; i++) {
        x = (1 / n) * ((n - 1) * x + (num / Math.pow(x, n - 1)));
    }
    return x;
}


// Create a Tex-style fraction for display
function texFrac(numerator, denominator) { return ["\\frac{", numerator, "}{", denominator, "}"].join('') }

// Create a Tex-style nth root for display
// texRoot(9,2) returns the square root of nine: \\sqrt[2]{9}
// texRoot(9) returns the same, but without the 2: \\sqrt{9}
function texRoot(base, root) {
    let strKatex = "\\sqrt";
    if (root !== undefined) { strKatex += `[${root}]` }
    strKatex += `{${base}}`
    return strKatex;// ["
}


// As of now (Sept 2020), this just replaces the variables in the text with the values.
// It is called by the function listed before the tagged template literal,
// which at this point doesn't even have tags in it.
// It doesn't need to be this complicated. But, building it this way gives flexibility.
// E.g., if I decide I need to put text before & after every stem, I can do so here. 
// Or, I'll be ready if I start using tagged literals like ${myVar} in my ` ` string
function probDisplay(objQuesVars) {
    return function (aryStrings, ...values) {
        let str = '';
        aryStrings.forEach((myStr, i) => {
            str += fStrReplaceVarsWithVals(myStr, objQuesVars);
            str = str + (values[i] || '');
        });
        return "<div>" + str + "</div>";
    }
}

function fStrReplaceVarsWithVals(paramStr, theObj) {
    jQuery.each(theObj, function (origVar, newVar) {
        paramStr = paramStr.replace(RegExp(origVar, "g"), newVar);
    });
    return paramStr;
}



// Add prefix to create a key that's unique across ALL questions in the course.
// This can be passed a string or an object.
// If passed an object, it will iterated over the object to add prefixes to all the Keys.
// Passing an empty string returns only the prefix. E.g., strPrefix = addPrefix(''); // returns "var_q433z__"
function addPrefix(caller) {
    const strPrefix = "var_q" + quesNum() + "z__";
    if (typeof caller === "string") { return strPrefix + caller; };
    let objWithPrefixes = {};
    jQuery.each(caller, function (theKey, theValue) {
        const newKey = strPrefix + theKey;
        objWithPrefixes[newKey] = theValue;
        //delete caller[theKey];
    });
    return objWithPrefixes;
}

function createEDVarInScope(varsObject) {
    const strPrefix = addPrefix(''); // returns just the prefix
    jQuery.each(varsObject, function (passedKey, passedValue) {
        // Remove the prefix from any keys that have it (change "var_q433z__varA" to "varA")
        const simpleKey = passedKey.replace(strPrefix, '');
        if (simpleKey !== passedKey) {
            // FIX: Code fails under 'use strict' because this will not work for getters like calcTheAns
            varsObject[simpleKey] = varsObject[passedKey];
        }
        // Write the variable to scope
        window[simpleKey] = passedValue;
    });
}

// If the variable is already in the embedded data, it uses that. Otherwise, it creates one in the embedded data based on our definition.
function fetchQuesVars(objRandomVars) {
    let objQuesVarsActual = {};

    jQuery.each(objRandomVars, function (theKey, randValue) {
        // FIX: Code fails under 'wse strict' because getEDValue is undefined.
        jQuery.when(getEDValue(theKey)).then(function (edValue) {
            if (edValue) {
                objQuesVarsActual[theKey] = edValue;
            } else {
                jQuery.when(setEDValue(theKey, randValue)).then(function () {
                    objQuesVarsActual[theKey] = randValue;
                });
            };
        });
    });

    return objQuesVarsActual;
}



// Most questions can be graded with this.
// The ones that can't will do their own grading within each question.
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
    jQuery.each(correctAns, (index, curAns) => {
        ptsPossible += 1;
        const curResp = stuResp[index] || 0;
        ptsEarned += percCorrect(curResp, curAns, rawTolerance);
    });

    return ptsEarned / ptsPossible;

    function percCorrect(respToEvaluate, paramCorrectAns, rawTolerance) {
        curCorrectAns = parseFloat(paramCorrectAns);

        // If a rawTolerance is passed, the code will accept answers +/- that amount.
        // Otherwise, it uses a percent difference (i.e., curCorrectAns +/- 1.25% ).
        // The default is 0.0125 (2^-3) because the binary system is happier with that.
        const tolAmt = rawTolerance || Math.abs(curCorrectAns) * 0.0125;

        // Clean text in the student's answer
        let numRespToEvaluate = convertRespToNum(respToEvaluate);

        const isCorrect = Math.abs(numRespToEvaluate - curCorrectAns) <= tolAmt;

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





// Wraps each term in a color statement
function addColorToVars(paramStr, colorObj) {
    jQuery.each(colorObj, function (varName, varColor) {
        paramStr = paramStr.replace(RegExp(varName, "g"), `{\\color{${varColor}}{${varName}}}`);
    });
    return paramStr;
}




/*
// Create shorthand for katex.renderToString
// We can pass the math as a string, number, or array
kx = function (mathToBeRendered, renderingOptions) {
    const mathForKatex = Array.isArray(mathToBeRendered) ? mathToBeRendered.join("") : mathToBeRendered.toString()
    return katex.renderToString(mathForKatex, renderingOptions);
}
 
// I write things like "Solve for x" a lot, so kxx is just shorthand.
kxx = kx("x");
 
// The default displayMode for kx is inline {displayMode:false}.
// The line below is shorthand for displayMode:true, which makes the katex bigger, centers it, and puts it on its own line.
kxbig = (mathToBeRendered) => kx(mathToBeRendered, { displayMode: true })
*/

console.log("user-defined-functions.js loaded.");