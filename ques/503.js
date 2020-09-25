
function fnQues503 (objFromMainQues) {
    
//************************ 
//THIS IS AN EXACT COPY OF 496.JS
//************************ 

let quesVars = {
    varPV: uRand(20000, 50000, 1000),
    varRate: uRand(.05, .25, .01),
    varN: uRand(5, 10, 1),
    varY: 0,
    varFV: "??"
};

quesVars = addPrefix(quesVars, quesNum());
if (objFromMainQues.isProduction) {return buildPage(fetchQuesVars(quesVars))} else {return buildPage(quesVars);}

function buildPage(objQuesVars) { quesVars = objQuesVars; createEDVarInScope(quesVars);
    
    let calcVars = {
        calcGrowthRate: 1 + varRate,
        get calcFVIF() {return this.calcGrowthRate ** varN},
        get calcTheAns() {return varPV * this.calcFVIF}
    };
    createEDVarInScope(calcVars);

    let displayVars = {
        dispRatePerc: uRound(varRate * 100, 2),
        dispGrowthRate: uRound(calcGrowthRate, 5),
        dispFVIF: uRound(calcFVIF, 5)
    };
    createEDVarInScope(displayVars); jQuery.extend(quesVars, calcVars, displayVars); return fillPage();
}

function fillPage() {
    let obj = {};
    
    obj.ansBoxMessage = ansBoxMessages("writeOutNums");

    obj.stem = probDisplay(quesVars)`
        You have \$${varPV.toLocaleString('en')} right now.
        If we wait varN years, what will the value be of that money,
        assuming a compounding rate of dispRatePerc%?
    `;

    obj.solution = probDisplay(quesVars)`${explainFVSinglePmt_FV(quesVars)}

    `;

    return obj;
} // end of fillPage

}