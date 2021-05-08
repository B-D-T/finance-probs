function fnQues31483 ($, objFromMain) {
    "use strict";

    const udf = objFromMain.udf;
    
    this.defineVariables = function(){
        
        const quesVars = {
        };

        // FIX: This should be dynamic
        const calcVars = {
            calcTheAns: {ansStuResp:133}
        };

        const displayVars = {
            dispTheAns: calcVars.calcTheAns.ansStuResp
        };

        return udf.combineVarObjs(quesVars, calcVars, displayVars);
    };

    this.pageContent = function(v) {
        let obj = {};

        obj.ansBoxMessage = udf.ansBoxMessages();

        obj.stem = `
        <div class="dataset-name heading">
            Dataset: VballLeaders
        </div>
        
        <div>
            How many different schools have players on this list?
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
            There are ${v.dispTheAns} different schools in the list.
        </p>
        `;

        return obj;

    }; // end of pageContent

}

// Invoke the page on load in order to create the shortcuts to udf and other classes
try { fnQues31483(); }
catch (error) { console.error();}

console.log('Question 31483 loaded');