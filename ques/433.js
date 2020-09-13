fnQues433 = function (objFromMainQues) {
    //NOTE: THIS IS NOT 433. I NEED TO CHANGE THAT.
    const windowScope = this; // global var

    let quesVars = {
        "varA": uRand(2, 4, .01),
        "varB": uRand(10, 30, 1),
        "varC": uRand(20, 40, .001)
    };
    quesVars = addPrefix(quesVars, quesNum(true));

    if (objFromMainQues.isProduction) {
        return buildPage( fetchQuesVars(quesVars) );
    } else { 
        return buildPage(quesVars);
    }

    function buildPage(objQuesVars){

        // Overwrite initial quesVars with "official" quesVars
        quesVars = objQuesVars;
        createEDVarInScope(quesVars, windowScope);

        // Variables created to calculate values used within the solution
        // They don't need to have "calc" prefixes, 
        // but I did it to ensure that no variable contained the name of another variable.
        const calcVars = {
            "calcD": varC - varA,
            "calcTheAns": uLn(varC - varA) / uLn(varB)
        };
        createEDVarInScope(calcVars, windowScope);

        // Variables created to improve readability when displaying on the website
        const displayVars = {
            "dispDRound": uRound(calcD, 5),
            "dispLNvarB": uRound(uLn(varB), 5),
            "dispLNvarD": uRound(uLn(calcD), 5)
        };
        createEDVarInScope(displayVars, windowScope);
        
        // Append the quesVars object to include the variables created for calculation and display purposes
        jQuery.extend(quesVars, calcVars, displayVars);
        
        return fillPage();
    }


    function fillPage() {
    
        let obj = {};
        obj.ansBoxMessage = ansBoxMessages("decimalPlaces4");

        obj.stem =
            `
            Solve for \\(x\\) given:
            $$
                {varA}x ^\\frac{1}{varB} = varC
            $$
        `

        obj.solution =
            `
            \\(  {varA}x ^\\frac{1}{varB} = varC   \\newline \\newline \\)

            Divide each side by the coefficient (varA) in order to leave the variable on the left. 
            \\(  \\frac{{varA}x ^\\frac{1}{varB}}{varA} = \\frac{varC}{varA}   \\newline \\newline \\) 
            
            \\(  x^\\frac{1}{varB} = {dispDRound}   \\newline \\newline \\)

            To isolate x without an exponent, we need to take the \\( \\frac{1}{varB} \\)-root of each side.
            Or, to put it another way, we can raise each side by the reciprocal of the exponent,
            which is this case is \\( \\frac{varB}{1} \\).
            The exponents on the left side reduce to 1, leaving x by itself. 
            \\(
                \\newline \\newline
                {(x^{\\frac{1}{varB}})}^{\\frac{varB}{1}}={({dispDRound})}^{\\frac{varB}{1}}
                \\newline \\newline
            \\)  
            
            \\(    (x^{\\frac{1}{varB}}*^{\\frac{varB}{1}})={({dispDRound})}^{varB}    \\newline \\newline \\)  
            
            \\(    (x^{\\frac{varB}{varB}})={dispDRound}^{varB}    \\newline \\newline \\) 
            
            \\(  x = {calcTheAns}  \\newline \\newline \\)
        `

        // Replace the variables with the real values
        jQuery.each(quesVars, function(origVar, newVar){
            const strStem = obj.stem;
            const strSolution = obj.solution;
            obj.stem = strStem.replace(RegExp(origVar,"g"),newVar);
            obj.solution = strSolution.replace(RegExp(origVar,"g"),newVar);
        });
        
        return obj;
    } // end of fillPage


    // This should be set in the db, not here. But I wanted to capture it for now
    const fileInfo = {
        "QuesNum": 433,
        "Subject": ["algebra"],
        "Description": "Algebra problem where unknown x is in the exponent (solve using natural log)",
        "Keywords": ["algebra", "natural log", "e", "exponents"],
        "Author": "B. David Tyler",
        "ExcelTestbankID": 433,
        "PGFileName": "alg_natural_log.pg"
    }
}
