fnQues454 = function (objFromMainQues) {


    let quesVars = {
        "a": uRand(2, 9, 1),
        "b": uRand(2, 10, 1),
    }

    // Static code
    let obj = {};
    obj.ansBoxMessage = ansBoxMessages("decimalPlaces4");
    const windowScope = this; const varPrefix = "var_q" + quesNum() + "z__";
    jQuery.each(quesVars, function(theKey, theValue){const newKey = varPrefix + theKey; quesVars[newKey] = [theValue]; delete quesVars[theKey]; });
    if (objFromMainQues.isProduction) { return createEDVarInScope(fetchQuesVars(quesVars)) } else { return createEDVarInScope(quesVars); }
    function createEDVarInScope(objEDVars) { jQuery.each(objEDVars, function (edKey, edValue) { const origKey = edKey.replace(varPrefix, ''); quesVars[origKey]= quesVars[edKey]; delete quesVars[edKey]; windowScope[origKey] = edValue; }); return fillPage(); } function fillPage() {
    // End static code

        // Calculations
        const ans = Math.sqrt(b / a);
        const ansr = uRound(Math.sqrt(b / a), 5);


        obj.stem = `
        Solve for ${kxx} given:
        ${kxbig([a, "x=", texFrac(b, "x")])}
    `

        obj.solution = `
        There are a few approaches you can use to solve this problem.  
        We'll look at two possible ways.<br>
        <br>
        <b>Approach A</b><br>
        First, we have to get the x variable out of the denominator. 
        To do this, multiply each side by the reciprocal of the term 
        on the right.
    
        ${kxbig([
            texFrac(a + "x", 1), "*", texFrac("x", b),
            "=",
            texFrac(b, "x"), "*", texFrac("x", b)
        ])}

        ${kxbig([
            texFrac(a + "x^2", b),
            "=",
            (texFrac(b + "x", b + "x"))
        ])}

        ${kxbig([
            texFrac(a + "x^2", b),
            "=",
            1
        ])}
            
        By rewriting the left side, we can separate the variable 
        from the number.

        ${kxbig([
            texFrac(a, b), "*", texFrac("x^2", 1),
            "=",
            1
        ])}

        Then, multiply each side by the reciprocal.

        ${kxbig([
            texFrac(b, a), "*", texFrac(a, b) + "*x^2",
            "=",
            "1*" + texFrac(b, a)
        ])}

        ${kxbig([
            "x^2=",
            texFrac(b, a)
        ])}

        Finally, take the square root of each side to figure out x.
    
        ${kxbig([
            texRoot("x^2",2),
            "=",
            texRoot(texFrac(b, a),2)
        ])}

        ${kxbig(`x = ${ans}`)}
        
        <b>Approach B</b><br>
        A faster way to solve this problem is to cross multiply in 
        the first step. To see how this works, it helps to write the 
        original problem in fractions.

        ${kxbig([
            texFrac(a + "x", 1),
            "=",
            texFrac(b, "x")
        ])}

        Cross multiply by mutiplying the left-side numerator & 
        right-side denominator and the right-side numerator & left-side 
        denominator.

        ${kxbig([a , "x*x = ", b , "*1" ])}

        ${kxbig([a, "x^2=", b])}

        Separate the variable from the number by dividing each side by ${a}.
        ${kxbig([
            texFrac(a + "x^2", a),
            "=",
            texFrac(b, a)
        ])}

        ${kxbig([
            "x^2=", texFrac(b, a)
        ])}

        Finally, take the square root of each side to figure out x.
        ${kxbig([
            texRoot("x^2",2), "=", texRoot(texFrac(b, a),2)
        ])}
        
        ${kxbig(`x = ${ans}`)}
        
        `

        return obj;

    }
}