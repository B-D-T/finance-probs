function fnQues31484 ($, objFromMain) {
    "use strict";

    const udf = objFromMain.udf;
    
    this.defineVariables = function(){
        
        const quesVars = {
        };

        // FIX: This should be dynamic
        const calcVars = {
            calcTheAns: {ansStuResp: 0.1240501}
        };

        const displayVars = {
            dispTheAns: calcVars.calcTheAns.ansStuResp.toFixed(5)
        };

        return udf.combineVarObjs(quesVars, calcVars, displayVars);
    }

    this.pageContent = function(v) {
        let obj = {};

        obj.ansBoxMessage = udf.ansBoxMessages("decimalPlaces4");

        obj.stem = `
        <div class="dataset-name heading">
            Dataset: VballLeaders
        </div>

        <div>
            What is the correlation between Height and Kills,
            assuming a linear relationship between the two variables?
        </div>
        
        <div class="resp">
            <input
            class="ansbox" type="number"
            data-ansboxkey="ansStuResp"
            placeholder="${obj.ansBoxMessage}">
        </div>

        `;


        obj.solution = `
        <p>
            The correlation between Height and Kills is
            ${v.dispTheAns}.
        </p>
        `;

        return obj;

    } // end of pageContent

}

// Invoke the page on load in order to create the shortcuts to udf and other classes
try { fnQues31484(); }
catch (error) { console.error();}

console.log('Question 31484 loaded');