function fnQues31423 ($, objFromMain) {
    "use strict";

    const udf = objFromMain.udf;
    const capbudg = objFromMain.capbudg;
    
    this.defineVariables = function(){
        
        // Determine the conference to pipe into the question
        // FIX: This should be dynamic
        const objAvgKillsByConf = {"ACC": 234.13, "Big 12": 334.20, "Big Ten": 210.38, "Pac-12": 240.75, "SEC": 285.10, "SoCon": 283.00};

        const listConferences = Object.keys(objAvgKillsByConf);

        const quesVars = {
            "idxConfPosToReturn": udf.uRand(0, listConferences.length - 1, 1),
            get theConf() { return listConferences[this.idxConfPosToReturn];} // string e.g., "Big 12", "SoCon"
        };

        const calcVars = {
            "calcTheAns": {
                "ansStuResp": objAvgKillsByConf[quesVars.theConf]  // number like 234.13, 334.20
            }
        };
        const ansVars = calcVars.calcTheAns;

        const displayVars = {
            "dispTheAns": ansVars.ansStuResp.toFixed(4)
        };

        return udf.combineVarObjs(quesVars, calcVars, displayVars);
    };

    this.pageContent = function(v) {
        let obj = {};

        obj.ansBoxMessage = udf.ansBoxMessages("decimalPlaces2");

        obj.stem = `
        <div class="dataset-name heading">
            Dataset: VballLeaders
        </div>

        <div>
            What is the average number of kills for players
            from the ${v.theConf} conference?
        </div>


        `;

                
        // <div class="resp">
        //     <input
        //     class="ansbox" type="number"
        //     data-ansboxkey="ansStuResp"
        //     placeholder="${obj.ansBoxMessage}">
        // </div>

        obj.solution = `
        <p>
            The average number of kills for ${v.theConf} athletes is
            ${v.dispTheAns}.
        </p>
        `;

        return obj;

    }; // end of pageContent

}

// Invoke the page on load in order to create the shortcuts to udf and other classes
try { fnQues31423(); }
catch (error) { console.error();}

console.log('Question 31423 loaded');