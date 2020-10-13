function fnQues490 (objFromMainQues) {


    let quesVars = {
        "varPMT": uRand(400, 600, 10),
        "varRate": uRand(.04, .08, .005),
        "varN": uRand(3, 10, 1),
        "varReturnInYear": 0,
        get varY() {return uRand(11, this.varN + 9, 1) },
        "varPV": "??"
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcTheAns: fPresentValue(quesVars)
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

        const dispPMT = uRound(varPMT,4).toLocaleString('en');
        const dispRatePerc = uRound(varRate*100,4);

        obj.ansBoxMessage = ansBoxMessages("writeOutNums");
        
        obj.stem = probDisplay(quesVars)`
        <p>
        What is the value in year ${varReturnInYear.toString()} of an annuity
        that pays \$${dispPMT} per year,
        for ${varN} years, at a rate of ${dispRatePerc}%, 
        with the first payment being made in year ${varY.toString()}?
        </p>
        `;

        obj.solution = probDisplay(quesVars)`
        Step-by-step solution unavailable at this time.
        The correct answer is \$${calcTheAns.toLocaleString('en')}.`;
    //    ${explainPVAnnuityConst_PV(quesVars)}
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