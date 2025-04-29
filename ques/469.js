function fnQues469 ($, objFromMain) {
    "use strict";

    const udf = objFromMain.udf;
    const capbudg = objFromMain.capbudg;

    
    this.defineVariables = function(){
        
        // Originally there were 3 IRR problems on the same page. However, since I need unique data-ansboxKey names, I limited it to 1 per page
        let inv01 = Array.from({ length: udf.uRand(5, 9) }, () => 0); // Initialize array with 0s
        const aryInvestments = [inv01];
        aryInvestments.forEach(elem => elem[0] = -1 * udf.uRand(14000, 44000, 2000)); // Initial investment in year 0

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
        const codeCouldCalcIRR = Number(calcVars.calcTheAns.ansIRR) ? true : false;
        const displayVars = {
            dispCodeCouldCalcIRR: codeCouldCalcIRR,
            dispIRRInv01: codeCouldCalcIRR ? udf.uRound(calcVars.calcTheAns.ansIRR,5).toFixed(4) : strNoIRRFound,
            dispIRRInv01AsPerc: codeCouldCalcIRR ? (calcVars.calcTheAns.ansIRR * 100).toFixed(2) : strNoIRRFound
        };
        console.log('displayVars', displayVars);

        return udf.combineVarObjs(quesVars, calcVars, displayVars);
    }

    
    this.pageContent = function(v) {
        let obj = {};
        
        obj.ansBoxMessage = udf.ansBoxMessages("writeOutNums"); //decimalPlaces4

        obj.stem = `
        <div style="margin-bottom:2em;">
            The following is a table of cash flows.
            Find the internal rate of return (IRR)
            by inputting the numbers into MS Excel and using the IRR function.
        </div>
        <div style="margin-bottom: 0.5em;">
            <div id="cfTableInv01Ques469">${capbudg.htmlCashFlowTable(v.varInvTL01)}</div>
            <div id="respIRR01Ques469">${capbudg.htmlRespIRR()}</div>
        </div>
        <div style="margin-top: -1em; margin-bottom:0.5em;">
            You need to submit your answer as a <b>decimal</b>
            with at least 4 decimal places.
            However, Excel returns IRR as as percent.
            If you don't know how to format a cell as a decimal, watch
            <a href="https://exceljet.net/lessons/what-is-a-number-format-in-excel" target="_blank">
                this Exceljet video</a> for
            a brief explanation of number formatting.
        </div>
        <div style="margin-top:0.5em; font-size: 0.9em;">
            Or, just go into a empty cell and type =1*A1
            (substituting A1 for your cell that has the IRR calculation);
            that will often return the percent as a decimal.
        </div>
        `;

        obj.solution = `
        <div>
            The IRR of the investment is <b>${v.dispIRRInv01}</b>.
        </div>
        <div style="margin-top: 1em;">
            <p>
                As a reminder, 
                the IRR is the rate at which the net present value (NPV) of an investment is zero.
                In other words, it is the discount rate at which the present value of
                future cash flows equals the initial investment.
            </p>
        </div>
        <div id="addl-irr-context-if-available">
        `;
        if (v.dispCodeCouldCalcIRR) {
            obj.solution += `
            <p>
                That means that if the cost of capital is less than ${v.dispIRRInv01AsPerc}%,
                this investment results in a positive NPV.
            </p>
            <p>
                On the flip side, 
                if the cost of capital is greater than ${v.dispIRRInv01AsPerc}%,
                this investment results in a negative NPV.
            </p>
            `;
        }
        obj.solution += `</div>`;

        return obj;

    } // end of pageContent

}

// Invoke the page on load in order to create the shortcuts to udf and other classes
try { fnQues469(); }
catch (error) { console.error();}

console.log('Question 469 loaded');