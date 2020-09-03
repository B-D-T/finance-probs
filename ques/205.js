fnQues205 = function (objFromMainQues) {


    let quesVars = {
        "a": uRand(15, 20, 1),
        "b": uRand(10, 20, 1),
        "c": uRand(10, 14, 1)
    }

    // Static code
    let obj = {};
    obj.ansBoxMessage = ansBoxMessages("decimalPlaces4");
    const windowScope = this; const varPrefix = "var_q" + quesNum() + "z__";
    jQuery.each(quesVars, function (theKey, theValue) { const newKey = varPrefix + theKey; quesVars[newKey] = [theValue]; delete quesVars[theKey]; });
    if (objFromMainQues.isProduction) { return createEDVarInScope(fetchQuesVars(quesVars)) } else { return createEDVarInScope(quesVars); }
    function createEDVarInScope(objEDVars) { jQuery.each(objEDVars, function (edKey, edValue) { const origKey = edKey.replace(varPrefix, ''); quesVars[origKey] = quesVars[edKey]; delete quesVars[edKey]; windowScope[origKey] = edValue; }); return fillPage(); } function fillPage() {
        // End static code

        // Calculations
        const d = a - c;
        const ans = uthRoot(b,d);
        const ansr = uRound(b ^ (1 / d), 5);

        obj.stem = `
        Solve for ${kxx} given:
        ${kxbig(["x^{", a, "}=", b, "x^{", c,"}"])}
    `

        obj.solution = `
        To get the variables on the same side of the equation, 
        divide each side by ${kx(["x^{"+c+"}"])}, 
        which will leave ${b} on the right side by itself. 
    
        ${kxbig([
            texFrac("x^{"+a+"}", "x^{"+c+"}"),
            "=",
            texFrac(b+"x^{"+c+"}", "x^{"+c+"}")
        ])}

        ${kxbig([
            texFrac("x^{"+a+"}", "x^{"+c+"}"),
            "=",
            b
        ])}

        Because we are dividing the same term (x) by exponents, 
        we can simplify the problem by just subtracting the exponents.
       
        ${kxbig(["x^{", a, "-" ,c, "}=", b])}
        ${kxbig(["x^{", d, "}=", b])}
        
        In order to isolate x, take the ${d}-root of each side.

        ${kxbig([
            texRoot("x", d),
            "=",
            texRoot(b, d)
        ])}

        ${kxbig([
            "x",
            "=",
            ans
        ])}

        Remember... if your calculator doesn't have a way to specify taking roots other 
        than 2 [i.e., square roots], you can always raise the number to the reciprocal of 
        the exponent. In this example, taking ${kx(b+"^{"+texFrac(1,d)+"}")} would give us the 
        same solution as ${kx(texRoot(b,d))}.  This is also how you would have to solve the 
        problem if using Excel.
    `
        return obj;
    }

}