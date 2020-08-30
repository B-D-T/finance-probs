
const objAnsBoxMessages = {
    percAsDecimal: "Submit answer as a decimal. E.g., 65.4321% would be 0.654321",
    decimalPlaces2: "Include at least 2 decimal places in your answer",
    decimalPlaces4: "Include at least 4 decimal places in your answer",
    copyPasteFromWord: "Write your response in Word, then copy-paste into here"
}

// Use scientific notation trick to improve rounding accuracy
const uRound = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

// Use "ln" for natural log (log base e). I'm just renaming an existing method here, but it's easier to understand when it's "ln."
const uLn = (value) => Math.log(value);

// Create a LaTex-style fraction
const uFrac = (numerator, denominator) => ["\\frac{", numerator, "}{", denominator, "}"].join('')

// If the variable is already in the embedded data, it uses that. Otherwise, it creates one in the embedded data based on our definition.
function fetchQuesVars(objVarDefs) {
    let qv = {};
    jQuery.when(fetchEachKV(objVarDefs)).then(function(){ return qv; });

    function fetchEachKV(objVarDefs) {
        console.log("I'm fetchEachKV. My object is: ");
        console.log(objVarDefs);
        jQuery.each(objVarDefs, function (theKey, theValue) {
            console.log(`jQuery.each(obvVarsDefs), about to sync ${theKey}:${theValue}`);
            jQuery.when(syncEmbeddedData(theKey, theValue)).then( function(returnedValue) {
                console.log(`I'm about to write qv[${theKey}] = ${returnedValue}`);
                qv[theKey] = returnedValue;
            })
        });

        function syncEmbeddedData(theKey, theValue) {
            console.log(`syncEmbeddedData working on ${theKey}:${theValue}.`);
            let newValue = jQuery.when(getEDValue(theKey)).then(function (edValue) {
                console.log(`getEDValue returned ${edValue}. I'm going to write that to ${theKey}`);
                let storedEDValue = edValue;
                if (storedEDValue) {
                    console.log(`It looks like ${theKey}:${storedEDValue} was already in the embedded data, so I'm going to return ${storedEDValue} without setting anything`);
                    return storedEDValue;
                } else {
                    console.log(`So ${theKey} isn't in the embedded data. Let's setEdValue(${theKey}, ${theValue}).`);
                    jQuery.when(setEDValue(theKey, theValue)).then(function(){
                        console.log(`In theory, I just set ${theKey}:${theValue} to embedded data. I'll believe it when I see it.`)
                        return theValue;
                    })
                };
            });
            console.log(`The "newValue" is ${newValue}. I'm sending that upstairs... we'll see what they actually receive.`);
            return newValue;
        }
    }
}

// function syncEmbeddedData(theKey, theValue) {
//     jQuery.when( getEDValue(theKey) ).then(function( edValue ) {
//         let storedEDValue = edValue;
//         console.log("storedEDValue for " + theKey + " is " + storedEDValue);
//         if (storedEDValue) {
//             console.log("The ED value for " + theKey + " already exists. It's "+storedEDValue);
//             return storedEDValue;
//         } else {
//             const newValue = Qualtrics.SurveyEngine.setEmbeddedData(theKey, theValue);
//             console.log("New ED value for " + theKey + ". It's "+theValue);
//             return newValue;
//         };
//       });
// }


// Create shorthand for katex.renderToString
// We can pass the math as a string, number, or array
const kx = function (mathToBeRendered, renderingOptions) {
    const mathForKatex = Array.isArray(mathToBeRendered) ? mathToBeRendered.join("") : mathToBeRendered.toString()
    return katex.renderToString(mathForKatex, renderingOptions);
}

// I write things like "Solve for x" a lot, so kxx is just shorthand.
const kxx = kx("x");

// The default displayMode for kx is inline {displayMode:false}.
// The line below is shorthand for displayMode:true, which makes the katex bigger, centers it, and puts it on its own line.
const kxbig = (mathToBeRendered) => kx(mathToBeRendered, { displayMode: true })


// Generate a random number between two numbers
const uRand = function (min, max, step) {
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
const countDecimals = function (value) {
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
}
