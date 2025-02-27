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
        const strStyleAnnA = 'background-color:#CE960E; color:black; padding-left:1px;padding-right:1px;';
        const strStyleAnnB = 'background-color:#FE6EA8; color:black; padding-left:1px;padding-right:1px;';
        const strAddBackTogether = 'background-color:black; color:white; padding-left:1px;padding-right:1px;';

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

        obj.solution = probDisplay(quesVars)`<div>
        <p>
            We have a
            <span style="${strStyleAnnA}">standard annuity</span>
            and a
            <span style="${strStyleAnnB}">delayed annuity</span>.
            We need to find the value of each in year 0,
            then add them together to get the total value of the investment.
        </p>
        </div>

        <h2 style="${strStyleAnnA}">
            Annuity A
        </h2>
        <div>
            ${explainPVAnnuityConst_PV({
                "varPMT": varAnn1PMT,
                "varN": varAnn1N,
                "varY": varAnn1Y,
                "varRate": varRate
            })}
        </div>
        
        <h2 style="${strStyleAnnB}">
            Annuity B
        </h2>
        <div>
            ${explainPVAnnuityConst_PV({
                "varPMT": varAnn2PMT,
                "varN": varAnn2N,
                "varY": varAnn2Y,
                "varRate": varRate
            })}
        </div>

        <div>
            <h2 style="${strAddBackTogether}">
                Add PV<sub>A</sub> and PV<sub>B</sub>
            </h2>
            <p>
                Now that we know the PV of the
                <span style="${strStyleAnnA}">standard annuity</span>
                and the PV of the
                <span style="${strStyleAnnB}">delayed annuity</span> in Year 0,
                we can just add those two values together
                to determine the total present value of the investment.
            </p>
            <p>
                \\[
                    \\begin{aligned}
                        ${calcPV0Ann1} \\\\
                        + ${calcPV0Ann2} \\\\
                        = ${calcTheAns}
                    \\end{aligned}
                \\]
            </p>
            <p>
                Thus, the price of the investment is <b>\$${calcTheAns.toFixed(2).toLocaleString('en-US')}</b>.
                If anyone pays more than that in today's dollars,
                they will not break even on their investment due to the
                discounting effect over time (assuming i=${dispRatePerc}%).
            </p>
        </div>
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