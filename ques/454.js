fnQues454 = function (objFromMainQues) {
  let quesVars = {
    "varA": uRand(2, 9, 1),
    "varB": uRand(2, 10, 1)
  };

  quesVars = addPrefix(quesVars);
  if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)); } else { return buildPage(quesVars); }

  function buildPage (objQuesVars) {
    quesVars = objQuesVars; createEDVarInScope(quesVars);

    let calcVars = {
      calcTheAns: Math.sqrt(varB / varA)
    };
    createEDVarInScope(calcVars);

    let displayVars = {};
    createEDVarInScope(displayVars);

    jQuery.extend(quesVars, calcVars, displayVars);
    storeQuesRespVars(quesVars, calcTheAns);
    return fillPage();
  }

  function fillPage () {
    let obj = {};

    obj.ansBoxMessage = ansBoxMessages("decimalPlaces4");

    obj.stem = probDisplay(quesVars)`
        Solve for \\(x\\) given:
        \\[
            {varA}x=\\frac{varB}{x}
        \\]
        ${ansBoxMessages("usePositiveIfAnsCouldBePosOrNeg")}
    `;

    obj.solution = probDisplay(quesVars)`
        <p>
        There are a few approaches you can use to solve this problem.  
        We'll look at two possible ways.
        </p>

        <h3>Approach A:</h3>
        <p>
        First, we have to get the x variable out of the denominator. 
        To do this, multiply each side by the reciprocal of the term 
        on the right.
        </p>
        \\[
            \\begin{aligned}
                \\frac{varAx}{1} * \\frac{x}{varB}
                & =
                \\frac{varB}{x} * \\frac{x}{varB} \\\\
                {} \\\\
                
                \\frac{varAx^2}{varB} &= \\frac{varBx}{varBx}\\\\
                {} \\\\

                \\frac{varAx^2}{varB} &= 1
            \\end{aligned}
        \\]
         
        <p>
        By rewriting the left side, we can separate the variable 
        from the number.
        Then, multiply each side by the reciprocal.
        </p>

        \\[
            \\begin{aligned}
                \\frac{varA}{varB} * \\frac{x^2}{1} &= \\frac{1}{1} \\\\
                {}\\\\

                \\frac{varB}{varA} * \\frac{varA}{varB}*\\frac{x^2}{1} &= \\frac{1}{1}*\\frac{varB}{varA} \\\\
                {}\\\\
    
                x^2 &= \\frac{varB}{varA}
            \\end{aligned}
        \\]
                
        <p>
        Finally, take the square root of each side to figure out x.
        </p>
        \\[
            \\begin{aligned}
                ${texRoot("x^2", 2)} &= ${texRoot(`\\frac{${varB}}{${varA}}`, 2)} \\\\
                {}\\\\
                x &= calcTheAns
            \\end{aligned}
        \\]

        <h3>
        Approach B:</h3>
        <p>
        A faster way to solve this problem is to cross multiply in 
        the first step. To see how this works, it helps to write the 
        original problem in fractions.
        </p>
        \\[
            \\frac{${varA}x}{1}=\\frac{${varB}}{x}
            
        \\]

        <p>
        Cross multiply by multiplying the left-side numerator & 
        right-side denominator and the right-side numerator & left-side 
        denominator.
        </p>
        \\[
            varAx*x = varB*1 \\\\
            {}\\\\
            varAx^2 = varB
            
        \\]

        <p>
        Separate the variable from the number by dividing each side by varA.
        </p>
        \\[
            \\frac{varAx^2}{varA} = \\frac{varB}{varA} \\\\
            {}\\\\
            x^2 = \\frac{varB}{varA} 
        \\]

        <p>
        Finally, take the square root of each side to figure out x.
        </p>
        \\[
            \\begin{aligned}
                ${texRoot("x^2", 2)} &= ${texRoot(`\\frac{${varB}}{${varA}}`, 2)} \\\\
                {}\\\\
                x &= calcTheAns
            \\end{aligned}
        \\]
        `;

    return obj;
  } // end of fillPage
};

// received from addOnPageSubmit
function fnQuesResp (objPageSubmit) {
  const qtrxDivID = "#divQues" + objPageSubmit.strQuesNum;
  if (!(jQuery(`${qtrxDivID}-response`).length)) {
    let objRespFeedback = objPageSubmit;
    return setEDQuesRespVars(objRespFeedback);
  }
}
