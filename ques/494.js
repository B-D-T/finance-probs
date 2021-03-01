function fnQues494 (objFromMainQues) {


    let quesVars = {
        "varPMT": uRand(400, 600, 10),
        "varRate": uRand(.04, .08, .005),
        "varN": uRand(25, 30, 1),
        "varY": uRand(11, 15, 1),
        "varPV": "??",
        "varReturnInYear": uRand(7, 9, 1)
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcPVOfAnn: fPresentValue({varPMT, varRate, varN}),
            get calcTheAns(){return fPresentValue({varRate, "varN":(varY-1-varReturnInYear), "varFV":this.calcPVOfAnn}) }
            // FIX THIS!!! RETURNING PV0
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

        const dispPMT = uRound(varPMT,4).toLocaleString('en-US');
        const dispRatePerc = uRound(varRate*100,4);

        obj.ansBoxMessage = ansBoxMessages("writeOutNums");

        obj.stem = probDisplay(quesVars)`
        <p>
        What is the value in year ${varReturnInYear.toString()} of an annuity
        that pays \$${dispPMT} per year,
        for ${varN} years, at a rate of ${dispRatePerc}%, 
        with the first payment being made in year ${varY.toString()}?
        </p>
        <p>
            Notice that this is asking for the <b>value in
            year ${varReturnInYear.toString()}</b>, not year 0.
        </p>
        `;

        obj.solution = probDisplay(quesVars)`
        <p>Step-by-step solution unavailable at this time.
        In short, you want to use the PV of a constant annuity to 
        determine the PV of the annuity payments in year ${varY-1}
        (\$${calcPVOfAnn.toLocaleString()}).
        </p>
        <p>
        Then, treat that as a single payment and 
        discount it back ${varY-1-varReturnInYear} years to get to year ${varReturnInYear}.
        The correct answer is \$${calcTheAns.toLocaleString('en-US')}.</p>`;
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