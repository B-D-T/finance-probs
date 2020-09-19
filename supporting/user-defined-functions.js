// user-defined-functions.js

// This needs to be a "global" variable because some vars are set in the page's code (433.js)
// i.e., objQuesResp.strQuesVarsObj  and objQuesResp.correctAns 
// if (typeof objQuesResp === "undefined") { var objQuesResp = {}; }
storeQuesRespVars = (theQuesVars, theAns) => {
    let objQuesResp = {
        "quesNum": quesNum(),
        "strQuesVarsObj": theQuesVars,
        "correctAns": theAns
    };

    // Write the information to a hidden DIV
    let strDivQuesRespStorage = "<div id='divQuesRespStorage' style='display:none'>";
    strDivQuesRespStorage += JSON.stringify(objQuesResp);
    strDivQuesRespStorage += "</div>";
    jQuery("body").append(strDivQuesRespStorage);
}





// The storeQuesRespVars function puts the values in a temporary DIV
// This function writes them into long-term storage (i.e., Embedded Data)
setEDQuesRespVars = (objRespFeedback) => {
//    console.log("I'm setEDQuesRespVars. I received this objRespFeedback from fnQuesResp: ", objRespFeedback);

    let stuResp = document.getElementById("QR~" + objRespFeedback.qtrxQuesID).value;
    stuResp = sanitizeInput(stuResp);
    objRespFeedback = { "stuResp": stuResp };

    // Retrieve stored question information from hidden DIV
    const strQuesRespStorage = jQuery("#divQuesRespStorage").text().trim();

    // Convert the stored information to an object
    let objQuesResp = JSON.parse(strQuesRespStorage);

    // Check answer
    objQuesResp["percCorrect"] = respPercCorrect(objRespFeedback.stuResp, objQuesResp.correctAns);

    // Store feedback that will be shown to user when they see the Solution
    objQuesResp["respFeedback"] = objRespFeedback;

    const strObjName = "objQuesResp" + objQuesResp.quesNum.toString(); // objRespQues433
    const strQuesRespED = JSON.stringify(objQuesResp);

    console.log("About to be written to ED --> " + strObjName + ": " + strQuesRespED)

    // Write quesResp to Embedded Data
    setEDValue(strObjName, strQuesRespED);
}

showFeedback = (strEDQuesResp) => {
    const objQuesResp = JSON.parse(strEDQuesResp);

    const dispPercCorrect = parseFloat(objQuesResp.percCorrect * 100).toFixed(0) + "%";

    let resultIcon = dispPercCorrect == "100%" ? 
    `<span style="color: green;">&#10004;</span>` :
    `<span style="color: red;">&#10008;</span>`

    let dispQuesResp = `
        Your answer: ${objQuesResp.respFeedback.stuResp}
        <br />
        Score: ${dispPercCorrect}
        ${resultIcon}
    `;

    return dispQuesResp;
}


// When you use console.log(someObj), it passes a REFERENCE to someObj.
// That means someObj will change as the code is running, and by the time you look at it,
// it will have the final values. If you want to see the object AT THE TIME the line of code happens,
// you need to use something like this: console.log("Here's the obj right now:", logObj(theObject) );
logObj = function (someObj) {
    return JSON.parse(JSON.stringify(someObj));
}

ansBoxMessages = function (msgKeyToReturn) {
    const objAnsBoxMessages = {
        percAsDecimal: "Submit answer as a decimal. E.g., 65.4321% would be 0.654321",
        decimalPlaces0: "Decimals are optional. You can round to nearest integer, though decimals are okay too",
        decimalPlaces2: "Include at least 2 decimal places in your answer",
        decimalPlaces4: "Include at least 4 decimal places in your answer",
        writeOutNums: "Write out numbers. E.g., write 12500000; don't write: '12.5'; '12.5 million'; 12,500,000; etc.",
        copyPasteFromWord: "Write your response in Word, then copy-paste into here"
    };
    return objAnsBoxMessages[msgKeyToReturn];
}

// Use scientific notation trick to improve rounding accuracy
uRound = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

// Use "ln" for natural log (log base e). I'm just renaming an existing method here, but it's easier to understand when it's "ln."
uLn = (value) => Math.log(value);

