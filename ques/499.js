fnQues499 = function (objFromMainQues) {
    const windowScope = this; // global var (global to this function anyway)

    let quesVars = {
        varFVa: uRand(6000,10000,1000),
        varFVb: uRand(4000000,5000000,1000000),
        varRate: uRand(.20, .25, .01),
        varNa: uRand(3,6,1),
        varNb: uRand(35, 50, 1)
    };

    quesVars = addPrefix(quesVars, quesNum(true));
    if (objFromMainQues.isProduction) {return buildPage(fetchQuesVars(quesVars))} else {return buildPage(quesVars);}

    function buildPage(objQuesVars) { quesVars = objQuesVars; createEDVarInScope(quesVars, windowScope);
        
        let calcVars = {
            calcAnsA: varFVa * (1 /((1+varRate)**varNa)),
            calcAnsB: varFVb * (1 /((1+varRate)**varNb)),
            get calcTheAns(){ return Math.max(this.calcAnsA, this.calcAnsB)}
        };
        createEDVarInScope(calcVars, windowScope);

        let displayVars = {
            dispRatePerc: uRound(varRate * 100, 0),
            dispAnsA: uRound(calcAnsA,0),
            dispAnsB: uRound(calcAnsB,0),
            get dispBestChoice(){
                return (calcAnsA > calcAnsB) ? "Choice A is larger, so the answer is \$" + calcAnsA : "Choice B is larger, so the answer is \$" + calcAnsB;
            }
        };
        createEDVarInScope(displayVars, windowScope); jQuery.extend(quesVars, calcVars, displayVars); return fillPage();
    }

    function fillPage() {
        let obj = {};
        
        obj.ansBoxMessage = ansBoxMessages("writeOutNums");

        obj.stem = probDisplay(quesVars)`
        <p>
            You are given a choice between two offers, 
            and you want the most money possible.
            For your answer below, 
            write the PV (in today's dollars) of the more profitable offer.
            Assume the discount rate is dispRatePerc%,
            and that both alternatives have equal risk.
        </p>
        <p>
            <b>Choice A:</b> A payment of \$varFVa, varNa years from today<br />
            <b>Choice B:</b> A payment of \$varFVb, varNb years from today
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
            <b>Choice A</b>: \$dispAnsA <br />
            <b>Choice B</b>: \$dispAnsB 
        </p>
        <p>
            dispBestChoice
        </p>
        `;

        return obj;
    } // end of fillPage

}
