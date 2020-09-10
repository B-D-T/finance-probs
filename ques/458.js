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
        const d_root_c = c**(1/d);
        const drc_round = uRound(d_root_c,5);
        const e2 = d_root_c - b;
        const E2 = uRound(d_root_c - b, 5);
        const ans = e2 / a


        obj.stem = `
        Solve for ${kxx} given:
        ${kxbig(`(${a}x+${b})^${d}=${c}`)}
    `

        obj.solution = `
        ${kxbig(`(${a}x+${b})^${d}=${c}`)}

        In order to isolate the ${kx(`(${a} x+ ${b})`)} term, 
        take the ${d}-root of each side.
        ${kxbig([
            texRoot(`(${a}x+${b})^${d}`, d),
            "=",
            texRoot(c,d)
        ])}

        ${kxbig(`${a}x+${b}=${drc_round}`)}

        Because of the order of operations, we subtract ${b} from 
        each side to leave the coefficient & variable on the left.
        ${kxbig(`${a}x+${b} -${b}=${drc_round}-${b}`)}
        ${kxbig([a, "x=", E2])}

        To solve for x, divide each side by the coefficient (${a}).
        ${kxbig([texFrac((a + "x"), a), "=", texFrac(E2, a)])}

        ${kxbig(`x = ${ans}`)}

    `
        return obj;

    }
}