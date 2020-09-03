fnQues455 = function (objFromMainQues) {


    let quesVars = {
        "a": uRand(2, 8, 1),
        "b": uRand(10, 29, 1),
        "c": uRand(30, 50, 2)
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
        const d = c - b;
        const ax = a + "x";
        const ans = ((c - b) / a);
        const ansr = uRound((c - b) / a, 5);

        obj.stem = `
        Solve for ${kxx} given:
        ${kxbig([ax, "+", b, "=", c])}
        `

        obj.solution = `
        Subtract ${b} from each side. That will leave ${kx(ax)} on the left side.
        ${kxbig([ax, "+", b, "-", b, "=", c, "-", b])}
        ${kxbig([ax, "=", d])}
            
        Divide each side by ${a} to isolate the variable.
        ${kxbig([
        texFrac(ax, a),
        "=",
        texFrac(d, a)
        ])}

        ${kxbig(`x = ${texFrac(ax, a)}`)}
        ${kxbig(`x = ${ans}`)}
        `
        return obj;
    }
}