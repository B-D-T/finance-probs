fnQues433 = function (objFromMainQues) {

    let quesVars = {
        "a": uRand(2, 4, .01),
        "b": uRand(10, 30, 1),
        "c": uRand(20, 40, .001)
    }

    // Static code
    let obj = {};
    obj.ansBoxMessage = objAnsBoxMessages.decimalPlaces4;
    const windowScope = this;
    if (objFromMainQues.isProduction) { return createEDVarInScope(fetchQuesVars(quesVars)) } else { return createEDVarInScope(quesVars); }
    function createEDVarInScope(objEDVars) { jQuery.each(objEDVars, function (edKey, edValue) { windowScope[edKey] = edValue; }); return fillPage(); }
    function fillPage() {
    // End static code

        // Calculations
        const d = c - a;
        const ans = uLn(c - a) / uLn(b);

        // Variables formatted for display 
        const d_round = uRound(d, 5);
        const lnb = uRound(uLn(b), 5); // functions starting with u are [probably] from the user-defined-functions.js file
        const lnd = uRound(uLn(d), 5);
        const bx = b + "^x";

        obj.stem =
            `
            Solve for ${kxx} given:
            ${kxbig([a, "+", bx, "=", c])}
        `

        obj.solution =
            `
            Subtract ${a} from each side. 
            That will isolate ${kx(bx)} on the left side.
            ${kxbig([bx, "=", c, "-", a])}
            ${kxbig([bx, "=", d_round])}

            The variable is in the exponent, 
            so we need to bring it down with the rest of the equation in order to solve for it. 
            To do this, we can use the natural log (ln). 
            When you take the natural log of each side of the equation, 
            the variable moves down and is multiplied by the rest of the term.
            ${kxbig(["x*ln(", b, ")=ln(", d_round, ")"])}

            Now, use the calculator to determine the natural log of the numbers.
            ${kxbig(["x*", lnb, "=", lnd])}
            
            Finally, to solve for ${kxx}, divide each side by the number that's multiplying the variable (${lnb}).
            ${kxbig([
                texFrac("x*" + lnb, lnb),
                " = ",
                texFrac(lnd, lnb)
            ])}

            ${kxbig(`x = ${texFrac(lnd, lnb)}`)}
            ${kxbig(`x = ${ans}`)}
        `

        return obj;
    } // end of fillPage


    // This should be set in the db, not here. But I wanted to capture it for now
    const fileInfo = {
        "QuesNum": 433,
        "Subject": ["algebra"],
        "Description": "Algebra problem where unknown x is in the exponent (solve using natural log)",
        "Keywords": ["algebra", "natural log", "e", "exponents"],
        "Author": "B. David Tyler",
        "ExcelTestbankID": 433,
        "PGFileName": "alg_natural_log.pg"
    }
}
