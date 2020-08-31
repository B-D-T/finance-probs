fnQues459 = function (){//quesVariables, objAddlInfo) {


    let defineQuesVars = {
        "a": uRand(9,60,1),
        "b": uRand(1.001,4.999,.001),
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
    const c = uRound(ln(a), 5);
    const d = uRound(ln(b), 5);
    const ans = (ln(b))/(ln(a));
    const ansn = uRound(ln(b)/ln(a), 5)
    
    // KELSEY don't touch
    let obj = {};
    obj.ansBoxMessage = objAnsBoxMessages.decimalPlaces4;
    // end KELSEY
    
    obj.stem = `
        Solve for ${kxx} given:
        ${kxbig(a^, "x=", b)}
    `
    
    obj.solution = `
        ${kxbig(a, ^"x=", b)}

        The variable is in the exponent, so we need to bring it 
        down with the rest of the equation in order to solve for 
        it. To do this, we can use the natural log (ln). When you 
        take the natural log of each side of the equation, the 
        variable moves down and is multiplied by the rest of the term.

        ${kxbig(x(ln(a)), "=", ln(b))}

        Use the calculator to determine the natural log of the numbers.
        ${kxbig("x", *c, "=", d)}
    
        To solve for x, divide each side by the coefficient.
        ${kxbig(uFrac(("x"*c), c), "=", uFrac(d,c))}

        ${kxbig(`x = ${ans}`)}

    `
    return obj;
    
    }