function fnQues499(objFromMainQues) {
    
    let quesVars = {
        varFVa: uRand(6000,10000,1000),
        varFVb: uRand(4000000,5000000,1000000),
        varRate: uRand(.20, .25, .01),
        varNa: uRand(3,6,1),
        varNb: uRand(35, 50, 1)
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcAnsA: varFVa * (1 /((1+varRate)**varNa)),
            calcAnsB: varFVb * (1 /((1+varRate)**varNb)),
            get calcTheAns(){ return Math.max(this.calcAnsA, this.calcAnsB)}
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispRatePerc: uRound(varRate * 100, 4),
            dispAnsA: uRound(calcAnsA,0),
            dispAnsB: uRound(calcAnsB,0),
            get dispBestChoice(){
                return (calcAnsA > calcAnsB) ? "Choice A is larger, so the answer is \$" + calcAnsA.toLocaleString() : "Choice B is larger, so the answer is \$" + calcAnsB.toLocaleString();
            }
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
            You do a consulting project for a sports team.
            As payment, they give you season tickets and 
            offer you two choices for your cash compensation.
            You want the choice that gives you the most money
            in today's dollars. For your answer below, 
            write the PV (in today's dollars) of the better offer.
            Assume the discount rate is dispRatePerc%,
            and that both alternatives have equal risk.
        </p>
        <p>
            <b>Choice A:</b> In varNa years, they'll pay you \$${varFVa.toLocaleString('en-US')}.<br />
            <b>Choice B:</b> In varNb years, they'll pay you \$${varFVb.toLocaleString('en-US')}.
        </p>
        `;

        obj.solution = probDisplay(quesVars)`
        <p>
            The payments are happening in different years.
            In order to determine which one is worth more <i>today</i>,
            we need to discount both of them back to year 0.
        </p>

        <p style="font-weight:bold; font-size: 1.2em; margin-top:12px;">
            Choice A
        </p>
        ${explainPVSinglePmt_PV({
            "varFV": varFVa,
            "varN": varNa,
            "varRate": varRate,
            "varY": varNa,
            "varPV": "??"
        })}
        <p style="font-weight:bold; font-size: 1.2em; margin-top:12px;">
            Choice B
        </p>
        ${explainPVSinglePmt_PV({
            "varFV": varFVb,
            "varN": varNb,
            "varRate": varRate,
            "varY": varNb,
            "varPV": "??"
        })}
        <p style="font-weight:bold; font-size: 1.2em; margin-top:12px;">
            Compare choices
        </p>
        <p>
            Now that we have both choices in the same year (year 0),
            we can choose the one that is larger.
        </p>
        <p>
            <b>Choice A</b>: \$${dispAnsA.toLocaleString()} <br />
            <b>Choice B</b>: \$${dispAnsB.toLocaleString()}
        </p>
        <p>
            dispBestChoice
        </p>
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