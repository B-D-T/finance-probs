// @ts-nocheck
function fnQues477(objFromMainQues) {

    let quesVars = {
        varDiv0: uRand( 1, 2, .1), // d
        varRate: uRand( .09, .13, .01), //ret
        varG: uRand( .05, .08, .01), // rat
        varY: uRand( 8, 12, 1),
        varPV: "??"
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcMapVarsDivY: {
                "varN":varY+1,
                "varY":0,
                "varPV":varDiv0,
                "varRate":varG
            },
            get calcDivY(){return fFutureValue(this.calcMapVarsDivY) },
            get calcMapVarsTheAns(){ return {
                "varPMT": this.calcDivY,
                varRate,
                "varY":1,
                varG
            }},
            get calcTheAns(){return fPresentValue(this.calcMapVarsTheAns) }
        };
        createEDVarInScope(calcVars);
        console.log(calcTheAns);

        let displayVars = {
            dispRatePerc: uRound(varRate * 100, 4), // per
            dispRateG: uRound(varG * 100, 4), // perr
            dispDiv0: varDiv0.toFixed(2).toLocaleString('en'),
            dispDivY: calcDivY.toFixed(2),
            dispTheAns: calcTheAns.toFixed(2).toLocaleString('en')
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
                Parkway Bank just paid a dividend of \$dispDiv0 per share on its stock.
                The dividends are expected to grow at a constant rate of dispRateG% per year,
                indefinitely.
                Investors require an dispRatePerc% return on Parkway Bank's stock.
                If you were to buy the stock in year ${varY}, what would you pay?
            </p>
        `;

        obj.solution = probDisplay(quesVars)`
        <p>
            To get the price in year varY,
            you first need to know the dividend at year ${varY+1}.
            We already know the value of the dividend in year 0 (\$${dispDiv0}).
            To find dividend in year ${varY+1},
            we need to grow the dividend the appropriate number of years.
        </p>
        <p>
            This is most easily accomplished by using the FV of a single payment formula,
            as shown below.
            Be sure to note that we <b>use the growth rate</b> here (dispRateG%),
            not the rate of return.  
        </p>
        ${explainFVSinglePmt_FV(calcMapVarsDivY)}
        <p>
            We now have D<sub>${varY+1}</sub>,
            the dividend in year ${varY+1}.
            We can put that into the perpetuity formula, 
            which will give us the present value of all future payments
            one year before the first payment is made (i.e., in year ${varY}).
        </p>
            ${solvePVPerpetuityStand_PV({
                "varPMT": calcDivY,
                varRate,
                "varY":varY+1,
                varG,
                varPV:"??"
            })}
            
        This means that if it were Year varY,
        we would buy a share of Parkway Bank stock for \$${dispTheAns}
        (or less, we hope).
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