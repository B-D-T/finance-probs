fnQues458 = function (){//quesVariables, objAddlInfo) {


    let defineQuesVars = {
        "a": uRand(0.1,.9,.1),
        "b": uRand(1,5,1),
        "c": uRand(50,99,1),
        "d": uRand(2,9,1)
        
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
    
    const e1 = 1/d;
    const e = c*e1;
    const E = uRound(c*e1, 5);
    const e2 = e-b;
    const E2 = uRound(e-b, 5);
    const ans = e2/a
    
    // KELSEY don't touch
    let obj = {};
    obj.ansBoxMessage = objAnsBoxMessages.decimalPlaces4;
    // end KELSEY
    
    obj.stem = `
        Solve for ${kxx} given:
        ${kxbig([a, "x+", b, ^d, "=", c])}
    `
    
    obj.solution = `
        ${kxbig(a, "x+", b, ^d, "=", c)}

        In order to isolate the (${a} "x+" ${b}) term, 
        take the ${d}-root of each side.
        ${kxbig(^d(sqrt(a, "x+", b)^d), 
        "=", 
        ^d(sqrt(c)))}

        ${kxbig(a, "x=", E2)}

        Because of the order of operations, we subtract ${b} from 
        each side to leave the coefficient & variable on the left.
        ${kxbig(a, "x=", E2)}

        To solve for x, divide each side by the coefficient (${a}).
        ${kxbig(uFrac((a, "x"), a), "=", uFrac(E2, a))}

        ${kxbig(`x = ${ans}`)}

    `
    return obj;
    
    }