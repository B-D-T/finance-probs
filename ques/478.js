// @ts-nocheck
function fnQues478(objFromMainQues) {

    let quesVars = {
        varPMT: uRand( 2, 3, .1), // d
        varG: uRand( .05, .08, .01), //rat
        varY: 1, //y+1
        varPV: uRand( 32, 35, .1)
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcTheAns: varPMT/varPV + varG
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispPMT: varPMT.toFixed(2),//$D
            dispGPerc: uRound(varG * 100, 4), // perr
            dispPV: varPV.toFixed(2).toLocaleString('en-US'),
            dispTheAns: uRound(calcTheAns*100,4)
        };
        createEDVarInScope(displayVars);

        jQuery.extend(quesVars, calcVars, displayVars);
        storeQuesRespVars(quesVars, calcTheAns);
        return fillPage();
    }

    function fillPage() {
        let obj = {};

        obj.ansBoxMessage = ansBoxMessages("percAsDecimal");

        obj.stem = probDisplay(quesVars)`
            <p>
            The next dividend payment by Worldwide Mixed Martial Arts, Inc
            (WMMA) will be \$${dispPMT} per share (paid in one year).
            The dividends are anticipated to maintain a dispGPerc% growth rate, forever.
            If WMMA stock currently sells for \$${dispPV} per share,
            what is the required return?            
            </p>
        `;

        const colorRightAns = `#228B22`;
        obj.solution = probDisplay(quesVars)`
            <p>
            The prompt tells us the D<sub>1</sub> is ${dispPMT}.
            We already know three of the four variables that are part of the perpetuity formula,
            so we can just plug them in to get
            the rate, \\( i \\).
            </p>
            ${solvePVPerpetuityStand_Rate(quesVars)}

            <p>
            Since we knew the current price at the outset (\$dispPV),
            we can check our answer (dispTheAns%)
            by putting it back into the perpetuity formula:
            </p>
            \\[
                \\begin{aligned}
                \\textcolor{${colorRightAns}}{${dispPV}} &{${" \u225F "}} \\frac{${dispPMT}}{${dispTheAns}-${dispGPerc}} \\\\
                {} \\\\
                \\textcolor{${colorRightAns}}{${dispPV}} &{${" \u225F "}} \\frac{${dispPMT}}{${uRound(calcTheAns-varG,4)}} \\\\
                {} \\\\
                \\textcolor{${colorRightAns}}{${dispPV}} &{=} \\textcolor{${colorRightAns}}{${(varPMT/(calcTheAns-varG)).toFixed(2)} }
                \\end{aligned}

            \\]
        `;

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