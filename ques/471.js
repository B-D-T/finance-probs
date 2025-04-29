function fnQues471 ($, objFromMain) {
    "use strict";

    const udf = objFromMain.udf;
    const capbudg = objFromMain.capbudg;

    
    this.defineVariables = function(){
        
        const quesVars = {
            "varIP":-1 * udf.uRand(120000, 150000, 10000),
            "varATP":-1 * udf.uRand(1000000, 1100000, 100000),

            "varENEPIRev": udf.uRand(460000, 490000, 10000),

            "varLifespan": udf.uRand(8,13,1),

            "varDiscRate": udf.uRand(.04, .06, .01)
        };

        const calcVars = {
            calcTheAns: new capbudg.CapBudgVar(quesVars, false) // Returns object with all solutions in it
        };
        const ansVars = calcVars.calcTheAns;

        const displayVars = {
            "dispDiscRate": udf.uRound(quesVars.varDiscRate*100,2)+"%",
            get dispAnsPaybackPeriodReg() {
                let ans = ansVars.ansPaybackPeriodReg;
                return ans == undefined ? `Does not pay back within ${quesVars.varLifespan} years.` : ans.toFixed(5).toLocaleString('en-US') + " years"
            },
            get dispAnsPaybackPeriodDisc() {
                let ans = ansVars.ansPaybackPeriodDisc;
                return ans == undefined ? `Does not pay back within ${quesVars.varLifespan} years.` : ans.toFixed(5).toLocaleString('en-US') + " years"
            },
            "dispAnsNPV": udf.uCurrency(ansVars.ansNPV, 5)
        };

        return udf.combineVarObjs(quesVars, calcVars, displayVars);
    }

    this.pageContent = function(v) {
        let obj = {};

        obj.ansBoxMessage = udf.ansBoxMessages("writeOutNums"); //decimalPlaces4

        obj.stem = `
        <p>
            Stanford University is considering adding new seats to its basketball arena.
            The 688 new seats will bring in a total of ${udf.uCurrency(v.varENEPIRev)} in additional revenue per season.
            There is a miniscule added annual expense and it is not being factored into the decision-making process.
        </p>

        <p>
            The cost of the purchasing the seats is ${udf.uCurrency((-1*v.varIP))},
            and installation costs are ${udf.uCurrency((-1*v.varATP))},
            all of which are incurred today.
            The University's basketball facility is scheduled to be replaced,
            but that will not happen for another ${v.varLifespan} years.
            At that time, the seats are not expected to have any salvage value.
        </p>

        <p>
            The cost of capital for the project is ${v.dispDiscRate},
            and since the University enjoys non-profit status, there are no taxes to pay.
        </p>
    
        <h3>
            Answer the questions below
        </h3>
        <p>
            As always, use at least 4 decimal places in your submissions,
            write out all numbers (put 2400000, not 2.4m),
            and do not use dollar signs or commas.
        </p>
        </ul>
        <div id="respPaybackPeriodRegQues471">${capbudg.htmlRespPaybackPeriodReg()}</div>
        <div id="respPaybackPeriodDiscQues471">${capbudg.htmlRespPaybackPeriodDisc()}</div>
        <div id="respNPVQues471">${capbudg.htmlRespNPV()}</div>
        `;


        obj.solution = `
        <p>
            Regular payback period: <b>${v.dispAnsPaybackPeriodReg}</b>
        </p>
        <p>
            Discounted payback period: <b>${v.dispAnsPaybackPeriodDisc}</b>
        </p>
        <p>
            Net present value (NPV): <b>${v.dispAnsNPV}</b>
        </p>
        `;        
        return obj;

    } // end of pageContent

}

// Invoke the page on load in order to create the shortcuts to udf and other classes
try { fnQues471(); }
catch (error) { console.error();}

console.log('Question loaded');