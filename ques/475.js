// @ts-nocheck
function fnQues475(objFromMainQues) {

    let quesVars = {
        varRate: uRand(.10, .16, .01), //
        varG1: uRand(.06, .09, .01), //g1
        varG2: uRand(.01, .03, .01), //g2
        varDiv1: uRand(1, 2, .1), //div in year 1
        varY1: 1, //y
        varY2: uRand(3, 6, 1), //y
        varPV: "??"
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        // For getting the value in year 0 of Part A (PV of a growing annuity)
        mapVarsPartA = {
            "varG": varG1,
            "varN": varY2 - 1,
            "varPMT": varDiv1,
            "varY": varY1,
            varPV,
            varRate
        };
        const pvPartA = fPresentValue(mapVarsPartA);

        // FV of a single payment
        mapVarsPartBDiv = {"varPV": varDiv1, "varRate":varG1, "varN":varY2-varY1 };
        const partBDiv =fFutureValue(mapVarsPartBDiv);

        // Get value in year Y2-1 of Part B (PV of a perpetuity)
        mapVarsPartBStep1 = {
            "varG": varG2,
            "varN": 0,
            "varPMT": partBDiv,
            "varY": varY2,
            varPV,
            varRate
        };
        const pvPartBStep1 = fPresentValue(mapVarsPartBStep1);
        
        // For getting the value in year 0 of Part B (PV of a single payment)
        mapVarsPartBStep2 = {
            "varN": varY2 - 1,
            "varFV": pvPartBStep1,
            varRate,
            "varY": varY2-1,
            "varPV": "??"
        };
        const pvPartB = fPresentValue(mapVarsPartBStep2);

        let calcVars = {
            calcPartA: pvPartA,
            calcPartBDiv: partBDiv,
            calcPartBStep1: pvPartBStep1,
            calcPartB: pvPartB,
            calcTheAns: pvPartA + pvPartB
        };
        createEDVarInScope(calcVars);
        console.log("calcPartA",calcPartA);

        let displayVars = {
            dispDiv1: varDiv1.toFixed(2).toLocaleString('en'),
            dispPartBDiv: partBDiv.toFixed(2),
            dispG1Perc: uRound(varG1 * 100, 4), // perg1
            dispG2Perc: uRound(varG2 * 100, 4), // perg2
            dispRatePerc: uRound(varRate * 100, 4) // perRet
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
            A publicly traded sports agency, Representing You,
            pays dividends at the end of every year,
            although the amounts change slightly over time.
            The dividend next year (at t=1) will be \$dispDiv1.
            That will grow from t<sub>1</sub> to t<sub>${varY2}</sub>
            at dispG1Perc% per year.
            Starting after t<sub>${varY2}</sub>
            (i.e., after the dividend in Year varY2 has been paid),
            the dividend will grow at dispG2Perc% per year, indefinitely.
            Assuming that the required rate of return is dispRatePerc%,
            what is the price of the stock today (at t=0)?
            </p>
        `;

        obj.solution = probDisplay(quesVars)`
            <p>
            To determine the price, we need to solve the problem using several steps.
            You can scroll down for full details,
            or click on the links here to jump to a section.
            </p>
            <div id="answeroutline" style="line-spacing:1.1em;">
                <h2>
                    Solution outline
                </h2>
                <h3 style="margin-bottom:2px;">
                    Part A: Years 1 - ${varY2-1}
                </h3>
                    <p style="margin-top:2px;">
                        PV<sub>0</sub> of initial payments
                        <a href="#partA" target="_self">(PV of a growing annuity)</a>
                    </p>
                <h3 style="margin-bottom:2px;">
                    Part B: Years ${varY2} - &#8734;
                </h3>
                    <p style="margin-top:2px;">
                        D<sub>${varY2}</sub>,
                        the dividend at Year ${varY2}
                        (<a href="#partBDividend" target="_self">FV of a single payment</a>)
                        <br />
                        PV<sub>${varY2-1}</sub> and PV<sub>0</sub> of the perpetuity
                        (<a href="#partBStep1" target="_self">PV of a perpetuity</a>)
                    </p>
                <h3 style="margin-bottom:2px;">
                    Part C: Add up the total PV
                </h3>
                <p style="margin-top:2px;">
                    <a href="#partC" target="_self">Add Parts A and B</a></p>
                </p>
            </div>

            <div id="partA">
                <h1>
                    Part A: Determine the PV of the initial ${varY2-1} dividend payments
                </h1>
                <p>
                    We start by finding PV<sub>0</sub> for the first ${varY2-1} dividend payments,
                    which are growing at dispG1Perc%.
                </p>
                ${explainPVGrowingAnnuityStand_PV(mapVarsPartA)}
            </div>

            <hr />
            <hr />
            <div id="partB">
                <h1>Part B: Determine the PV of the ongoing dividend payments</h1>
                <p>
                    Next we need to find the present value for all dividend payments
                    that occur in years ${varY2} to infinity.
                    We'll use the perpetuity formula to find the value of all those payments
                    in year ${varY2-1}, then discount that back to PV<sub>0</sub>.
                </p>
                <p>
                    The problem is that we don't know the first dividend in that
                    series of payments (D<sub>${varY2}</sub>).
                </p>
                
                <div id="partBDividend">
                    <h2>Find the dividend at Year ${varY2}</h2>
                    <p>
                        To find D<sub>${varY2}</sub>,
                        we'll start with the dividend in year 1 and
                        grow it for ${varY2} years at ${dispG1Perc}%.
                        Notice: <b>we are using the growth rate</b>,
                        not the discount rate.
                        That's because we're growing the payment;
                        it happens to be the same formula we use for compounding a single payment,
                        but be careful that you're using the correct values.
                    </p>
                    ${explainFVSinglePmt_FV(mapVarsPartBDiv)}
                </div>

                <hr />
                <div id="partBStep1">
                    <h2>Calculate PV<sub>${varY2-1}</sub> of the perpetuity</h2>
                    <p>
                        Now that we have D<sub>${varY2}</sub> (\$${dispPartBDiv}),
                        we can go back and plug values into the perpetuity formula.
                    </p>
                    ${explainPVPerpetuityConst_PV(mapVarsPartBStep1)}
                </div>
            </div>

            <hr /><hr />
            <div id="partC">
                <h1>Add Parts A and B</h1>
                <p>
                    The last step is the easiest.
                    We simply add our value from Part A
                    (PV of years ${varY1} - ${varY2-1}) and
                    Part B (PV of years ${varY2} - &#8734;).
                </p>
                \\[
                    ${calcPartA.toFixed(2)} + ${calcPartB.toFixed(2)} = ${calcTheAns.toFixed(2)}
                \\]
                <p>
                    That means we would be willing to pay \$${calcTheAns.toFixed(2)} (or less, we hope)
                    for a share of the Representing You agency.
                </p>
            </div>
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