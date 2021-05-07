function fnQues31531 ($, objFromMain) {
    "use strict";

    const udf = objFromMain.udf;
    
    this.defineVariables = function(){
        
        const quesVars = {
        };

        const calcVars = {
            calcTheAns: "N/A"
        };

        const displayVars = {
        };

        return udf.combineVarObjs(quesVars, calcVars, displayVars);
    };

    this.pageContent = function(v, includeAnswers=false) {
        let obj = {};

        obj.ansBoxMessage = '';

        obj.stem = `
        <div>
          <div>
            <p class="dataset-name heading">Dataset: VballLeaders</p>
        
            <p>
              The questions in this section all relate to the
              VballLeaders dataset. This list shows the ranking of the top 150 women's Division I volleyball players for average kills per set. This list was originally from <a href="https://stats.ncaa.org/rankings/change_sport_year_div" target="_blank">stats.ncaa.org</a>.
            </p>
          </div>
      
          <div class="BackgroundInfo">
              Background:
              Volleyball matches are played as a series of sets,
              and a kill is a type of point earned.
          </div>
        </div>

        `;


        obj.solution = ``;

        return obj;

    } // end of pageContent

}

// Invoke the page on load in order to create the shortcuts to udf and other classes
try { fnQues31531(); }
catch (error) { console.error();}

console.log('Question 31531 loaded');