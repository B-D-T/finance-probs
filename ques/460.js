fnQues460 = function (){//quesVariables, objAddlInfo) {


    let defineQuesVars = {
        "a": uRand(2,9,1),
        "b": uRand(2,7,1),
        "c": uRand(10,40,1)
    }
    
    // KELSEY -- don't touch
        // If the variable is already in the embedded data, it uses that. Otherwise, it creates one in the embedded data based on our definition.
        // Create local variables with the same names as the keys in defineQuesVars. These are what we'll use in our code.
        jQuery.each(defineQuesVars, function(theKey, theValue){ 
            window[theKey] = theValue;  //<-- TESTING. Real one is something like syncEmbeddedData(theValue); 
            console.log("New student name is " + getEDValue("StudentNameFL"));
        });
        // end KELSEY
        
    // Calculations
    const d = c/a;
    const de = uRound(c/a, 5);
    const ans = db;
    const ans1 = uRound(db, 5)
    
    // KELSEY don't touch
    let obj = {};
    obj.ansBoxMessage = objAnsBoxMessages.decimalPlaces4;
    // end KELSEY
    
    obj.stem = `
        Solve for ${kxx} given:
        ${kxbig([a, "x^", uFrac(1, b), "=", c])}
    `
    
    obj.solution = `
        ${kxbig([a, "x^", uFrac(1, b), "=", c])}
    
        Divide each side by the coefficient (${a}) in order to leave 
        the variable on the left. 
        ${kxbig(uFrac(c, b))}

        which will simplify the fraction and leave an x in the denominator.

        ${kxbig([a, "=", uFrac(de), "x"])}

        Then, rewrite the original problem in fractions and cross multiply by 
        multiplying the left-side numerator & right-side denominator and the 
        right-side numerator and left-side denominator..

        ${kxbig([uFrac(a, 1), "=", uFrac(de, x)])}
            
        ${kxbig([a*x], "=", [de*1])}

        ${kxbig([a, "x", "=", de])}

        Divide each side by ${kxbig(a)}

        ${kxbig(uFrac((a, "x"), a), "=", uFrac(de, a))}

        ${kxbig(x, "=", uFrac(de, a))}

        ${kxbig(`x = ${ans}`)}


    `
    return obj;
    
    }