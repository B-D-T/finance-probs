fnQues458 = function (objFromMainQues) {


    let quesVars = {
        "a": uRand(0.1, .9, .1),
        "b": uRand(1, 5, 1),
        "c": uRand(50, 99, 1),
        "d": uRand(2, 9, 1)

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

        const e1 = 1 / d;
        const e = c * e1;
        const E = uRound(c * e1, 5);
        const e2 = e - b;
        const E2 = uRound(e - b, 5);
        const ans = e2 / a


        obj.stem = `
        Solve for ${kxx} given:
        ${kxbig(["(", a, "x+)^{"+b+"}", "=", c])}
    `

        obj.solution = `
        ${kxbig([
            "(", a, 
            "x+)^{"+b+"}", 
            "=", c])}

        In order to isolate the (${a} "x+" ${b}) term, 
        take the ${d}-root of each side.
        ${kxbig([texRoot(("("+a+"+x)^{"+d+"}"), d),
            "=", texRoot(c,d)])}

        ${kxbig([a, "x=", E2])}

        Because of the order of operations, we subtract ${b} from 
        each side to leave the coefficient & variable on the left.
        ${kxbig([a, "x=", E2])}

        To solve for x, divide each side by the coefficient (${a}).
        ${kxbig([texFrac((a + "x"), a), "=", texFrac(E2, a)])}

        ${kxbig(`x = ${ans}`)}

    `
        return obj;

    }
}