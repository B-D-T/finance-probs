fnQues205 = function (objFromMainQues) {
    const windowScope = this; // global var (global to this function anyway)


    let quesVars = {
        "varA": uRand(15, 20, 1),
        "varB": uRand(10, 20, 1),
        "varC": uRand(10, 14, 1)
    };

    quesVars = addPrefix(quesVars, quesNum(true));
    if (objFromMainQues.isProduction) {return buildPage(fetchQuesVars(quesVars))} else {return buildPage(quesVars);}

    function buildPage(objQuesVars) { quesVars = objQuesVars; createEDVarInScope(quesVars, windowScope);

        let calcVars = {
            calcD: varA - varC,
            get calcTheAns() {return uthRoot(varB, this.calcD) }
        };
        createEDVarInScope(calcVars, windowScope);

        let displayVars = {
            dispTheAns: uRound(varB ** (1 / calcD), 5)
        };
        createEDVarInScope(displayVars, windowScope); jQuery.extend(quesVars, calcVars, displayVars); return fillPage();
    }

    function fillPage() {
        let obj = {};
        
        obj.ansBoxMessage = ansBoxMessages("decimalPlaces4");

        obj.stem = probDisplay(quesVars)`
            Solve for \\(x\\) given:
            \\[
                x^{varA} = {varB}x^{varC}
            \\]
        `

        obj.solution = probDisplay(quesVars)`
        <p>
            To get the variables on the same side of the equation,
            divide each side by x<sup>varC</sup>, 
            which will leave varB on the right side by itself.
        </p>
        \\[
            \\begin{aligned}
                \\frac{x^{varA}}{x^{varC}} &= \\frac{{varB}x^{varC}}{x^{varC}} \\\\
                {} \\\\
                \\frac{x^{varA}}{x^{varC}} &= {varB}
            \\end{aligned}
        \\]
        <p>
            Because we are dividing by the same term (\\(x\\)) with exponents,
            we can simplify the problem by just subtracting the exponents.
        </p>
        \\[
            \\begin{aligned}
                x^{{varA}-{varC}} &= {varB} \\\\
                {} \\\\
                x^{calcD} &= {varB}
            \\end{aligned}
        \\]
        <p>
            In order to isolate x, take the calcD-root of each side.
            \\[
                \\begin{aligned}
                    ${texRoot("x", calcD)} &= ${texRoot(varB, calcD)} \\\\
                    {} \\\\
                    x &= calcTheAns
                \\end{aligned}
            \\]
        </p>
        <p>
            Remember... if your calculator doesn't have a way to specify taking roots other
            than 2 [i.e., square roots], you can always raise the number to the reciprocal of
            the exponent. In this example, taking \\(varB^{\\frac{1}{calcD}} \\) would give us the
            same solution as \\(${texRoot(varB, calcD)}\\). This is also how you would have to solve the
            problem if using Excel.
        </p>
        `
        return obj;

    } // end of fillPage
}