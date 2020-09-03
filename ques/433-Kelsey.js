
fnQues433 = function (){//quesVariables, objAddlInfo) {

    let defineQuesVars = {
        "a": uRand(2, 4, .01),
        "b": uRand(10, 30, 1),
        "c": uRand(20, 40, .001)
    }
    syncEmbeddedData("StudentNameFL", "Nichael Bluth");
    
    // myObj = {
    //     "key1": 123
    // }
    // myObj.key1; // 123
    // myObj[key1]; // 123

    // myObj.key2 = 456;

    // // myObj = {
    // //     "key1": 123,
    // //     "key2": 456,
    // // }

    // KELSEY -- don't touch
    // If the variable is already in the embedded data, it uses that. Otherwise, it creates one in the embedded data based on our definition.
    // Create local variables with the same names as the keys in defineQuesVars. These are what we'll use in our code.
    jQuery.each(defineQuesVars, function(theKey, theValue){ 
        window[theKey] = theValue;  //<-- TESTING. Real one is something like syncEmbeddedData(theValue); 
        console.log("New student name is " + getEDValue("StudentNameFL"));
    });
    // end KELSEY

    // Calculations
    const d = c - a;
    const lnb = uRound(uLn(b), 5); // functions starting with u are [probably] from the user-defined-functions.js file
    const lnd = uRound(uLn(d), 5);
    const ans = uLn(c - a) / uLn(b);

    const bx = b + "^x"; // this isn't necessary, but it makes the code a bit more readable because I use it a lot

    // KELSEY -- don't touch
    let obj = {};
    obj.ansBoxMessage = objAnsBoxMessages.decimalPlaces4;
    // end KELSEY

    obj.stem = `
        Solve for ${kxx} given:
        ${kxbig([a, "+", bx, "=", c])}
    `

    obj.solution = `
        Subtract ${a} from each side. 
        That will isolate ${kx(bx)} on the left side.
        ${kxbig([bx, "=", c, "-", a])}
        ${kxbig([bx, "=", d])}

        The variable is in the exponent, 
        so we need to bring it down with the rest of the equation in order to solve for it. 
        To do this, we can use the natural log (ln). 
        When you take the natural log of each side of the equation, 
        the variable moves down and is multiplied by the rest of the term.
        ${kxbig(["x*ln(", b, ")=ln(", d, ")"])}

        Now, use the calculator to determine the natural log of the numbers.
        ${kxbig(["x*", lnb, "=", lnd])}
        
        Finally, to solve for ${kxx}, divide each side by the number that's multiplying the variable (${lnb}).
        ${kxbig([
            texFrac("x*" + lnb, lnb),
            " = ",
            texFrac(lnd, lnb)
        ])}

        ${kxbig(`x = ${texFrac(lnd, lnb)}`)}
        ${kxbig(`x = ${ans}`)}
    `
    return obj;
}

// This should be set in the db, not here. But I wanted to capture it for now
const fileInfo = {
    "QuesNum": 433,
    "Subject": ["algebra"],
    "Description": "Algebra problem where unknown x is in the exponent (solve using natural log)",
    "Keywords": ["algebra", "natural log", "e", "exponents"],
    "Author": "B. David Tyler",
    "ExcelTestbankID": 433,
    "PGFileName": "alg_natural_log.pg"
}


