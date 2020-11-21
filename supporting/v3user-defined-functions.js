
function UDFClass($, objFromMain) {
    const self = this;
    self.quesNum = quesNumGlobal();
    self.getEDValue = function(edKey) { // I made this thenable because the real Qtrx function nested inside it is thenable
        return new Promise((getEDVal_success, getEDVal_reject) => {
            $.when(Qualtrics.SurveyEngine.getEmbeddedData(edKey))
            .then(
                qtrxGetSuccess => {
                    console.log(`getEmbeddedData (${edKey}) fulfilled a promise: `,qtrxGetSuccess);
                    return getEDVal_success(qtrxGetSuccess);
                },
                qtrxGetFail => {
                    console.log(Error(`getEmbeddedData (${edKey}) was rejected on a promise. `),qtrxGetFail);
                    return getEDVal_reject(qtrxGetFail);
                })
        });
    };
    self.setEDValue = function(edKey, edValue) {  // I made this thenable because the real Qtrx function nested inside it is thenable
        return new Promise((setEDVal_success, setEDVal_reject) => {
            $.when(Qualtrics.SurveyEngine.setEmbeddedData(edKey, edValue)) 
            .then(
                qtrxSetSuccess => {
                    console.log(`setEmbeddedData (${edKey}, ${edValue}) fulfilled a promise: `,qtrxSetSuccess);
                    return setEDVal_success(qtrxSetSuccess);
                },
                qtrxSetFail => {
                    console.log(Error(`setEmbeddedData (${edKey}, ${edValue}) was rejected on a promise. `),qtrxSetFail);
                    return setEDVal_reject(qtrxSetFail);
                });
        });
    };



    // This add a global method to all numbers for formatting
    Number.prototype.$$ = function ({ minDecimals = 0, maxDecimals = 2, strRegion = "en-US", strCurrency = "USD" } = {}) {
        // Get primitive copy of number
        let myNum = this.valueOf();
        // If only one argument is passed, assume that it's the number of decimals
        // E.g., varPV.$$(2) means I want 2 decimal places and all other default formatting
        if (arguments.length == 1 && typeof arguments[0] != "object") {
            minDecimals = arguments[0]; maxDecimals = arguments[0];
        }
        // Return modified copy of number using given parameters
        return myNum.toLocaleString(strRegion, {
            "style": "currency", "currency": strCurrency,
            "minimumFractionDigits": minDecimals, "maximumFractionDigits": maxDecimals
        });
    };

    // This is an aggregator that returns to the sum of all values in an array
    self.arraySum = (theArray) => {
        try {
            return theArray.reduce((a, b) => a + b, 0);
        } catch (error) {
            console.log(error);
            return 0
        }
    }

    // // Return an array of unique values by using Set to remove duplicates and then converting it back to an array
    // self.arrayUnique = (theArray) => [...new Set(theArray)];

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
    }

    // Use scientific notation trick to improve rounding accuracy
    self.uRound = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

    function countDecimals(value) {
        if (Math.floor(value) === value) return 0;
        return value.toString().split(".")[1].length || 0;
    }

    self.combineVarObjs = (...args) => $.extend(...args);

    self.objKeysPerLevel = (obj) => {
        // from https://stackoverflow.com/a/32638121/9312373
        // returns object like { "0": 4, "1": 3, "2": 1}

        let result = {};
        return countKeysPerLevel(result, obj);

        function countKeysPerLevel(store, obj, level=0) {
            const keys = Object.keys(obj);
            let count = keys.length;

            store[level] = (store[level] || 0) + count;

            for (let counter = 0; counter < count; counter++) {
                let childObj = obj[keys[counter]];
                if (typeof childObj === 'object') {
                    countKeysPerLevel(store, childObj, level + 1);
                }
            }
        }
    }

    self.ansBoxMessages = function (msgKeyToReturn) {
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

        }

        function origIRR(aryCashFlow) {
            "use strict;"
            // The financejs IRR file wasn't working right, so I replaced it with this one from https://stackoverflow.com/questions/15089151/javascript-irr-internal-rate-of-return-formula-accuracy
            let args = aryCashFlow;
            let numberOfTries = 1;
            let positive, negative;
            $.each(args, function (idx, value) {
                if (!positive) positive = value > 0;
                if (!negative) negative = value < 0;
            });
            if (!positive || !negative) {
                throw new Error('IRR requires at least one positive value and one negative value')
            }
            
            let min = -1.0; let max = 1.0; let guess; let NPV=0;
            do {
                numberOfTries++;
                if (numberOfTries > 10000) {
                    throw new Error('Cannot find an IRR result');
                }
        
                guess = (min + max) / 2;
                NPV = 0;
                for (let cfIndex = 0; cfIndex < aryCashFlow.length; cfIndex++) {
                    NPV += aryCashFlow[cfIndex] / Math.pow((1 + guess), cfIndex);
                }
                if (NPV > 0) {
                    min = guess;
                }
                else {
                    max = guess;
                }
            } while (Math.abs(NPV) > 0.000001);
            return guess;
        }

        // function origIRR(aryCashFlow) {
        //     // https://github.com/ebradyjobory/finance.js#internal-rate-of-return-irrfinanceirrinitial-investment-cash-flows

        //     // Internal Rate of Return (IRR) is the discount rate often used in capital budgeting that makes the net present value of all cash flows from a particular project equal to zero.6
        //     // // e.g., If initial investment is -$500,000 and the cash flows are $200,000, $300,000, and $200,000, IRR is 18.82%.
        //     //  finance.IRR(-500000, 200000, 300000, 200000);  => 18.82
        //     let args = aryCashFlow;
        //     let numberOfTries = 1;
        //     // Cash flow values must contain at least one positive value and one negative value
        //     let positive, negative;
        //     $.each(args, function (idx, value) {
        //         if (!positive) positive = value > 0;
        //         if (!negative) negative = value < 0;
        //     });
        //     if (!positive || !negative) throw new Error('IRR requires at least one positive value and one negative value');
        //     function npv(rate) {
        //         numberOfTries++;
        //         if (numberOfTries > 1000) { throw new Error('Cannot find a positive IRR result'); }
        //         let rrate = (1 + rate / 100);
        //         let npv = args[0];
        //         for (let i = 1; i < args.length; i++) {
        //             npv += (args[i] / Math.pow(rrate, i));
        //         }
        //         return npv;
        //     }
        //     // return Math.round(seekZero(npv) * 100) / 100;
        //     return self.uRound(seekZero(npv) / 100, 12);
        // }
        function seekZero(fn) {
            let x = 1;
            while (fn(x) > 0) { x += 1; }
            while (fn(x) < 0) { x -= 0.01 }
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
            for (i = 1; i <= aryCashFlow.length; i++) {
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

console.log('v3user-defined-functions.js loaded');



// // user-defined-functions.js








// // When you use console . log( someObj), it passes a REFERENCE to someObj.
// // That means someObj will change as the code is running, and by the time you look at it,
// // it will have the final values. If you want to see the object AT THE TIME the line of code happens,
// // you need to use something like this: console . log("Here's the obj right now:", logObj(theObject) );
// function logObj(someObj) {
//     return JSON.parse(JSON.stringify(someObj));
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