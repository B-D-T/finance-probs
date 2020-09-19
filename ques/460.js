fnQues460 = function (objFromMainQues) {
    const windowScope = this; // global var

    let quesVars = {
        "varA": uRand(2, 4, .01),
        "varB": uRand(10, 30, 1),
        "varC": uRand(20, 40, .001)
    };

    quesVars = addPrefix(quesVars, quesNum(true));
    if (objFromMainQues.isProduction) {return buildPage(fetchQuesVars(quesVars))} else {return buildPage(quesVars);}

    function buildPage(objQuesVars) { quesVars = objQuesVars; createEDVarInScope(quesVars, windowScope);

        let calcVars = {
            "calcD": varC - varA,
            get calcTheAns() { return uLn(this.calcD) / uLn(varB) }
        };
        createEDVarInScope(calcVars, windowScope);

        let displayVars = {
            "dispD": uRound(calcD, 5),
            "dispLNvarB": uRound(uLn(varB), 5),
            "dispLNvarD": uRound(uLn(calcD), 5),
            "dispTheAns": uRound(calcTheAns, 5)
        };
        createEDVarInScope(displayVars, windowScope); jQuery.extend(quesVars, calcVars, displayVars); return fillPage();
    }

    function fillPage() {
        let obj = {};
        
        obj.ansBoxMessage = ansBoxMessages("decimalPlaces4");

        obj.stem = probDisplay(quesVars)`
            Solve for \\(x\\) given:
            \\[
                {varA}x ^{\\frac{1}{varB}} = varC
            \\]
        `

        obj.solution = probDisplay(quesVars)`
            <p>
                This problem presents a variable raised to a fractional exponent.
            </p>
            \\[
                {varA}x ^{\\frac{1}{varB}} = varC
            \\]

            <p>
                Divide each side by the coefficient (varA) in order to leave the variable on the left.
            </p>
            \\[
                \\begin{aligned}
                    \\frac{ {varA}x ^{\\frac{1}{varB}} }{varA} &= \\frac{varC}{varA} \\\\
                    {} \\\\
                    x^{\\frac{1}{varB}} &= {dispD}
                \\end{aligned}
            \\]
            <p>
                To isolate x without an exponent, we need to take the <sup>1</sup>/<sub>varB</sub>-root of each side.
                Or, to put it another way, we can raise each side by the reciprocal of the exponent,
                which is this case is <sup>varB</sup>/<sub>1</sub>.
            </p>
            <p>
                When you raise and exponent to an exponent, you multiply the exponents.
                Our exponents are both fractions, so we multiply the numerators by each other (1 * varB)
                and the denominators by each other (varB * 1).
                That leaves <sup>varB</sup>/<sub>varB</sub> on the left side,
                which reduces to 1 and isolates x by itself. 
            </p>
            \\[
                \\begin{aligned}
                    {(x^{\\frac{1}{varB}})}^{\\frac{varB}{1}} &= {({dispD})}^{\\frac{varB}{1}}
                    {} \\\\
                    x^{\\frac{1}{varB}}*^{\\frac{varB}{1}} &= {dispD}^{varB}
                    {} \\\\
                    x^{\\frac{varB}{varB}} &= dispTheAns
                    {} \\\\
                    x &= calcTheAns
                \\end{aligned}
            \\]
            `

        return obj;

    } // end of fillPage
}