// Generate a random number between two numbers
uRand = function (min, max, step) {
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

countDecimals = function (value) {
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
}

// Calculate the nth root of a number (from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-26.php)
// r^n = x, so the nth root of x is r (n√x = r)
uthRoot = function (num, nArg, precArg) {
    const n = nArg || 2; // defaults to square root
    const prec = precArg || 12; // defaults to 12 places of precision

    let x = 1; // Initial guess
    for (let i = 0; i < prec; i++) {
        x = 1 / n * ((n - 1) * x + (num / Math.pow(x, n - 1)));
    }
    return x;
}


// Create a Tex-style fraction for display
texFrac = (numerator, denominator) => ["\\frac{", numerator, "}{", denominator, "}"].join('')

// Create a Tex-style nth root for display
texRoot = (base, root) => ["\\sqrt[", root, "]{", base, "}"].join('')


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
            //str += replaceVars(myStr, i);
            str += fStrReplaceVarsWithVals(myStr, objQuesVars);
            str = str + (values[i] || '');
        });
        return str;
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
        //delete callerObj[theKey];
    });
    return objWithPrefixes;
}

function createEDVarInScope(varsObject, theScope) {
    strPrefix = addPrefix(''); // returns just the prefix

    jQuery.each(varsObject, function (passedKey, passedValue) {
        // Remove the prefix from any keys that have it (change "var_q433z__varA" to "varA")
        const simpleKey = passedKey.replace(strPrefix, '');
        varsObject[simpleKey] = varsObject[passedKey];
        // Write the variable to scope
        theScope[simpleKey] = passedValue;
    });
}

