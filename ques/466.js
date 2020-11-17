// @ts-nocheck
function fnQues466(objFromMainQues) {

    let quesVars = {
        varFV: uRand(500, 1000, 10), // parvalue
        varPMT: uRand(25, 75, 1), // couponpmt
        varN: uRand(5, 10, 1), // numofperiods
        varRate: uRand(.08, .25, .1), //discountrate
        varY: 1,
        varPV: "??",
        questextIncludesCouponRate: false,
        questextIncludesCouponPMT: true,
        strStateForQuesText: "Massachusetts"
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcPVCoupons: fPresentValue({varPMT, varRate, varN, varY}), // g2
            calcPVPar:  fPresentValue({varFV, varRate, varN, varY}), // g3
            get calcTheAns() { return this.calcPVCoupons + this.calcPVPar }
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispRatePerc: uRound(varRate * 100, 4), //discountrateInteger
            dispPMT: uRound(varPMT,2).toLocaleString('en-US'),
            dispFV: uRound(varFV,2).toLocaleString('en-US')
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
                You are interested in investing money into fixed income investment vehicle
                and you are an avid sports fan.
                Your broker tells you that there is a bond from the
                National Football League's Atlanta Falcons on the secondary market and
                gives you the details.
                What would you pay for the bond,
                which pays an annual coupon of \$dispPMT,
                has a face value of \$dispFV dollars,
                matures in varN years,
                and has a yield to maturity of dispRatePerc%? 
            </p>
        `;

        obj.solution = probDisplay(quesVars)`${explainPVBondLevelAnnual_PV(quesVars)}`;

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