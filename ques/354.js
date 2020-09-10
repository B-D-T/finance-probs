fnQues354 = function (objFromMainQues) {


    let quesVars = {
        "a": uRand(10000,15000,2.1),
        "b": uRand(2,9,1),
        "c": uRand(60000,80000, 2.1)
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
        const d = c/b;
        const ans = d/a;

        // Variables formatted for display 
        const de = uRound((c/b), 5);
        const ce = uRound((de/a), 5); // functions starting with u are [probably] from the user-defined-functions.js file

        obj.stem =
            `
            Solve for ${kxx} given:
            ${kxbig([a, "=", texFrac(c, b + "x")])}
        `

        obj.solution =
            `
            ${kxbig([a, "=", texFrac(c, (b + "x"))])}

            First divide the constants ${kx([texFrac(c, b)])}
            which will simplify the fraction and leave
            an x in the denominator.
            ${kxbig(a+"="+texFrac(de, "x"))}

            Then, rewrite the original problem in fractions
            and cross multiply. Multiplying the left-side numerator
            & right-side denominator and the right-side numerator &
            left-side denominator..
            ${kxbig([texFrac(a, 1), "=", texFrac(de,"x")])}
            ${kxbig([a + "x", "=", de, "*", 1])}
            ${kxbig([a + "x", "=", de])}

            Divide each side by ${a}.
            ${kxbig([texFrac(a + "x", a), "=", texFrac(de, a)])}
            ${kxbig(texFrac(de, a))}

            ${kxbig(`x = ${ans}`)}
        `

        return obj;
    } }// end of fillPage
