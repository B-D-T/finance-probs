function fnQues31532 ($, objFromMain) {
    "use strict";

    const udf = objFromMain.udf;
    
    this.defineVariables = function(){
    
        // FIX: This should be dynamic
        const quesVars = {
            aryConfs: ["AAC", "Pac-12", "Summit League", "WCC"]
        };

        // FIX: This should be dynamic
        const calcVars = {
            calcTheAns: {ansStuResp:"WCC"}
        };

        const displayVars = {
            dispTheAns: calcVars.calcTheAns.ansStuResp
        };

        return udf.combineVarObjs(quesVars, calcVars, displayVars);
    };

    this.pageContent = function(v) {

        // const strHTMLAnsChoices = udf.buildDropdownOptions(v.aryConfs);

        let obj = {};

        obj.ansBoxMessage = udf.ansBoxMessages("");

        obj.stem = `
        <div class="dataset-name heading">
            Dataset: VballLeaders
        </div>

        <div>
            <p>
                You are friends with the commissioners of four different conferences.
                Each commissioner is boasting that next year's Kills champion
                will come from his/her conference,
                and they ask you your opinion.
                To determine the answer,
                you want to find the conference with the most returning players.
            </p>
            <p>
                Of the choices shown here below,
                which conference has the most
                <b>non-seniors</b> on this year's list?
                (Non-senior means the class is Jr., So., or Fr.)
            </p>
        </div>
        
        `;

        // <div class="resp">
        //     <select
        //     class="ansbox" id="stuRespSelect"
        //     data-ansboxkey="ansStuResp">     
        //     ${strHTMLAnsChoices}  
        //     </select>
        // </div>


        obj.solution = `
        <p>
            The conference with the most non-seniors is ${v.dispTheAns}.
        </p>
        `;

        return obj;

    }; // end of pageContent

}

// Invoke the page on load in order to create the shortcuts to udf and other classes
try { fnQues31532(); }
catch (error) { console.error();}

console.log('Question 31532 loaded');