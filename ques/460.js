fnQues460 = function (objFromMainQues) {

    let quesVars = {
        "a": uRand(2, 9, 1),
        "b": uRand(2, 7, 1),
        "c": uRand(10, 40, 1)
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
        const d = c / a;
        const d_round = uRound(c / a, 5);
        const ans = d**b;
        const ansr = uRound(d**b, 5)

        obj.stem = `
        Solve for ${kxx} given:
        ${kxbig([a, "x^", texFrac(1, b), "=", c])}
        `;

        obj.solution = `
            ${kxbig([a, "x^", texFrac(1, b), "=", c])}

            Divide each side by the coefficient (${a}) in order to leave 
            the variable on the left. 
            ${kxbig(`${texFrac(`${a}x^${texFrac(1, b)}`, a)}=${texFrac(c, a)}`)}
            
            ${kxbig(
                [
                    "x^", texFrac(1, b),
                    "=",
                    d_round
                ])
            }

            To isolate x without an exponent, we need to take the ${kx(texFrac(1, b))}
            -root of each side. Or, to put it another way, we can raise each side by
            the reciprocal of the exponent, which in this case is 
            ${kx(texFrac(b, 1))}. The exponents on the left side reduce
            to 1, leaving x by itself.

            ${kxbig(
                [
                    "(x^", texFrac(1, b), ")", "^", texFrac(b, 1), 
                    "=",
                    "(", d_round, ")^", texFrac(b, 1)
                ])
            }
    
            ${kxbig([
                "x^", texFrac(b, b),
                "=",
                d_round, "^", b])
            }

            ${kxbig( [ "x^1=", d_round, "^", b ]) }
            
            ${kxbig(`x = ${ans}`)}
        `;

        return obj;

    }
}