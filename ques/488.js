function fnQues488(objFromMainQues) {

    let quesVars = {
        varPMT: uRand(400, 600, 10),
        varRate: uRand(.06, .08, .01),
        varG: uRand(.04, .058, .001),
        varN: uRand(7, 15, 1),
        varY: 1
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcTheAns: fPVGrowingAnnuityStandard({ varRate, varN, varPMT, varG })
        };
        createEDVarInScope(calcVars);

        let displayVars = {

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
            An annuity pays \$varPMT in year varY, 
            and increases that amount by \$${uRound(varG*100,4)}% per year for varN years.
            Assuming a rate of ${uRound(varRate*100,4)}%, 
            what is the present value (value in year 0) of the annuity?
        `

        obj.solution = probDisplay(quesVars)`
        ${explainPVGrowingAnnuityStand_PV(quesVars)}
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