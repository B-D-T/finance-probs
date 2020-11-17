function fnQues491 (objFromMainQues) {


    let quesVars = {
        "varRate": uRand(.04, .08, .005),
        "varAnn1PMT": uRand(400, 600, 10),
        "varAnn1N": uRand(4, 7, 1),
        "varAnn1Y": 1,
        "varAnn2PMT": uRand(300, 400, 10),
        "varAnn2Y": uRand(7, 10, 1),
        get varAnn2N() {return this.varAnn2Y + 3 },
        "varReturnInYear": 0,
        "varPV": "??"
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcPV0Ann1: fPresentValue({varRate, "varPMT":varAnn1PMT, "varN":varAnn1N, "varY":varAnn1Y}),
            calcPV0Ann2: fPresentValue({varRate, "varPMT":varAnn2PMT, "varN":varAnn2N, "varY":varAnn2Y}),
            get calcTheAns(){return this.calcPV0Ann1 + this.calcPV0Ann2}
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

        // const dispPMT = uRound(varPMT,4).toLocaleString('en-US');
        const dispRatePerc = uRound(varRate*100,4);

        obj.ansBoxMessage = ansBoxMessages("writeOutNums");

        obj.stem = probDisplay(quesVars)`
        <p>
            Payments from an investment are structured as follows:
        </p>
        <ul style="line-height:1.5em;">
            <li>
            A standard annuity (first payment made in year ${varAnn1Y.toString()}) that
            pays \$${varAnn1PMT} per year for ${varAnn1N} years.
            </li>
            <li>
            A delayed annuity (first payment made in year ${varAnn2Y}) that
            pays \$${varAnn2PMT} per year for ${varAnn2N} years.
            </li>
        </ul>
        <p>
        What is the present value of these payments in year ${varReturnInYear.toString()},
        assuming a rate of ${dispRatePerc}%?
        </p>
        `;

        obj.solution = probDisplay(quesVars)`
        <p>Step-by-step solution unavailable at this time.
        In short, you need to add the PV in year 0 of the first annuity (\$${calcPV0Ann1.toLocaleString()})
        and the PV in year 0 of the second annuity (\$${calcPV0Ann2.toLocaleString()}).
        Remember - for the second annuity,
        using the PV formula once gives you the value in year ${varAnn2Y-1};
        once you have that, you need to discount it again to get to year 0.</p>
        <p>
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