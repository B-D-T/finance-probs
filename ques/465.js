// @ts-nocheck
function fnQues465(objFromMainQues) {

    let quesVars = {
        varFV: uRand(500, 1000, 10), // parvalue
        varN: uRand(15, 25, 1), // numofperiods
        varRate: uRand(.08, .25, .05), //discountrate
        varCouponRate: uRand(.15, .20, .05), //couponpmt
        varY: 1,
        varPV: "??",
        questextIncludesCouponRate: true,
        questextIncludesCouponPMT: false,
        get varPMT() {return this.varCouponRate * this.varFV} //coupon payments
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
            dispCouponRatePerc: uRound(varCouponRate * 100, 4), //couponrateInteger
            dispPMT: uRound(varPMT,2).toLocaleString('en'),
            dispFV: uRound(varFV,2).toLocaleString('en')
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
                Liverpool F.C. of the English Premier League is looking to expand its stadium, Anfield.
                The team is going to secure the financing by issuing bonds to the market.
                The bonds are expected to carry a dispCouponRatePerc% annual coupon,
                have a \$dispFV face value,
                and mature in varN years.
                Bonds of equivalent risk yield dispRatePerc%.
                What is the market value of Liverpool F.C. bonds? 
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