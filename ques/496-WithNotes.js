fnQues496 = function (objFromMainQues) {
    const windowScope = this; // global var

    let quesVars = {
        varPV: uRand(20000, 50000, 1000),
        varRate: uRand(.05, .25, .01),
        varN: uRand(5, 10, 1),
        varY: 0
    };
    quesVars = addPrefix(quesVars, quesNum());

    if (objFromMainQues.isProduction) {return buildPage(fetchQuesVars(quesVars))} else {return buildPage(quesVars);}

    function buildPage(objQuesVars) {

        // Overwrite initial quesVars with "official" quesVars
        quesVars = objQuesVars;
        createEDVarInScope(quesVars);

        // Variables created to calculate values used within the solution
        // They don't need to have "calc" prefixes, 
        // but I did it to ensure that no variable contained the name of another variable.
        let calcVars = {};
        calcVars = {
            calcGrowthRate: 1 + varRate,
            get calcFVIF() {return this.calcGrowthRate ** varN},
            get calcTheAns() {return varPV * this.calcFVIF}
        };
        createEDVarInScope(calcVars);

        // Variables created to improve readability when displaying on the website
        const displayVars = {
            dispRatePerc: uRound(varRate * 100, 0),
            dispGrowthRate: uRound(calcGrowthRate, 5),
            dispFVIF: uRound(calcFVIF, 5)
        };
        createEDVarInScope(displayVars);

        // Append the quesVars object to include the variables created for calculation and display purposes
        jQuery.extend(quesVars, calcVars, displayVars);

        return fillPage();
    }

    function fillPage() {

        let obj = {};
        obj.ansBoxMessage = ansBoxMessages("writeOutNums");

        obj.stem = probDisplay(quesVars)`
            You have \$varPV right now. What is the value of \$varPV, varN years
            from now, assuming dispRatePerc%?
        `;

        obj.solution = probDisplay(quesVars)`
            <p>
            You have a lump sum (\$varPV) now (year 0),
            and you want to know what it is going to be worth in varN years.
            As simple as this problem seems, draw a quick timeline:
            ${timelineFVSinglePmt(quesVars)}
            </p>
            <p>
            ${tvmtreeFVSinglePmt(quesVars)}
            </p>
            <p>
            Begin by identifying the variables (what is known and unknown).
            \\[
                \\begin{aligned}
                FV_{varN} &= {?} \\\\
                C_0 &= varPV \\\\
                i &= varRate \\\\
                n &= varN \\\\
                y &= varY
                \\end{aligned}
            \\]
            Once you have identified the variables, 
            plug them into the proper formula and solve for FV.
            \\[
                \\begin{aligned}
                FV_{varY+varN} &= varPV(1+varRate)^{varN} \\\\
                FV_{varN} &= varPV({dispGrowthRate})^{varN} \\\\
                FV_{varN} &= varPV({dispFVIF}) \\\\
                FV_{varN} &= calcTheAns
                \\end{aligned}
            \\]
            </p>
        `;

        return obj;
    } // end of fillPage

}
