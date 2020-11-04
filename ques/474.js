// @ts-nocheck
function fnQues474(objFromMainQues) {

    let quesVars = {
        divYear0: uRand( 1, 2, .1), // d
        varRate: uRand( .09, .13, .01), //ret
        varG: uRand( .05, .08, .01), //rat
        get varPMT(){return this.divYear0*(1+this.varG)},
        varY: 1, //y+1
        varPV: "??"
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcTheAns: fPresentValue(quesVars)
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispDivYear0: divYear0.toFixed(2),//$D
            dispGPerc: uRound(varG * 100, 4), // perr
            dispRatePerc: uRound(varRate * 100, 4), // pere
            dispPMT: varPMT.toFixed(2).toLocaleString('en') 
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
            Red Spades Poker, a gaming company,
            just paid a dividend of \$dispDivYear0 per share on its stock.
            The dividends grow at a constant rate of dispGPerc% per year, indefinitely.
            If investors require an dispRatePerc% return on Red Spades Poker stock,
            what is the current price?
            </p>
        `;

        obj.solution = probDisplay(quesVars)`
            <h2>
                Part A: Determine the first dividend payment
            </h2>
            <p style="margin-bottom:0px;">
                To get the price of the stock in year ${varY-1},
                you first need to know the dividend at year varY.
                That's the first dividend the new owner
                would actually receive.
            </p>
            <p style="margin-top:2px; font-size:0.8em;">
                The last dividend (\$dispDivYear0) was <i>just paid</i>,
                so the new stock owner wouldn't get that payment.
            </p>
            <p>
                We already know the value of the dividend in year ${varY} (\$dispDivYear0).
                To find dividend in year varY,
                we need to grow the dividend for 1 year.
                We can do this using the FV of a single payment formula, as shown below.
                Be sure to note that we use the growth rate here (dispGPerc%),
                not the rate of return.
            </p>
            <p>
            ${solveFVSinglePmt_FV({"varN":1,"varY":0,"varPV":divYear0,"varRate":varG})}
            </p>

            <h2>
            Part B: Solve for the perpetuity
            </h2>
            ${explainPVPerpetuityConst_PV(quesVars)}
            <p>
                This means the current price for an ownership share would be about \$${calcTheAns.toFixed(2)}.
            </p>
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