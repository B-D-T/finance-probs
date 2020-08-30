fnQues205 = function (){//quesVariables, objAddlInfo) {


    let defineQuesVars = {
        "a": uRand(15,20,1),
        "b": uRand(10,20,1),
        "c": uRand(10,14,1)
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
    const d = a-c;
    const ax = a+"x";
    const ans = (b^(1/d));
    const ansr = uRound(b^(1/d), 5);
    
    // KELSEY don't touch
    let obj = {};
    obj.ansBoxMessage = objAnsBoxMessages.decimalPlaces4;
    // end KELSEY
    
    obj.stem = `
        Solve for ${kxx} given:
        ${kxbig(["x^", a, "=", b, "(x^", c,")"])}
    `
    
    obj.solution = `
        To get the variables on the same side of the equation, 
        divide each side by ${kx(["x^", c])}, 
        which will leave ${b} on the right side by itself. 
    
        ${kxbig([
            uFrac("x^" + a, "x^" + c), 
             "=",
            uFrac(b + "x^" + c, "x^" + c)
        ])}

        ${kxbig([
            uFrac("x^" + a, "x^" + c),
            "=",
            uFrac(b)
        ])}

        Because we are dividing the same term (x) by exponents, 
        we can simplify the problem by just subtracting the exponents.
       
        ${kxbig(["x^", (a-c), "=", b])}
        ${kxbig(["x^", d, "=", b])}
        
        In order to isolate x, take the ${d} root of each side.

        ${kxbig([
            `\sqrt[${d}]{x^${d}}`, 
            "=", 
            `^${d}\sqrt{${b}}`
        ])}

        ${kxbig([
            "x", 
            "=", 
            "^" + d + "\sqrt(" + b + ")"
        ])}

        ${kxbig(`x = ${ans}`)}
    `
    return obj;
    
    }