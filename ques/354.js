
function fnQues354(objFromMainQues) {


    let quesVars = {
        "varA": uRand(10000,15000,2.1),
        "varB": uRand(2,9,1),
        "varC": uRand(60000,80000, 2.1)
    }
    
    quesVars = addPrefix(quesVars, quesNum());
    if (objFromMainQues.isProduction) {return buildPage(fetchQuesVars(quesVars))} else {return buildPage(quesVars);}

    function buildPage(objQuesVars) { quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcD: varC / varB,
            get calcTheAns() {return calcD / varA }
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispD: uRound(calcD, 5),
            dispTheAns: uRound(calcTheAns, 5)
        };
        createEDVarInScope(displayVars); jQuery.extend(quesVars, calcVars, displayVars); return fillPage();
    }

    function fillPage() {
        let obj = {};
        
        obj.ansBoxMessage = ansBoxMessages("decimalPlaces4");

        obj.stem = probDisplay(quesVars)`
            Solve for \\(x\\) given:
            \\[
                varA = \\frac{varC}{{varB}x}
            \\]
        `

        obj.solution = probDisplay(quesVars)`
            <p>
                First divide the constants (varC / varB)
                which will simplify the fraction and leave
                an x in the denominator.
            </p>
            \\[
                varA = \\frac{dispD}{x}
            \\]
            <p>
                Then, rewrite the original problem in fractions
                and cross multiply by multiplying the left-side numerator
                & right-side denominator and the right-side numerator &
                left-side denominator.
            </p>
            \\[
                \\begin{aligned}
                    \\frac{varA}{1} &= \\frac{dispD}{x} \\\\
                    {} \\\\
                    {varA}*x &= dispD * 1 \\\\
                    {} \\\\
                    {varA}*x &= dispD
                \\end{aligned}
            \\]
            <p>
                Divide each side by varA to isolate x on the left side.
            </p>
            \\[
                \\begin{aligned}
                    \\frac{{varA}*x}{varA} &= \\frac{dispD}{varA} \\\\
                    {} \\\\
                    x &= \\frac{dispD}{varA} \\\\
                    {} \\\\
                    x &= dispTheAns
                \\end{aligned}
            \\]
        `

        return obj;

    } // end of fillPage
}