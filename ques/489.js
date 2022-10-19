function fnQues489 (objFromMainQues) {


    let quesVars = {
        "varPMT": uRand(400, 600, 10),
        "varRate": uRand(.04, .08, .005),
        "varN": uRand(8, 16, 1),
        "varY": 0,
        "varPV": "??"
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcTheAns: fPresentValue({varPMT, varRate, varN, varY})
        };
        createEDVarInScope(calcVars);

        let displayVars = {};
        createEDVarInScope(displayVars);
        
        jQuery.extend(quesVars, calcVars, displayVars);
        storeQuesRespVars(quesVars, calcTheAns);
        return fillPage();
    }

    function fillPage() {
        let obj = {};

        obj.ansBoxMessage = ansBoxMessages("writeOutNums"); //decimalPlaces4

        obj.stem = probDisplay(quesVars)`
        What is the present value (the value in year 0) of an annuity that
        pays \$${varPMT.toLocaleString('en-US')} per year, for varN years,
        at a rate of ${uRound(varRate*100,4)}%, 
        with the first payment being made in year ${varY.toString()}?
        `

        obj.solution = probDisplay(quesVars)`
        <div>
        ${explainPVAnnuityConst_PV(quesVars)}
        </div>
        <div>
        <p style="font-size:0.8em;">
        The answer checker shown here has been weird on this one.
        It shows the correct answer,
        but even if you put the correct answer,
        it may show that your answer is wrong.
        Don't worry about that if it happens to you.
        I grade these using a separate system anyway,
        so if your answer matches the correct answer,
        it will be marked correct.
        </p>
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