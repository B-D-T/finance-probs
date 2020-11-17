fnQues505 = function (objFromMainQues) {
    
//************************ 
//THIS IS AN EXACT COPY OF 497.JS
//************************ 

let quesVars = {
    varFV: uRand(20000, 50000, 1000),
    varRate: uRand(.08, .20, .01),
    varN: uRand(8, 20, 1),
    varPV: "??",
    get varY() { return this.varN }
};

quesVars = addPrefix(quesVars);
if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

function buildPage(objQuesVars) {
    quesVars = objQuesVars; createEDVarInScope(quesVars);

    let calcVars = {
        calcTheAns: varFV * (1 / ((1 + varRate) ** varN))
    };
    createEDVarInScope(calcVars);

    let displayVars = {
        dispRatePerc: uRound(varRate * 100, 4)
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
        You will receive a payment of \$${varFV.toLocaleString('en-US')} in varN years.
        What is the present value of the payment in today's dollars (at t=0),
        assuming a dispRatePerc% discount rate?
    </p>
    `;

    obj.solution = probDisplay(quesVars)`${explainPVSinglePmt_PV(quesVars)}`;

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