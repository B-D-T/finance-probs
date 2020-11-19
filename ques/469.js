function fnQues469 ($, objFromMain) {
    "use strict";

    const udf = objFromMain.udf;
    const capbudg = objFromMain.capbudg;

    
    this.defineVariables = function(){
        
        let inv01 = Array(udf.uRand(5,9));
        let inv02 = Array(udf.uRand(6,12));
        let inv03 = Array(udf.uRand(4,6));
        const aryInvestments = [inv01, inv02, inv03];
        aryInvestments.forEach(elem=> elem[0]= -1 * udf.uRand(14000,44000,2000) );
        
        // Build the cash flow timeline with random values
        function populateInvestmentTL(ary){
            for (let index = 1; index < ary.length; index++) {
                ary[index] = udf.uRand(8000,10000,200);
            }
            return ary;
        }

        const quesVars = {
            varInvTL01: populateInvestmentTL(inv01),
            varInvTL02: populateInvestmentTL(inv02),
            varInvTL03: populateInvestmentTL(inv03)
        };

        let ansVars = {
            calcIRRInv01: capbudg.financeIRR(quesVars.varInvTL01),
            calcIRRInv02: capbudg.financeIRR(quesVars.varInvTL02),
            calcIRRInv03: capbudg.financeIRR(quesVars.varInvTL03)
        };
        console.log('ansVars',ansVars);

        const calcVars = {
            calcTheAns: {
                inv01IRR: ansVars.calcIRRInv01,
                inv02IRR: ansVars.calcIRRInv02,
                inv03IRR: ansVars.calcIRRInv03
            },
            correctAns: {
                irr_1: ansVars.calcIRRInv01,
                irr_2: ansVars.calcIRRInv02,
                irr_3: ansVars.calcIRRInv03
            }
        };

        const strNoIRRFound = `This code was unable to calculate a IRR for the investment`;
        const displayVars = {
            dispIRRInv01: Number(ansVars.calcIRRInv01) ? udf.uRound(ansVars.calcIRRInv01,6) : strNoIRRFound,
            dispIRRInv02: Number(ansVars.calcIRRInv02) ? udf.uRound(ansVars.calcIRRInv02,6) : strNoIRRFound,
            dispIRRInv03: Number(ansVars.calcIRRInv03) ? udf.uRound(ansVars.calcIRRInv03,6) : strNoIRRFound
        };

        return udf.combineVarObjs(quesVars, calcVars, displayVars);
    }

    
    this.pageContent = function(v) {
        let obj = { "allVars": v };
        
        obj.ansBoxMessage = udf.ansBoxMessages("writeOutNums"); //decimalPlaces4

        obj.stem = `
        <p>
            The following are tables of cash flows.
            For each table, find the internal rate of return (IRR)
            by inputting the numbers into MS Excel and using the IRR function.
        </p>
        <p>
            Enter each answer as a decimal with at least 4 decimal places.
            By default, Excel returns IRR as as percent.
            If you don't know how to format a cell as a decimal, watch
            <a href="https://exceljet.net/lessons/what-is-a-number-format-in-excel" target="_blank">
                this Exceljet video</a> for a brief explanation of number formatting.
            Or, just go into a empty cell and type =1*A1
            (substituting A1 for your cell that has the IRR calculation);
            that will often return the percent as a decimal.
        </p>
        <div>
            <h2>Investment #1</h2>
            <div id="cfTableInv01Ques469">${capbudg.htmlCashFlowTable(v.varInvTL01)}</div>
            <div id="respIRR01Ques469">${capbudg.htmlRespIRR()}</div>
        </div>
        <div>
            <h2>Investment #2</h2>
            <div id="cfTableInv02Ques469">${capbudg.htmlCashFlowTable(v.varInvTL02)}</div>
            <div id="respIRR02Ques469">${capbudg.htmlRespIRR()}</div>
        </div>
        <div>
            <h2>Investment #3</h2>
            <div id="cfTableInv03Ques469">${capbudg.htmlCashFlowTable(v.varInvTL03)}</div>
            <div id="respIRR03Ques469">${capbudg.htmlRespIRR()}</div>
        </div>                
        `;


        obj.solution = `
        <p>
        IRR of investment #1: <b>${v.dispIRRInv01}</b>
        </p>
        <p>
        IRR of investment #2: <b>${v.dispIRRInv02}</b>
        </p>
        <p>
            IRR of investment #3: <b>${v.dispIRRInv03}</b>
        </p>
        `;        
        return obj;

    } // end of pageContent

}

// Invoke the page on load in order to create the shortcuts to udf and other classes
try { fnQues469(); }
catch (error) { console.error();}

console.log('Question loaded');