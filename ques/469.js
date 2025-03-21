function fnQues469 ($, objFromMain) {
    "use strict";

    const udf = objFromMain.udf;
    const capbudg = objFromMain.capbudg;

    
    this.defineVariables = function(){
        
        // Originally there were 3 IRR problems on the same page. However, since I need unique data-ansboxKey names, I limited it to 1 per page
        let inv01 = Array(udf.uRand(5,9));
        const aryInvestments = [inv01];
        aryInvestments.forEach(elem=> elem[0]= -1 * udf.uRand(14000,44000,2000) ); // Initial investment in year 0
        
        // Build the cash flow timeline with random values (This is overwritten in next step. So why is it here??)
        function populateInvestmentTL(ary){
            return ary.map((value, idx) => 
                idx === 0 ? value : udf.uRand(8000, 10000, 200)
            );
        
        }

        const quesVars = {
            varInvTL01: populateInvestmentTL(inv01)
        };

        const calcVars = {
            calcTheAns: {
                ansIRR: capbudg.financeIRR(quesVars.varInvTL01)
            }
        };
        const strNoIRRFound = `This code was unable to calculate an IRR for the investment`;
        const displayVars = {
            dispIRRInv01: Number(calcVars.calcTheAns.ansIRR) ? udf.uRound(calcVars.calcTheAns.ansIRR,6) : strNoIRRFound
        };

        return udf.combineVarObjs(quesVars, calcVars, displayVars);
    }

    
    this.pageContent = function(v) {
        let obj = {};
        
        obj.ansBoxMessage = udf.ansBoxMessages("writeOutNums"); //decimalPlaces4

        obj.stem = `
        <p>
            The following is a table of cash flows.
            Find the internal rate of return (IRR)
            by inputting the numbers into MS Excel and using the IRR function.
        </p>
        <p>
            Enter your answer as a decimal with at least 4 decimal places.
            By default, Excel returns IRR as as percent.
            If you don't know how to format a cell as a decimal, watch
            <a href="https://exceljet.net/lessons/what-is-a-number-format-in-excel" target="_blank">
                this Exceljet video</a> for a brief explanation of number formatting.
            Or, just go into a empty cell and type =1*A1
            (substituting A1 for your cell that has the IRR calculation);
            that will often return the percent as a decimal.
        </p>
        <div>
            <div id="cfTableInv01Ques469">${capbudg.htmlCashFlowTable(v.varInvTL01)}</div>
            <div id="respIRR01Ques469">${capbudg.htmlRespIRR()}</div>
        </div>
        `;


        obj.solution = `
        <p>
        IRR of investment: <b>${v.dispIRRInv01}</b>
        </p>
        `;        
        return obj;

    } // end of pageContent

}

// Invoke the page on load in order to create the shortcuts to udf and other classes
try { fnQues469(); }
catch (error) { console.error();}

console.log('Question 469 loaded');