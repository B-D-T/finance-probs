
// // Treating it as an object works.
// //In main.js, I run the following:
// (() => jQuery.getScript( "./supporting/v3user-defined-functions.js", ()=>console.log(udf.poodleFunc(" cat")) ) )();
// // This is the code in the udf.js file
// var udf = { poodleFunc: function(arg){ return poodleCall(arg); } }
// function poodleCall(arg){ return 'poodle'+arg; }
// console.log('v3user-defined-functions.js loaded');

// // Treating it as a class works!! Yay!!
// // In main.js, put the following:
// (function(){
//     jQuery.getScript( "./supporting/v3user-defined-functions.js",function(){
//     var udf = new UDFClass(jQuery);
//     console.log(udf.poodleFunc(" cat"));
// });
// })();
// // In udf.js, put the following:
// function UDFClass($){ this.poodleFunc = (arg) => poodleCall(arg); }
// function poodleCall(arg){ 
//     const $divStem = $('#divQues470-stem');
//     $divStem.html('poodle'+arg); 
//     return 'It is done';
// }
// console.log('v3user-defined-functions.js loaded');

function UDFClass($, objFromMain) {
    const self = this;
    self.quesNum = quesNumGlobal();


    // This add a global method to all numbers for formatting.
    // To use, append .$$() to the end of a number variable.
    // E.g., varPV.$$, or varPV.$$(whatever arguments you want)
    Number.prototype.$$ = function ({minDecimals=0, maxDecimals=2, strRegion="en-US", strCurrency="USD"}={}){
        // Get primitive copy of number
        let myNum= this.valueOf();
        // If only one argument is passed, assume that it's the number of decimals
        // E.g., varPV.$$(2) means I want 2 decimal places and all other default formatting
        if (arguments.length==1 && typeof arguments[0] != "object"){
            minDecimals=arguments[0]; maxDecimals=arguments[0];
        }
        // Return modified copy of number using given parameters
        return myNum.toLocaleString(strRegion, {
            "style": "currency", "currency": strCurrency,
            "minimumFractionDigits": minDecimals, "maximumFractionDigits": maxDecimals
        });
    };

    // Generate a random number between two numbers
    self.uRand = function (min, max, step) {
        if (arguments.length < 2) { max = min; min = 0; }
        if (!step) { step = 1; }
        // The adjFactor is to account for computers' binary adding problem. It multiplies at first and divides at the end.
        const adjFactor = countDecimals(step) === 0 ? 1 : parseInt(1 + "0".repeat(countDecimals(step)));
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
    };

    // Use scientific notation trick to improve rounding accuracy
    self.uRound = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

    function countDecimals(value) {
        if (Math.floor(value) === value) return 0;
        return value.toString().split(".")[1].length || 0;
    }

    // Receives multiple objects as arguments.
    // Using the first object as starting place, it appends key:value pairs from the subsequent objects to the first object, returning a bigger version of the first object (i.e., with the key:value pairs from all the other objects, too)
    self.combineVarObjs = (...args) => $.extend(...args);

    self.ansBoxMessages = function (msgKeyToReturn) {
        const objAnsBoxMessages = {
            percAsDecimal: "Submit answer as a decimal. E.g., 65.4321% would be 0.654321",
            decimalPlaces0: "Decimals are optional. You can round to nearest integer, though decimals are okay too",
            decimalPlaces2: "Include at least 2 decimal places in your answer",
            decimalPlaces4: "Include at least 4 decimal places in your answer",
            writeOutNums: "Write out numbers. E.g., write 12500000; don't write: '12.5'; '12.5 million'; 12,500,000; etc.",
            excelFormulaNoEqualsSign: "Do NOT include the equals sign at the start. Eg, write SUM(1,2) not \=SUM(1,2)",
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
        const theKey = msgKeyToReturn in objAnsBoxMessages ? msgKeyToReturn : "ansreminderDefault";
        return objAnsBoxMessages[theKey];
    };

    // This returns a text string of <option> values to build a <select> box.
    // The first parameter can be an object or array.
    self.buildDropdownOptions = function (paramOptions, blnShowTopBlank = true){

        // If the visible choice should be empty, start by putting a blank
        let aryOptionValues = blnShowTopBlank ? ['emptyspace'] : [];
        let aryOptionHTMLs = blnShowTopBlank ? [''] : [];

        // Check if input parameter is an array or an object
        if (Array.isArray(paramOptions)) {
            // If paramOptions is an array, set the option 'value' and the HTML to be the same thing
            jQuery.each(paramOptions, function(idx, curAryElement){
                aryOptionValues.push(curAryElement);
                aryOptionHTMLs.push(curAryElement);
            });
        } else { // it's an object
            // If paramOptions is an object, the keys are the 'value' attribute in the option tag and the object's values are the visible HTML
            jQuery.each(paramOptions, function(k,v){
                aryOptionValues.push(k);
                aryOptionHTMLs.push(v);
            });
        }
        
        let strOptionsHTML = '';
        jQuery.each(aryOptionValues, function(idx) {
            const theOptionVal = aryOptionValues[idx];
            const theOptionHTML = aryOptionHTMLs[idx];
            strOptionsHTML += `<option value="${theOptionVal}">${theOptionHTML}</option>`;
        });

        return strOptionsHTML;

    };

    // When you use console . log( someObj), it passes a REFERENCE to someObj.
    // That means someObj will change as the code is running, and by the time you look at it,
    // it will have the final values. If you want to see the object AT THE TIME the line of code happens,
    // you need to use something like this: console . log("Here's the obj right now:", logObj(theObject) );
    self.logObj = function(someObj) {
        return jQuery.isEmptyObject(someObj) ? {} : JSON.parse(JSON.stringify(someObj));
    };




    // $$$$$$$$$$$$$$$$$$$$$$$$$
    // FINANCEJS FUNCTIONS
    // $$$$$$$$$$$$$$$$$$$$$$$$$
    // I couldn't figure out how to use the financejs module, so I just copied the code I needed into here.
    // I tweak a few things (probably making them worse), so all credit goes to https://github.com/ebradyjobory/finance.js

    // Internal Rate of Return (IRR)
    // finance.IRR(initial investment, [cash flows]);
    self.financejs = function () {
        this.IRR = (aryCashFlow) => {
            try { return origIRR(aryCashFlow); }
            catch (error) { return error.message; }
        };
        this.PaybackPeriod = (aryCashFlow) => {
            try { return origPaybackPeriod(aryCashFlow); }
            catch (error) { return error.message; }

        };

        function origIRR(aryCashFlow) {
            // https://github.com/ebradyjobory/finance.js#internal-rate-of-return-irrfinanceirrinitial-investment-cash-flows

            // Internal Rate of Return (IRR) is the discount rate often used in capital budgeting that makes the net present value of all cash flows from a particular project equal to zero.6
            // // e.g., If initial investment is -$500,000 and the cash flows are $200,000, $300,000, and $200,000, IRR is 18.82%.
            //  finance.IRR(-500000, 200000, 300000, 200000);  => 18.82
            let args = aryCashFlow;
            let numberOfTries = 1;
            // Cash flow values must contain at least one positive value and one negative value
            let positive, negative;
            $.each(args, function (idx, value) {
                if (!positive) positive = value > 0;
                if (!negative) negative = value < 0;
            });
            if (!positive || !negative) throw new Error('IRR requires at least one positive value and one negative value');
            function npv(rate) {
                numberOfTries++;
                if (numberOfTries > 1000) { throw new Error('Cannot find a positive IRR result'); }
                let rrate = (1 + rate / 100);
                let npv = args[0];
                for (let i = 1; i < args.length; i++) {
                    npv += (args[i] / Math.pow(rrate, i));
                }
                return npv;
            }
            // return Math.round(seekZero(npv) * 100) / 100;
            return self.uRound(seekZero(npv) / 100, 12);
        }
        function seekZero(fn) {
            let x = 1;
            while (fn(x) > 0) { x += 1; }
            while (fn(x) < 0) { x -= 0.01; }
            return x + 0.01;
        }


        function origPaybackPeriod(aryCashFlow) {
            // Payback Period (PP)
            // https://github.com/ebradyjobory/finance.js#payback-period-ppfinanceppnumber-of-periods-cash-flows

            // Payback Period (PP) is the length of time required to recover the cost of an investment.
            // [cash flows] takes any number of projected cash flows.
            //  #Uneven Cash Flows
            // e.g., If number of periods is 5, initial investment is -$50, and the cash flows are $10, $13, $16, $19, and $22 for each year, the payback period is 3.42 years.
            //  finance.PP(5, -50, 10, 13, 16, 19, 22);  => 3.42

            // for uneven cash flows (I removed the section on even cash flows)
            let cumulativeCashFlow = aryCashFlow[0];
            let yearsCounter = 0;
            for (let i = 1; i <= aryCashFlow.length; i++) {
                cumulativeCashFlow += aryCashFlow[i];
                if (cumulativeCashFlow > 0) {
                    yearsCounter += Math.abs((cumulativeCashFlow - aryCashFlow[i]) / aryCashFlow[i]);
                    return yearsCounter;
                } else {
                    yearsCounter++;
                }
            }
        };

    };

}

// console.log('v3user-defined-functions.js loaded');



// // user-defined-functions.js


// // Each student sees variables unique to that student (randomly generated)
// // This function writes those embedded data.
// // When the student leaves the page, 
// // the student's answer will be combined with those variables and written as a different variable in the Qualtrics embedded data.
// function storeQuesRespVars(theQuesVars, theAns) {
//     let objQuesResp = {
//         "quesNum": quesNum(),
//         "objQuesVars": theQuesVars, // the property stores an object
//         "correctAns": theAns
//     };
//     let strQuesVarsStorageKey = "strQues" + objQuesResp.quesNum + "VarsStorage"; // strQues433VarsStorage
//     console.log('udf -> objQuesResp = ', objQuesResp);
//     let strQuesVarsStorageVal = JSON.stringify(objQuesResp);

//     if (!(objQuesCaller.isProduction == false)) {
//         setEDValue(strQuesVarsStorageKey, strQuesVarsStorageVal);
//     } else { console.log("No setEDValue for " + strQuesVarsStorageKey + ": " + strQuesVarsStorageVal) }
// }


// // This function writes the student-question-specific variables (and student answer)
// // into long-term storage (i.e., Embedded Data)
// function setEDQuesRespVars(objRespFeedback) {

//     // Read the student's response from the page and add it to the feedback object
//     let stuResp = "123123123";
//     if (!(objQuesCaller.isProduction == false)) {
//         stuResp = document.getElementById("QR~" + objRespFeedback.qtrxQuesID).value; // read answer from Qualtrics page
//     }
//     stuResp = sanitizeInput(stuResp);
//     objRespFeedback["stuResp"] = stuResp;

//     // Retrieve stored question information from Embedded data and convert it to an object
//     let strQuesVarsStorageKey = "strQues" + objRespFeedback.strQuesNum + "VarsStorage";
//     jQuery.when(getEDValue(strQuesVarsStorageKey)).then(function (edValue) {

//         let objQuesResp = JSON.parse(edValue);

//         // Check answer, then add the score to the QuesResp object
//         objQuesResp["percCorrect"] = respPercCorrect(objRespFeedback.stuResp, objQuesResp.correctAns);

//         // Store feedback that will be shown to user when they see the Solution
//         objQuesResp["respFeedback"] = objRespFeedback;

//         const strObjName = "objQuesResp" + objQuesResp.quesNum.toString(); // objRespQues433
//         const strQuesRespED = JSON.stringify(objQuesResp);

//         // Write quesResp to Embedded Data (assuming we're in production,
//         // although I don't think this function ever gets called during testing anyway).
//         setEDValue(strObjName, strQuesRespED);

//     });

// }

// function showFeedback(strEDQuesResp) {
//     let objQuesResp = JSON.parse(strEDQuesResp);
//     let dispPercCorrect, resultIcon, stuRespLocal;

//     try {
//         dispPercCorrect = parseFloat(objQuesResp.percCorrect * 100).toFixed(0) + "%";
//         resultIcon = dispPercCorrect == "100%"
//             ? `<span style="color: green;">&#10004;</span>`
//             : `<span style="color: red;">&#10008;</span>`;
//         stuRespLocal = objQuesResp.respFeedback.stuResp;
//     }
//     catch (err) {
//         console.log("Error trying to set the dispPercCorrect variable");
//         stuRespLocal = "The response is stored in the system, but it cannot be retrieved at this time.";
//         dispPercCorrect = "Not available.";
//         resultIcon = "";
//     }
//     // finally {
//     //     stuRespLocal = "The response is stored in the system, but it cannot be retrieved at this time.";
//     //     dispPercCorrect = "Not available.";
//     //     resultIcon = "";
//     // }

//     let dispQuesResp = `
//         Your answer: ${stuRespLocal}
//         <br />
//         Score: ${dispPercCorrect}
//         ${resultIcon}
//     `;

//     return dispQuesResp;
// }



// // Use "ln" for natural log (log base e). I'm just renaming an existing method here, but it's easier to understand when it's "ln."
// function uLn(value) { return Math.log(value) };



// // Calculate the nth root of a number (from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-26.php)
// // r^n = x, so the nth root of x is r (n√x = r)
// function uthRoot(num, nArg, precArg) {
//     const n = nArg || 2; // defaults to square root
//     const prec = precArg || 100;

//     let x = 1; // Initial guess
//     for (let i = 0; i < prec; i++) {
//         x = (1 / n) * ((n - 1) * x + (num / Math.pow(x, n - 1)));
//     }
//     return x;
// }


// // Create a Tex-style fraction for display
// function texFrac(numerator, denominator) { return ["\\frac{", numerator, "}{", denominator, "}"].join('') }

// // Create a Tex-style nth root for display
// // texRoot(9,2) returns the square root of nine: \\sqrt[2]{9}
// // texRoot(9) returns the same, but without the 2: \\sqrt{9}
// function texRoot(base, root) {
//     let strKatex = "\\sqrt";
//     if (root !== undefined) { strKatex += `[${root}]` }
//     strKatex += `{${base}}`
//     return strKatex;// ["
// }


// // As of now (Sept 2020), this just replaces the variables in the text with the values.
// // It is called by the function listed before the tagged template literal,
// // which at this point doesn't even have tags in it.
// // It doesn't need to be this complicated. But, building it this way gives flexibility.
// // E.g., if I decide I need to put text before & after every stem, I can do so here. 
// // Or, I'll be ready if I start using tagged literals like ${myVar} in my ` ` string
// function probDisplay(objQuesVars) {
//     return function (aryStrings, ...values) {
//         let str = '';
//         aryStrings.forEach((myStr, i) => {
//             str += fStrReplaceVarsWithVals(myStr, objQuesVars);
//             str = str + (values[i] || '');
//         });
//         return "<div>" + str + "</div>";
//     }
// }

// function fStrReplaceVarsWithVals(paramStr, theObj) {
//     jQuery.each(theObj, function (origVar, newVar) {
//         paramStr = paramStr.replace(RegExp(origVar, "g"), newVar);
//     });
//     return paramStr;
// }




// function createEDVarInScope(varsObject) {
//     const strPrefix = addPrefix(''); // returns just the prefix
//     jQuery.each(varsObject, function (passedKey, passedValue) {
//         // Remove the prefix from any keys that have it (change "var_q433z__varA" to "varA")
//         const simpleKey = passedKey.replace(strPrefix, '');
//         if (simpleKey !== passedKey) {
//             // FIX: Code fails under 'use strict' because this will not work for getters like calcTheAns
//             varsObject[simpleKey] = varsObject[passedKey];
//         }
//         // Write the variable to scope
//         window[simpleKey] = passedValue;
//     });
// }




// // Most questions can be graded with this.
// // The ones that can't will do their own grading within each question.
// // Pass a single answer to check or pass arrays of answers.
// function respPercCorrect(stuResp, correctAns, rawTolerance) {

//     // Return 0 if stuResp is null or empty (this will allow stuResp = 0)
//     if (stuResp === null || stuResp === "") { return 0; }

//     // If this is only checking a single value, run the check and return 1/0
//     if (!Array.isArray(correctAns)) { return percCorrect(stuResp, correctAns, rawTolerance); }

//     let ptsPossible = 0;
//     let ptsEarned = 0;

//     // If the student submitted only one answer, convert it to an array
//     stuResp = !Array.isArray(stuResp) ? stuResp.split() : stuResp

//     // For multi-answer questions, assign 1 point to each answer.
//     // Students can earn a point each time through.
//     jQuery.each(correctAns, (index, curAns) => {
//         ptsPossible += 1;
//         const curResp = stuResp[index] || 0;
//         ptsEarned += percCorrect(curResp, curAns, rawTolerance);
//     });

//     return ptsEarned / ptsPossible;

//     function percCorrect(respToEvaluate, paramCorrectAns, rawTolerance) {
//         curCorrectAns = parseFloat(paramCorrectAns);

//         // If a rawTolerance is passed, the code will accept answers +/- that amount.
//         // Otherwise, it uses a percent difference (i.e., curCorrectAns +/- 1.25% ).
//         // The default is 0.0125 (2^-3) because the binary system is happier with that.
//         const tolAmt = rawTolerance || curCorrectAns * 0.0125;

//         // Clean text in the student's answer
//         let numRespToEvaluate = convertRespToNum(respToEvaluate);

//         const isCorrect = Math.abs(numRespToEvaluate - curCorrectAns) < tolAmt;

//         return isCorrect ? 1 : 0;
//     }

//     function convertRespToNum(theResp) {
//         let resp = theResp.toString().trim();

//         const charsToRemove = [",", "\\$"];
//         jQuery.each(charsToRemove, function (i, char) {
//             const regex = new RegExp(char, "g");
//             resp = resp.replace(regex, '');
//         });

//         return parseFloat(resp);
//     }
// }


// function sanitizeInput(userInput) {
//     // Code from https://stackoverflow.com/questions/2794137/sanitizing-user-input-before-adding-it-to-the-dom-in-javascript
//     const map = {
//         '&': '&amp;',
//         '<': '&lt;',
//         '>': '&gt;',
//         '"': '&quot;',
//         "'": '&#x27;',
//         "/": '&#x2F;',
//         "`": '&grave;'
//     };
//     const reg = /[&<>"'/]/ig;
//     return userInput.replace(reg, (match) => (map[match]));
// }





// // Wraps each term in a color statement
// function addColorToVars(paramStr, colorObj) {
//     jQuery.each(colorObj, function (varName, varColor) {
//         paramStr = paramStr.replace(RegExp(varName, "g"), `{\\color{${varColor}}{${varName}}}`);
//     });
//     return paramStr;
// }




// /*
// // Create shorthand for katex.renderToString
// // We can pass the math as a string, number, or array
// kx = function (mathToBeRendered, renderingOptions) {
//     const mathForKatex = Array.isArray(mathToBeRendered) ? mathToBeRendered.join("") : mathToBeRendered.toString()
//     return katex.renderToString(mathForKatex, renderingOptions);
// }

// // I write things like "Solve for x" a lot, so kxx is just shorthand.
// kxx = kx("x");

// // The default displayMode for kx is inline {displayMode:false}.
// // The line below is shorthand for displayMode:true, which makes the katex bigger, centers it, and puts it on its own line.
// kxbig = (mathToBeRendered) => kx(mathToBeRendered, { displayMode: true })
// */

// console.log("user-defined-functions.js loaded.");