
function fnQues460(objFromMainQues) {

    let quesVars = {
        "varA": uRand(2, 9, 1),
        "varB": uRand(2, 7, 1),
        "varC": uRand(10, 40, 1)
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            "calcD": varC/ varA,
            get calcTheAns() { return this.calcD ** varB }
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            "dispD": uRound(calcD, 5)
        };
        createEDVarInScope(displayVars);
        
        jQuery.extend(quesVars, calcVars, displayVars);
        storeQuesRespVars(quesVars, calcTheAns);
        return fillPage();
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
                    \\frac{
                        {varA}x ^ { 
                            \\frac{1}{varB}
                        }
                    }{varA} &= \\frac{varC}{varA} \\\\
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
                When you raise an exponent to an exponent, you multiply the exponents.
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
                    x^{\\frac{varB}{varB}} &= ${calcTheAns}
                    {} \\\\
                    x &= ${calcTheAns}
                \\end{aligned}
            \\]
            `

            return obj;

        } // end of fillPage
    }
    
     // received from addOnPageSubmit
    function fnQuesResp(objPageSubmit){
        const qtrxDivID = "#divQues" + objPageSubmit.strQuesNum;
        if (!(jQuery(`${qtrxDivID}-response`).length)){
            let objRespFeedback = objPageSubmit;
            return setEDQuesRespVars(objRespFeedback);
        }
    }