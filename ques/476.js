// @ts-nocheck
function fnQues476(objFromMainQues) {

    let quesVars = {
        varPV: uRand(32, 38, .1), // d
        varRate: uRand(.10, .14, .1), //ret
        varG: uRand( .05, .08, .01),
        varY: 1,
        varPMT: "??"
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcDiv1: varPV * (varRate-varG),
            get calcTheAns(){return this.calcDiv1/(1 + varG)}
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispRatePerc: uRound(varRate * 100, 4), // pere
            dispRateG: uRound(varG * 100, 4), // perr
            dispPV: varPV.toFixed(2).toLocaleString('en')
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
                The stock for skateboarding apparel company Sk8rboi Corporation
                currently sells for \$dispPV per share.
                The market requires a dispRatePerc% return on the firm's stock.
                If the company maintains a constant dispRateG% growth rate in dividends,
                what was the most recent dividend per share paid on the stock?
            </p>
        `;

        obj.solution = probDisplay(quesVars)`
        <p>
            The problem asks for the <i>most recent dividend paid</i>,
            which means the dividend in Year 0 (D<sub>0</sub>).
            But, to get the dividend in year 0,
            we first need to know the dividend at year 1.
            We already know three of the four variables that are part of the perpetuity formula,
            so we can just plug them in to get
            the dividend payment in year 1 
            (written generically as C<sub>1</sub>).
        </p>
            ${solvePVPerpetuityStand_PMT(quesVars)};
        <p>
            We now have the dividend in year 1 (\$${calcDiv1.toFixed(2)}),
            and we know that the dividend grows at ${dispRateG}% per year.
            Therefore, to get D<sub>0</sub>,
            we need to bring the dividend back one year.
        </p>
        <p>
            We can use the present value of a single payment formula to do this,
            but notice that we use the growth rate (${dispRateG}%),
            not the discount rate.
            This is because the dividends' growth is independent of the specific discount rate;
            whether the market requires 10% or 20%,
            the dividends are still only going to grow at ${dispRateG}% per year.
        </p>
            ${solvePVSinglePmt_PV({"varFV":calcDiv1,"varN":1, "varY":1, "varRate":varG})}
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