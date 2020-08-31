// user-defined-functions.js

ansBoxMessages = function (msgKeyToReturn) {
    const objAnsBoxMessages = {
        percAsDecimal: "Submit answer as a decimal. E.g., 65.4321% would be 0.654321",
        decimalPlaces2: "Include at least 2 decimal places in your answer",
        decimalPlaces4: "Include at least 4 decimal places in your answer",
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

// Create a Tex-style fraction
texFrac = (numerator, denominator) => ["\\frac{", numerator, "}{", denominator, "}"].join('')

// Create a Tex-style nth root
texRoot = (base, root) => ["\\sqrt[", root, "]{", base, "}"].join('')