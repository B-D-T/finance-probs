fnQues457 = function (objFromMainQues) {


    let quesVars = {
        "a": uRand(10,19,.001),
        "b": uRand(21,29,.01),
        "c": uRand(600,750,1)
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
        const d = a - b;
        const ans = c / (a - b)

        // Display vars
        const d_round = uRound(d,5);

        obj.stem = `
        Solve for ${kxx} given:
        ${kxbig([a, "x-", b, "x=", c])}
    `

        obj.solution = `
        ${kxbig([a, "x-", b, "x=", c])}

        The same variable (x) on the left side of the equation is 
        being multiplied by two different coefficients. Therefore, 
        we can simplify the problem by subtracting the coefficients.
    
        ${kxbig(`(${a} - ${b})x=${c}`)}
        
        ${kxbig([d_round, "x=", c])}

        To isolate x, divide each side by the coefficient (${d_round}). 
        ${kxbig([texFrac(d_round+"x", d_round), "=", texFrac(c, d_round)])}

        ${kxbig(`x = ${ans}`)}

    `
        return obj;

    }
}