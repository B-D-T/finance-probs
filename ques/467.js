function fnQues467 ($, objFromMain) {
    "use strict";

    const udf = objFromMain.udf;
    const capbudg = objFromMain.capbudg;

    
    this.defineVariables = function(){        
        const quesVars = {
            "varIP": -1*udf.uRand(170000, 175000, 1000),
            "varATP": -1*udf.uRand(7000, 9000, 1000),
            "varNewMachines": 7,
            "varResalePricePer": udf.uRand(600, 900, 100),
            get varEQP(){return this.varNewMachines * this.varResalePricePer},
            
            "varGamesPerYr": udf.uRand(52000, 56000, 1000),
            "varCostPerGameOld": udf.uRand(4, 7, 1),
            "varAddlGames": udf.uRand(8000, 11000, 1000),
            "varCostPerGameNew": udf.uRand(4, 7, 1),
            get varNewGamesPerYr(){return this.varGamesPerYr + this.varAddlGames},

            get varENEWPRev(){return this.varGamesPerYr * this.varCostPerGameOld}, // old annual revenues
            get varENEPIRev(){return this.varNewGamesPerYr * this.varCostPerGameNew}, // new annual revenues

            "varENEWPExp": -1* udf.uRand(1300, 1700, 100), // old maintenance costs
            "varENEPIExp": -1 * udf.uRand(1900, 2200, 100), // new maintenance costs


            "varLifespan": udf.uRand(7,9,1),
            "varSalvagePerUnit": udf.uRand(1000, 1500, 100),
            get varSalvage(){return this.varSalvagePerUnit * this.varNewMachines},

            "varTaxRate": udf.uRand(.30, .35, .01),
            "varDiscRate": udf.uRand(.08, .1, .01),
        };

        const calcVars = {
            calcTheAns: new capbudg.CapBudgVar(quesVars, false) // Returns object with all solutions in it
        };

        const displayVars = {
            "dispTaxRate": (quesVars.varTaxRate*100).toFixed(2)+"%",
            "dispRate":  (quesVars.varDiscRate*100).toFixed(2)+"%"
        };

        return udf.combineVarObjs(quesVars, calcVars, displayVars);
    }

    this.pageContent = function(v) {
        let obj = {};

        obj.ansBoxMessage = udf.ansBoxMessages("writeOutNums"); //decimalPlaces4

        obj.stem = `
        <p>
            BDT Enterprises, which owns The Park (a local sports bar and bowling alley), 
            is considering updating by putting in seven new pin-setting machines.
            The current machines allow for ${v.varGamesPerYr.$$()} bowled games per year
            at ${v.varCostPerGameOld.$$(2)} per game.
            Despite being old, they have held up well and
            only require a total of ${(-1*v.varENEWPExp).$$()} per year in maintenance.
            The seven current machines can be sold to individuals for in-home use for ${v.varResalePricePer.$$()} each.
        </p>
        <p>
            The total cost of the new machines is ${(-1*v.varIP).$$()},
            installation is an additional ${(-1*v.varATP).$$()},
            and those costs are incurred today (i.e., at t=0).
            The new machines will have a useful life of ${v.varLifespan} years
            and can be depreciated in a straight-line method over these  ${v.varLifespan} years.
            At the end of the ${v.varLifespan} years,
            they are expected to have a salvage/scrap value of ${v.varSalvagePerUnit.$$()} each.
        </p>
        <p>
            The machines will reset the pins faster after each bowler rolls,
            thus making the bowling alley more attractive to customers.
            Based on a market survey,
            it is expected that the machines will increase the number of games bowled by ${v.varAddlGames.toLocaleString('en-US')} each year,
            for the 8 years.
            The price of each game ${(v.varCostPerGameOld==v.varCostPerGameNew ? "will remain at " : "is now ") + v.varCostPerGameNew.$$(2)} per game.
            The new machines will have annual maintenance expenses of ${(-1*v.varENEPIExp).$$()} per year.
        </p>
        <p>
            BDT faces a ${v.dispTaxRate} tax rate, and it has a cost of capital of ${v.dispRate}.
        </p>
        <p style="margin-bottom:2px;">
            <b>Complete the variables table with the proper dollar amounts,
            following these instructions <i>exactly</i></b>
        </p>
        <ul style="margin-top:4px;">
            <li>Always use at least 4 decimal places, where applicable</li>
            <li>Write all percentages as a decimal, not a percent (e.g., write ${v.varDiscRate.toFixed(2)}, not ${v.dispRate})</li>
            <li>Do not use dollar signs or commas</li>
            <li>Negative signs need to be included for cash outflows</li>
        </ul>
        <div id="capbudgVarTableQues467">${capbudg.htmlVariableTable()}</div>
        `;

        obj.solution = `
        <p>
            Below is the completed table with the correct variables from the prompt. 
        </p>
        <div id="capbudgVarTableQues467Solutions">${capbudg.htmlVariableTable(true,v.calcTheAns)}</div>`;
        
        return obj;

    } // end of pageContent

}

try { fnQues467(); }
catch (error) { console.error();}

console.log('Question loaded');