fnQues461 = function (objFromMainQues) {


    let quesVars = {
        "a": uRand(2,8,1),
        "b": uRand(1,1.8,.001),
        "c": uRand(20,60,1),
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
        const d = uLn(a);
        const d2 = uRound(uLn(a), 5);
        const e = uLn(c);
        const ans = (e/d)-b;

        // Display
        const e_round = uRound(e, 5);
        const d_round = uRound(d, 5);
        const e2 = uRound(uLn(c), 5);
        const f = uRound((e2/d2), 5);
        const ansr = uRound(ans, 5);

        obj.stem = `
        Solve for ${kxx} given:
        ${kxbig(`${a}^{(x+${b})}=${c}`)}
    `

        obj.solution = `
        ${kxbig(`${a}^{(x+${b})}=${c}`)}<br />
        The variable is in the exponent, so we need to bring it down 
        with the rest of the equation in order to solve for it. 
        To do this, we can use the natural log (ln). When you take 
        the natural log of each side of the equation, the exponent 
        term (x+${b}) moves down and is multiplied by the natural log of ${a}.
        ${kxbig(`(x+${b})*ln(${d_round})=ln(${e_round})`)}
        ${kxbig(`(x+${b})*${d2}=${e2}`)}

        Keeping order of operations in mind, we divide each side by 
        the coefficient (${d2}), which will leave just x+${b} on the 
        left.
        ${kxbig([
            texFrac(
                (
                    "(x+" + b,")", "*", d2), d2),
            "=",
            texFrac(e2, d2)
        ])}

        ${kxbig(["x+", b, "=", f])}

        To solve for x, we subtract ${b} from each side.
        ${kxbig(["x+", b, "-", b, "=", f, "-", b])}

        ${kxbig(["x + 0=", ansr])}

        ${kxbig(`x = ${ans}`)}
    `
        return obj;
    }

}