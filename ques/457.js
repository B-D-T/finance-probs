fnQues457 = function (objFromMainQues) {


    let quesVars = {
        "varA": uRand(10,19,.001),
        "varB": uRand(21,29,.01),
        "varC": uRand(600,750,1)
    }

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcD: varA - varB,
            calcTheAns: varC/(varA - varB)
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispD: uRound(calcD, 5)
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
            varAx-varBx=varC
        \\]
        
    `

        obj.solution = probDisplay(quesVars)`
        <p>
        The same variable (x) on the left side of the equation is 
        being multiplied by two different coefficients. Therefore, 
        we can simplify the problem by subtracting the coefficients.
        </p>
        <p>
        Then, to isolate x, divide each side by the coefficient (${dispD}). 
        </p>
        \\[
            \\begin{aligned}
                (varA-varB)x &= varC \\\\
                {} \\\\
                dispDx &= varC \\\\
                {} \\\\
                \\frac{dispDx}{dispD} &= \\frac{varC}{dispD} \\\\
                {} \\\\
                x &= calcTheAns
            \\end{aligned}
        \\]
        `;
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