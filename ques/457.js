fnQues457 = function (){//quesVariables, objAddlInfo) {


    let defineQuesVars = {
        "a": uRand(10,19,.001),
        "b": uRand(21,29,.01),
        "c": uRand(600,750,1)
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
    const d = a-b;
    const e = c/d;
    const ans = c/(a-b)
    
    // KELSEY don't touch
    let obj = {};
    obj.ansBoxMessage = objAnsBoxMessages.decimalPlaces4;
    // end KELSEY
    
    obj.stem = `
        Solve for ${kxx} given:
        ${kxbig(a, "x-", b, "x=",c)}
    `
    
    obj.solution = `
        ${kxbig(a, "x-", b, "x=",c)}

        The same variable (x) on the left side of the equation is 
        being multiplied by two different coefficients. Therefore, 
        we can simplify the problem by subtracting the coefficients.
    
        ${kxbig((a-b), "x=", c)}
        ${kxbig(d, "x=", c)}

        To isolate x, divide each side by the coefficient (${d}).
        ${kxbig(uFrac((d, "x"), d), "=", uFrac(c,d))}

        ${kxbig(`x = ${ans}`)}

    `
    return obj;
    
    }