fnQues459 = function (objFromMainQues) {


    let quesVars = {
        "a": uRand(9, 60, 1),
        "b": uRand(1.001, 4.999, .001),
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
        const c = uRound(uLn(a), 5);
        const d = uRound(uLn(b), 5);
        const ans = (uLn(b)) / (uLn(a));
        const ansn = uRound(uLn(b) / uLn(a), 5)


        obj.stem = `
        Solve for ${kxx} given:
        ${kxbig(a + "^x=" + b)}
    `

        obj.solution = `
        ${kxbig([a, "^x=", b])}

        The variable is in the exponent, so we need to bring it 
        down with the rest of the equation in order to solve for 
        it. To do this, we can use the natural log (ln). When you 
        take the natural log of each side of the equation, the 
        variable moves down and is multiplied by the rest of the term.

        ${kxbig("x*ln("+a+")=ln("+b+")")}

        Use the calculator to determine the natural log of the numbers.
        ${kxbig("x(" + c + ")=" + d)}
    
        To solve for x, divide each side by the coefficient.
        ${kxbig([texFrac("x*"+c,c), "=", texFrac(d, c)])}

        ${kxbig(`x = ${ans}`)}

    `
        return obj;

    }
}