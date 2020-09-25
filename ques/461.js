

function fnQues461(objFromMainQues) {


    let quesVars = {
        "varA": uRand(2, 8, 1),
        "varB": uRand(1, 1.8, .001),
        "varC": uRand(20, 60, 1),
    }

    quesVars = addPrefix(quesVars, quesNum());
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars); }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcD: uLn(varA),
            calcE: uLn(varC),
            get calcTheAns() { return (this.calcE / this.calcD) - varB }
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispD: uRound(calcD, 5),
            dispE: uRound(calcE, 5),
            dispF: uRound((calcE / calcD), 5),
            dispTheAns: uRound(calcTheAns, 5),
        }
        createEDVarInScope(displayVars); jQuery.extend(quesVars, calcVars, displayVars); return fillPage();
    }

    function fillPage() {
        let obj = {};
        
        obj.ansBoxMessage = ansBoxMessages("decimalPlaces4");

        obj.stem = probDisplay(quesVars)`
        Solve for \\(x\\) given:
        \\[
            varA^{x+varB}=varC
        \\]
        
    `
    obj.solution = probDisplay(quesVars)`
        The variable is in the exponent, so we need to bring it down 
        with the rest of the equation in order to solve for it. 
        To do this, we can use the natural log (ln). When you take 
        the natural log of each side of the equation, the exponent 
        term (x+varB) moves down and is multiplied by the natural log of varA.
        \\[
           \\begin{aligned}
           ({x+varB})*ln(varA) &= ln(varC) \\\\
           ({x+varB})*dispD &= dispE
           \\end{aligned} 

        \\]
        Keeping order of operations in mind, we divide each side by 
        the coefficient (dispD), which will leave just x+varB on the 
        left.
        \\[
            \\begin{aligned}
            \\frac{({x+varB})*dispD}{dispD} &= \\frac{dispE}{dispD} \\\\
            {} \\\\
            x+varB &= dispF
            \\end{aligned} 
        \\]
        To solve for x, we subtract varB from each side.
        \\[
            \\begin{aligned}
            x+varB-varB &= dispF-varB \\\\
            x+0 &=dispTheAns \\\\
            x &= calcTheAns
            \\end{aligned} 
        \\]
       
    `
    return obj;

} // end of fillPage
}