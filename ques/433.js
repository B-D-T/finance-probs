

function fnQues433 (objFromMainQues) {


    let quesVars = {
        "varA": uRand(2, 4, .01),
        "varB": uRand(10, 30, 1),
        "varC": uRand(20, 40, .001)
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcD: varC - varA,
            get calcTheAns() { return uLn(this.calcD) / uLn(varB) }
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispD: uRound(calcD, 5),
            dispLnB: uRound(uLn(varB), 5),
            dispLnD: uRound(uLn(calcD), 5),
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
                {varA} + {varB}^x = {varC}
            \\]
        `

        obj.solution = probDisplay(quesVars)`
        <p>
            The challenge with this problem is having a variable in the exponent.
            But, we want to do what we can to simplify the equation before dealing with that term.
        </p>
        \\[
            {varA} + {varB}^x = {varC}
        \\]
        <p>
            Subtract varA from each side. 
            That will isolate varB<sup>x</sup> on the left side.
        </p>
        \\[
            \\begin{aligned}
                varA + {varB}^x - varA &= varC - varA \\\\
                {varB}^x &= varC - varA \\\\
                {varB}^x &= dispD \\\\
            \\end{aligned}
        \\]
        <p>
            We need to get the variable out of the exponent.
            Let's bring it down with the rest of the equation by using the natural log (ln). 
            When you take the natural log of each side of the equation, 
            the variable moves down and is multiplied by the rest of the term.
        \\[
            x * ln({varB}) = ln(dispD)
        \\]
        <p>
            Use the calculator to determine the natural log of the numbers.
        </p>
        \\[
            x * dispLnB = dispLnD
        \\]
        <p>
            Finally, to solve for \\(x\\),
            divide each side by the number that's multiplying the variable (dispLnB).
        </p>
        \\[
            \\begin{aligned}
                \\frac{x*dispLnB}{dispLnB} &= \\frac{dispLnD}{dispLnB} \\\\
                {} \\\\
                x &= \\frac{dispLnD}{dispLnB} \\\\
                {} \\\\
                x &= calcTheAns
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

// The question files (like 433.js) will always call this function on click.
// Most of the time this will only be an intermediary for the sedEDQuesRespVars function,
// but I can add any custom feedback in here too, if I have any.
// I don't need to build an testing functionality because it'll never be called during testing (no clicks)
// function fnQuesResp(stuResp){
//     console.log("I'm fnQuesResp. I received this stuResp from the qtrx JS: ", stuResp);
//     const objRespFeedback = { "stuResp": stuResp }
//     return setEDQuesRespVars(objRespFeedback); 
// }