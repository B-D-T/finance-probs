// @ts-nocheck
function fnQues464(objFromMainQues) {

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
            Orlando City Soccer Club is trying to move the team from the USL Pro league to Major League Soccer.
            In order to do so,
            the team's primary owner Flávio Augusto da Silva needs to raise capital
            to be able to afford the higher salaries required to attract MLS talent.
            da Silva has chosen to issue a bond with a $varFV face and
            a coupon rate of dispCouponRatePerc%.
            The bond has a life of varN years,
            annual coupons,
            and yield to maturity is dispRatePerc%.
            For what price will the bond sell today?
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