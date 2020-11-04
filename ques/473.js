// @ts-nocheck
function fnQues473(objFromMainQues) {

    let quesVars = {
        varPMT: uRand( 12, 16, 1), // d
        varRate: uRand( .12, .16, .01), //rat
        varG: uRand( .03, .06, .01), //gro
        varY: uRand(4, 8, 1), //y+1
        varPV: "??"
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcTheAns: fPresentValue(quesVars)
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispRatePerc: uRound(varRate * 100, 4), // perr
            dispGPerc: uRound(varRate * 100, 4), // perg
            dispPMT: varPMT.toFixed(2).toLocaleString('en') //$D
        };
        createEDVarInScope(displayVars);

        jQuery.extend(quesVars, calcVars, displayVars);
        storeQuesRespVars(quesVars, calcTheAns);
        return fillPage();
    }

    function fillPage() {
        let obj = {};

        obj.ansBoxMessage = ansBoxMessages("writeOutNums");

        obj.stem = probDisplay(quesVars)`
            <p>
                Parquet Floors Inc. is a young start-up company.
                No dividends will be paid on the stock over the next ${varY-1} years because
                the firm needs to plow back its earnings to fuel growth.
                The company will pay a \$dispPMT per share dividend in year varY and
                will increase the dividend by dispGPerc% percent per year, thereafter.
                If the required return on this stock is dispRatePerc% percent,
                what is the current price?
            </p>
        `;

        obj.solution = probDisplay(quesVars)`
            ${explainPVPerpetuityConst_PV(quesVars)}
            <p>
                This means the current price for an ownership share would be about \$${calcTheAns.toFixed(2)}.
            </p>
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