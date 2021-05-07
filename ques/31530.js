function fnQues31530 ($, objFromMain) {
    "use strict";

    const udf = objFromMain.udf;
    
    this.defineVariables = function(){
        
        const quesVars = {
        };

        const calcVars = {
            calcTheAns: {ansStuResp:"Responses vary for each student"}
        };

        const displayVars = {
        };

        return udf.combineVarObjs(quesVars, calcVars, displayVars);
    }

    this.pageContent = function(v, includeAnswers=false) {
        let obj = {};

        obj.ansBoxMessage = udf.ansBoxMessages("excelFormulaNoEqualsSign");

        obj.stem = `
        <div class="dataset-name heading">
            Dataset: VballLeaders
        </div>
        
        <div>
            <p style="margin-bottom:0px;">
                Add a new column to tblVballLeaders named 'Conference'.
                Write a formula that returns each player's conference 
                and copy/paste it through the column (if necessary).
            </p>
            <p class="small-text-below-paragraph">
                (you can add other columns too, 
                and use those as inputs for the 'Conference' column.
                Just make sure you don't have any spaces or special characters
                in any of the column headers.
                But you wouldn't do that anyway, right??)
            </p>
            <p>
                Copy the formula you used and submit it below.
            </p>
        </div>
        <div class="resp">
            <input
            class="ansbox excel-formula" type="text"
            data-ansboxkey="ansStuResp"
            placeholder="${obj.ansBoxMessage}"
            value="${includeAnswers ? 'Solutions vary' : ''}">
        </div>
        <div class="ResponseInstructions" style="margin-top:20px;">
            Do NOT include the equals sign at the start.
            E.g., write
            <span class="code-in-line">SUM(1,2)</span>;
            don't write
            <span class="code-in-line">
                =SUM(1,2)
            </span>
        </div>

        `;


        obj.solution = `
        <p>
            Solutions vary depending on the "helper columns" created
            when building out the parsing formulas.
        </p>
        `;

        // obj.response = `No question-specific response for 31530`;

        return obj;

    } // end of pageContent

}

// Invoke the page on load in order to create the shortcuts to udf and other classes
try { fnQues31530(); }
catch (error) { console.error();}

console.log('Question 31530 loaded');