function fnQues470 ($, objFromMain) {
  "use strict";

  // Create shorthand variables to the other files (e.g., classes from other JS files)
  const udf = objFromMain.udf;
  const capbudg = objFromMain.capbudg;

  this.defineVariables = function () {
    // Define the variables for the question in quesVars{}, calcVars{}, and displayVars{}.
    // All variables must have unique names for the question, even if put in different storage objects.
    // E.g., use varDiscRate and dispRate, NOT qv.Rate and dv.Rate.
    const quesVars = {
      "varIP": -1 * udf.uRand(2300000, 2500000, 1000000),
      "varENEPIRev": udf.uRand(2200000, 2400000, 100000),
      "varENEPIExp": -1 * udf.uRand( 940000, 970000,  10000),
      "varDiscRate": udf.uRand(.09, .11, .01),
      "varTaxRate": udf.uRand(.30, .35, .01),
      "varLifespan": 3
    };

    const calcVars = {
      calcTheAns: new capbudg.CapBudgVar(quesVars, false) // Returns object with all solutions in it
    };
    const ansVars = calcVars.calcTheAns;

    const displayVars = {
      "dispIP": (-1 * quesVars.varIP).toLocaleString("en-US"),
      "dispENEPIRev": quesVars.varENEPIRev.toLocaleString("en-US"),
      "dispENEPIExp": (-1 * quesVars.varENEPIExp).toLocaleString("en-US"),
      "dispTaxRate": udf.uRound(quesVars.varTaxRate * 100, 2),
      "dispRate": udf.uRound(quesVars.varDiscRate * 100, 2),
      get dispAnsPaybackPeriodReg() {
        const ans = ansVars.ansPaybackPeriodReg;
        return ans === undefined ? `Does not pay back within ${quesVars.varLifespan} years.` : ans.toFixed(5).toLocaleString("en-US") + " years"
      },
      get dispAnsPaybackPeriodDisc() {
        let ans = ansVars.ansPaybackPeriodDisc;
        return ans === undefined ? `Does not pay back within ${quesVars.varLifespan} years.` : ans.toFixed(5).toLocaleString("en-US") + " years"
      },
      "dispAnsNPV": ansVars.ansNPV.$$(5)
    };

    return udf.combineVarObjs(quesVars, calcVars, displayVars);
  };

  this.pageContent = function(v) {
    let obj = {};

    obj.ansBoxMessage = udf.ansBoxMessages("writeOutNums"); // decimalPlaces4

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
        <h3>
            Answer the questions below
        </h3>
        <p>
            As always, use at least 4 decimal places in your submissions,
            write out all numbers (put 2400000, not 2.4m),
            and do not use dollar signs or commas.
        </p>
        </ul>
        <div id="respPaybackPeriodRegQues470">${capbudg.htmlRespPaybackPeriodReg()}</div>
        <div id="respPaybackPeriodDiscQues470">${capbudg.htmlRespPaybackPeriodDisc()}</div>
        <div id="respNPVQues470">${capbudg.htmlRespNPV()}</div>
        `;

    obj.solution = `
        <p>
            Regular payback period: <b>${v.dispAnsPaybackPeriodReg}</b>
        </p>
        <p>
            Discounted payback period: <b>${v.dispAnsPaybackPeriodDisc}</b>
        </p>
        <p>
            Net present value (NPV): <b>${v.dispAnsNPV}</b>
        </p>
        `;
    return obj;
  }; // end of pageContent
}

// Invoke the page on load in order to create the shortcuts to udf and other classes
try { fnQues470(); } catch (error) { console.error(); }

console.log("Question 470 loaded");