// If the variable is already in the embedded data, it uses that. Otherwise, it creates one in the embedded data based on our definition.
function fetchQuesVars(objRandomVars) {
    let objQuesVarsActual = {};

    jQuery.each(objRandomVars, function (theKey, randValue) {
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
        const tolAmt = rawTolerance || curCorrectAns * 0.0125;

        // Clean text in the student's answer
        let numRespToEvaluate = convertRespToNum(respToEvaluate);

        const isCorrect = Math.abs(numRespToEvaluate - curCorrectAns) < tolAmt;

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


function explainPVSinglePmt_PV(qvObj) {
    // Right now I'm just using black because I found the colors distracting. But I'll leave the code in case I change my mind down the road.
    let objColors = {
        varY: "black",
        varN: "black",
        varPV: "black",
        varRate: "black",
        varFV: "black"
    };

    let myStr = `
        <p>
            There is a lump sum (\$varFV) in the future (year varN),
            and you want to know what it is going to be worth in year ${qvObj.varY - qvObj.varN}.
            Let's see this on a timeline:
            ${timelinePVSinglePmt(qvObj)}
        </p>
        <p>
            ${tvmtreePVSinglePmt(qvObj, objColors)}
        </p>
        <p>
            ${identifyPVVars(qvObj, objColors)}
        </p>
        <p>
            ${solvePVSinglePmt_PV(qvObj, objColors)}
        </p>
    `;

    return fStrReplaceVarsWithVals(myStr, qvObj);
}


function solvePVSinglePmt_PV(qv, objColors) {
    const varPV = qv.varPV;
    const varFV = qv.varFV;
    const varN = qv.varN;
    const varRate = qv.varRate;
    const varY = qv.varY;

    const calcPVYear = varY - varN;
    const calcFVIF = (1 + varRate) ** varN;
    const calcPVIF = 1 / calcFVIF;
    const dispGrowthRate = uRound(1 + varRate, 4);
    const dispFVIF = uRound(calcFVIF, 5);
    const dispPVIF = uRound(calcPVIF, 5);
    const calcTheAns = varFV * calcPVIF;

    let myStr = `
    Plug the variables into the formula and solve for the unknown term.
    \\[
        \\begin{aligned}
            PV_{varY-varN} &= varFV \\left( \\frac{1}{(1+{varRate})^{varN}} \\right) \\\\
            PV_${calcPVYear} &= varFV \\left( \\frac{1}{(${dispGrowthRate})^{varN}} \\right) \\\\
            PV_${calcPVYear} &= varFV \\left( \\frac{1}{${dispFVIF}} \\right) \\\\
            PV_${calcPVYear} &= varFV \\left( ${dispPVIF} \\right) \\\\
            PV_${calcPVYear} &= ${calcTheAns}
        \\end{aligned}
    \\]
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, qv);
}

// Returns HTML with code for the timeline
function timelinePVSinglePmt(qv) {
    let myStr = `
    <div style="width:300px;text-align: center; margin:25px;">
        <div style="display:flex; justify-content:center; font-weight:bold;">
            <div style="width:15%;">Year</div>
            <div style="width:20%;">${qv.varY - qv.varN}</div>
            <div style="width:45%;"></div>
            <div style="width:20%;">varN</div>
        </div>
        <div><hr /></div>
        <div style="display:flex; justify-content:center;">
            <div style="width:15%; font-weight:bold;">Amt</div>
            <div style="width:20%;">varPV</div>
            <div style="width:45%;"></div>
            <div style="width:20%;">varFV</div>
        </div>
        <div style="margin-left:15%;">
            \\( \\overleftarrow{\\text{Bring back}} \\)
        </div>
    </div>
    `;
    return fStrReplaceVarsWithVals(myStr, qv);
}

function tvmtreePVSinglePmt(qv, objColors) {
    const formulaVars = {
        varY: "y",
        varN: "n",
        varRate: "i",
        varPV: "PV",
        varFV: "C"
    };
    let myStr = `
        <div>
            <p style="margin-bottom:4px;">
                We're discounting a value back (i.e., to the left on the timeline),
                so we'll start on the <b>Present Value</b> side of the TVM Decision Tree and start asking questions:
            </p>
            <p style="margin-left:20px; margin-top:4px;">
                Are we looking at one amount at two different points in time?
                Or is there a series of payments? <i>There is a single payment.</i> 
            </p>
            <p>
                <!-- show img of chart with paths drawn -->
            </p>
            <p>
                This leads us to the formula for the <b>Present Value of a Single Payment</b>:
            \\[
                varPV_{varY-varN}={varFV}_{varN} \\left( \\frac{1}{(1+{varRate})^{varN}} \\right)
            \\]
            </p>
        </div>
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, formulaVars);
}

// Returns HTML for variables in the Present Value of a single payment formula
function identifyPVVars(qv, objColors) {
    let myStr = `
    List the variables in the formula and write what is known and unknown.
    \\[
        \\begin{aligned}
            C_{varN} &= {varFV} \\\\
            PV_{varY-varN} &= {varPV} \\\\
            i &= varRate \\\\
            n &= varN \\\\
            y &= varY
        \\end{aligned}
    \\]
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, qv);
}


function explainFVSinglePmt_FV(qvObj) {
    // Right now I'm just using black because I found the colors distracting. But I'll leave the code in case I change my mind down the road.
    let objColors = {
        varY: "black",
        varN: "black",
        varPV: "black",
        varRate: "black",
        varFV: "black"
    };

    let myStr = `
        <p>
            You have a lump sum (\$varPV) in year varY,
            and you want to know what it is worth in year ${varY + varN}.
            Let's see this on a timeline:
            ${timelineFVSinglePmt(qvObj)}
        </p>
        <p>
            ${tvmtreeFVSinglePmt(qvObj, objColors)}
        </p>
        <p>
            ${identifyFVVars(qvObj, objColors)}
        </p>
        <p>
            ${solveFVSinglePmt_FV(qvObj, objColors)}
        </p>
    `;

    return fStrReplaceVarsWithVals(myStr, qvObj);
}

function explainFVSinglePmt_N(qvObj) {
    // Right now I'm just using black because I found the colors distracting. But I'll leave the code in case I change my mind down the road.
    let objColors = {
        varY: "black",
        varN: "black",
        varPV: "black",
        varRate: "black",
        varFV: "black"
    };

    let myStr = `
        <p>
            You know PV<sub>varY</sub> (\$varPV) and FV<sub>??</sub> (\$varFV),
            but you don't know how long it will take for the
            PV to grow to the FV amount.
            Let's see this on a timeline:
            ${timelineFVSinglePmt(qvObj)}
        </p>
        <p>
            ${tvmtreeFVSinglePmt(qvObj, objColors)}<br />
        </p>
        <p>
            ${identifyFVVars(qvObj, objColors)}
        </p>
        <p>
            ${solveFVSinglePmt_N(qvObj, objColors)}
        </p>

    `;

    return fStrReplaceVarsWithVals(myStr, qvObj);
}

function solveFVSinglePmt_FV(qv, objColors) {
    let myStr = `
    Plug the variables into the formula and solve for the unknown term.
    \\[
        \\begin{aligned}
        FV_{varY+varN} &= varPV(1+varRate)^{varN} \\\\
        FV_{${varY + varN}} &= varPV({dispGrowthRate})^{varN} \\\\
        FV_{${varY + varN}} &= varPV({dispFVIF}) \\\\
        FV_{${varY + varN}} &= calcTheAns
        \\end{aligned}
    \\]
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, qv);
}


function solveFVSinglePmt_N(qv, objColors) {
    let myStr = `
    Plug the variables into the formula and solve for the unknown term.
    \\[
        \\begin{aligned}
            varFV &= varPV(1+varRate)^n \\\\
            {}  \\\\
            \\frac{varFV}{varPV} &= {dispGrowthRate}^n \\\\
            {}  \\\\
            dispFVdivPV &= {dispGrowthRate}^n
        \\end{aligned}
    \\]
    The variable (\\(n\\)) is in the exponent, so we need to bring it 
        down with the rest of the equation in order to solve for 
        it. To do this, we can use the natural log (ln). When you 
        take the natural log of each side of the equation, \\(n\\) 
        moves down and is multiplied by the rest of the term.
    \\[
        \\begin{aligned}
            ln(dispFVdivPV) &= n*ln(dispGrowthRate) \\\\
            {}  \\\\
            dispLnFVdivPV &=  n*dispLnGrowthRate  \\\\
            {}  \\\\
            \\frac{dispLnFVdivPV}{dispLnGrowthRate}  &=  n  \\\\
            {}  \\\\
            calcTheAns  &=  n
        \\end{aligned}
    \\]
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, qv);
}


function timelineFVSinglePmt(qv) {
    let myStr = `
    <div style="width:300px;text-align: center; margin:25px;">
        <div style="display:flex; justify-content:center; font-weight:bold;">
            <div style="width:15%;">Year</div>
            <div style="width:20%;">varY</div>
            <div style="width:45%;"></div>
            <div style="width:20%;">varN</div>
        </div>
        <div><hr /></div>
        <div style="display:flex; justify-content:center;">
            <div style="width:15%; font-weight:bold;">Amt</div>
            <div style="width:20%;">varPV</div>
            <div style="width:45%;"></div>
            <div style="width:20%;">varFV</div>
        </div>
        <div style="margin-left:15%;">
            \\( \\overrightarrow{\\text{To the future}} \\)
        </div>
    </div>
    `;
    return fStrReplaceVarsWithVals(myStr, qv);
}


// Returns HTML for the Future Value of a single payment formula on the TVM Decision Tree
function tvmtreeFVSinglePmt(qv, objColors) {
    const formulaVars = {
        varY: "y",
        varN: "n",
        varRate: "i",
        varPV: "C",
        varFV: "FV"
    };
    let myStr = `
        <div>
            <p style="margin-bottom:4px;">
                We're moving to the future,
                so we'll start on the <b>Future Value</b> side of the TVM Decision Tree and start asking questions:
            </p>
            <p style="margin-left:20px; margin-top:4px;">
                Are we looking at one amount at two different points in time?
                Or is there a series of payments? <i>There is a single payment.</i> 
            </p>
            <p>
                <!-- show img of chart with paths drawn -->
            </p>
            <p>
                This leads us to the formula for the <b>Future Value of a Single Payment</b>:
            \\[
                FV_{varY+varN}={varPV}_{varY}(1+{varRate})^{varN}
            \\]
            </p>
        </div>
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, formulaVars);
}



// Returns HTML for variables in the Future Value of a single payment formula
function identifyFVVars(qv, objColors) {
    let myStr = `
    List the variables in the formula and write what is known and unknown.
    \\[
        \\begin{aligned}
            FV_{varY+varN} &= {varFV} \\\\
            PV_{varY} &= {varPV} \\\\
            i &= varRate \\\\
            n &= varN \\\\
            y &= varY
        \\end{aligned}
    \\]
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, qv);
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

console.log("user-defined-functions.js loaded");