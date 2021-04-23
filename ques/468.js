function fnQues468 ($, objFromMain) {
    "use strict";

    // Create shorthand variables to the other files (e.g., classes from other JS files)
    const udf = objFromMain.udf;
    const capbudg = objFromMain.capbudg;

    
    this.defineVariables = function(){
        
        // Define the variables for the question in quesVars{}, calcVars{}, and displayVars{}.
        // All variables must have unique names for the question, even if put in different storage objects.
        // E.g., use varDiscRate and dispRate, NOT qv.Rate and dv.Rate.
        const quesVars = {
            "varIP": -1 * udf.uRand(2500000, 2800000, 1000000),
            "varENEPIRev": udf.uRand(2200000, 2400000, 100000),
            "varENEPIExp": -1 * udf.uRand( 950000, 1000000,  10000),
            "varDiscRate": udf.uRand(.1, .16, .01),
            "varTaxRate": udf.uRand(.30, .35, .01),
            "varLifespan": 3
        };

        const calcVars = {
            calcTheAns: new capbudg.CapBudgVar(quesVars, false) // Returns object with all solutions in it
        };
console.log(calcVars.calcTheAns);
       
        const displayVars = {
            "dispIP": (-1*quesVars.varIP).toLocaleString('en-US'),
            "dispENEPIRev": quesVars.varENEPIRev.toLocaleString('en-US'),
            "dispENEPIExp": (-1*quesVars.varENEPIExp).toLocaleString('en-US'),
            "dispTaxRate": udf.uRound(quesVars.varTaxRate*100,2),
            "dispRate": udf.uRound(quesVars.varDiscRate*100,2)
        };

        return udf.combineVarObjs(quesVars, calcVars, displayVars);
    }

    this.pageContent = function(v) {
        let obj = {};

        obj.ansBoxMessage = udf.ansBoxMessages("writeOutNums"); //decimalPlaces4

        obj.stem = `
        <p>
            Down Under Boomerang, Inc, is considering a new 3-year expansion project that
            requires an initial fixed asset investment of \$${v.dispIP}.
            The fixed asset will be depreciated straight-line to zero over its 3-year tax life,
            after which time it will be worthless.
        </p>
        <p>
            The project is estimated to generate \$${v.dispENEPIRev}
            in new annual sales, with costs of \$${v.dispENEPIExp} per year.
        </p>
        <p>
            The tax rate is ${v.dispTaxRate}%, and the cost of capital is ${v.dispRate}%.
        </p>
        <p style="margin-bottom:2px;">
            <b>Complete the variables table with the proper dollar amounts,
            following these instructions <i>exactly</i></b>
        </p>
        <ul style="margin-top:4px;">
            <li>Always use at least 4 decimal places, where applicable</li>
            <li>Write all percentages as a decimal, not a percent (e.g., write 0.05, not 5%)</li>
            <li>Do not use dollar signs or commas</li>
            <li>Negative signs need to be included for cash outflows</li>
        </ul>
        <div id="capbudgVarTableQues468">${capbudg.htmlVariableTable()}</div>
        `;

        obj.solution = `
        <p>
            Below is the completed table with the correct variables from the prompt. 
        </p>
        <div id="capbudgVarTableQues468Solutions">${capbudg.htmlVariableTable(true,v.calcTheAns)}</div>`;

        obj.response = `<p>Can you read <b>this</b>??`
        
        return obj;

    } // end of pageContent

}

// Invoke the page on load in order to create the shortcuts to udf and other classes
try { fnQues468(); }
catch (error) { console.error();}

console.log('Question 468 loaded');