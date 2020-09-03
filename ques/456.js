fnQues456 = function (objFromMainQues) {


    let quesVars = {
        "a": 1,
        "b": uRand(6, 10, 1),
        "c": uRand(3, 20, 1),
        "d": uRand(2, 4, 1)
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
        const e = (b - d);
        const g = uRound(c * (1 / e), 5);
        const h = (c ** (1 / e)) - 1

        obj.stem = `
            Solve for ${kxx} given:
            ${kxbig([
            "(",a,
            "+x)^{"+b+"}",
            "=",
            c, "(", a, "+x)^{",d,"}"
        ])}
        `

        obj.solution = `
            ${kxbig("("+a+"+x)^{"+b+"} = "+c+"("+a+"+x)^{"+d+"}")}

            To get the variables on the same side of the equation, 
            divide each side by ${kx(["("+a+"+x)^{"+d+"}"])}
            
            [It's easiest to divide each side by the term with the smaller 
            exponent. In this case, ${kx("("+a+"+x)^{"+d+"}")} is smaller 
            than ${kx("("+a+"+x)^{"+b+"}")}.] This will leave ${c} on the 
            right side by itself.

            ${kxbig([texFrac("("+a+"+x)^{"+b+"}", "("+a+"+x)^{"+d+"}"), "=", c])}

            Because we are dividing the same term (1+x) by exponents, 
            we can simplify the problem by just subtracting the exponents.
            ${kxbig(["("+a+"+x)^{"+b+"-"+d+"}", "=", c])}

            ${kxbig("("+a+"+x)^{"+(b-d)+"}")}

            In order to isolate the (1+x) term, take the ${e}-root of 
            each side.

            ${kxbig([
                    (texRoot("1+x", e)), "=", (texRoot(c, e))])}
            
            ${kxbig("("+a+"+x)"+ "="+ g)}
            
            Lastly, subtract 1 from each side to solve for x.
            ${kxbig(["x=", (g - 1)])}

            ${kxbig(["x=", h])}

            Remember... if your calculator doesn't have a way to 
            specify taking roots other than 2 [i.e., square roots], 
            you can always raise the number to the reciprocal of the 
            exponent. In this example, taking ${kx([c, "^{", (texFrac(1,e)), "}"])}
            would give us the same solution as ${kx([texRoot(c,e)])}. 
            This is also how you would have to solve the problem if 
            using Excel.
           `
           
        return obj;
    }
}