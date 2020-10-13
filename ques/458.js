fnQues458 = function (objFromMainQues) {


    let quesVars = {
        "varA": uRand(0.1, .9, .1),
        "varB": uRand(1, 5, 1),
        "varC": uRand(50, 99, 1),
        "varD": uRand(2, 9, 1)

    }

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcE: uthRoot(varC, varD),
            get calcF(){return this.calcE - varB }, 
            // e1: 1 / varD,
            // e: c * e1,
            // E: uRound(c * e1, 5),
            // e2: e - b,
            // E2: uRound(e - b, 5),
            // ans: e2 / a,

            get calcTheAns(){return this.calcF/ varA}
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispE: uRound(calcE,5),
            dispF: uRound(calcF,5)
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
            {(varAx + varB)}^{varD} = varC 
        \\]
        ${ansBoxMessages("usePositiveIfAnsCouldBePosOrNeg")}
    `

        obj.solution = probDisplay(quesVars)`
        
        <p>
        In order to isolate the (varAx + varB) term, 
        take the varD-root of each side.
        \\[
            \\begin{aligned}
            ${texRoot(`{(${varA}x + ${varB})}^{${varD}}`,varD)} &= ${texRoot(varC,varD)} \\\\
            {}\\\\
            {varA}x + varB &= dispE\\\\
            {}\\\\
            \\end{aligned}
        \\]
        <p>
            Because of the order of operations, we subtract varB from 
            each side to leave the coefficient & variable on the left.
        </p>
        <p>
            To solve for x, divide each side by the coefficient varA.
        </p>
        \\[
            \\begin{aligned}
            varAx + varB - varB &= dispE - varB \\\\
            {} \\\\
            varAx &= dispF \\\\
            {} \\\\
            \\frac{varAx}{varA} &= \\frac{dispF}{varA} \\\\
            {} \\\\
            x &= calcTheAns
            \\end{aligned}
        \\]

        `/*
            
            ${kxbig([texFrac((a + "x"), a), "=", texFrac(E2, a)])}
    
            
        \\]



        ${kxbig(`x = ${ans}`)}

    `*/
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