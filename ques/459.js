fnQues459 = function (objFromMainQues) {


    let quesVars = {
        "varA": uRand(9, 60, 1),
        "varB": uRand(1.001, 4.999, .001)
    }

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcTheAns: (uLn(varB)) / (uLn(varA))
        }
        createEDVarInScope(calcVars);

        let displayVars = {
            dispC: uRound(uLn(varA), 5),
            dispD: uRound(uLn(varB), 5),
            dispTheAns: uRound(calcTheAns, 5)
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
            ${varA} ^ x = ${varB}
        \\]
       `

        obj.solution = probDisplay(quesVars)`

        The variable is in the exponent, so we need to bring it 
        down with the rest of the equation in order to solve for 
        it. To do this, we can use the natural log (ln). When you 
        take the natural log of each side of the equation, the 
        variable moves down and is multiplied by the rest of the term.

        \\[
            x*ln(${varA})=ln(${varB})
        \\]

        Use the calculator to determine the natural log of the numbers.
        \\[
            x( ${dispC} )= ${dispD}
        \\]
        To solve for x, divide each side by the coefficient.
        \\[
            \\frac{x(${dispC})}{${dispC}} = \\frac{${dispD}}{${dispC}} \\\\
            {}\\\\
            x = ${calcTheAns}
        \\]
        `
        return obj;

    } // end of fillPage
}

// received from addOnPageSubmit
function fnQuesResp(objPageSubmit) {
    const qtrxDivID = "#divQues" + objPageSubmit.strQuesNum;
    if (!(jQuery(`${qtrxDivID}-response`).length)) {
        let objRespFeedback = objPageSubmit;
        return setEDQuesRespVars(objRespFeedback);
    }
}