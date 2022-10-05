fnQues456 = function (objFromMainQues) {
  let quesVars = {
    "varA": 1,
    "varB": uRand(6, 10, 1),
    "varC": uRand(3, 20, 1),
    "varD": uRand(2, 4, 1)
  };

  quesVars = addPrefix(quesVars);
  if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)); } else { return buildPage(quesVars); }

  function buildPage(objQuesVars) {
    quesVars = objQuesVars; createEDVarInScope(quesVars);

    let calcVars = {
      calcE: (varB - varD),
      get calcG () { return varC ** (1 / this.calcE); },
      get calcTheAns () { return this.calcG - 1; }
    };
    createEDVarInScope(calcVars);

    let displayVars = {
      dispG: uRound(calcG, 5)
    };
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
                (varA+x)^{varB} = varC(varA+x)^{varD}
            \\]
            ${ansBoxMessages("usePositiveIfAnsCouldBePosOrNeg")}
        `;

    obj.solution = probDisplay(quesVars)`
            <p>
            To get the variables on the same side of the equation, 
            divide each side by \\( (varA+x)^{varD} \\).
            </p>
            <p>            
            It's easiest to divide each side by the term with the smaller 
            exponent. In this case, \\( (varA+x)^{varD} \\) is smaller 
            than \\( (varA+x)^{varB} \\).
            This will leave ${varC} on the right side by itself.
            </p>

            \\[
                \\begin{aligned}
                \\frac{(varA+x)^{varB}}{(varA+x)^{varD}} &= \\frac{varC(varA+x)^{varD}}{(varA+x)^{varD}}\\\\
                {}\\\\
                \\frac{(varA+x)^{varB}}{(varA+x)^{varD}} &= varC
                \\end{aligned}
            \\]          

            <p>
            Because we are dividing the same term (1+x) by exponents, 
            we can simplify the problem by just subtracting the exponents.
            </p>
            \\[
                \\begin{aligned}
                (varA+x)^{{varB}-{varD}} = varC \\\\
                {}\\\\
                (varA+x)^{calcE} = varC \\\\
                \\end{aligned}
            \\]


            <p>
            In order to isolate the (1+x) term, take the ${calcE}-root of 
            each side.
            </p>
            \\[
                \\begin{aligned}
                    ${texRoot(`(${varA}+x)^{${calcE}}`, calcE)} &= ${texRoot(varC, calcE)} \\\\
                    {} \\\\
                    varA + x &= dispG
                \\end{aligned}
            \\]

            <p>Lastly, subtract varA from each side to solve for x.</p>
            \\[
                \\begin{aligned}
                    varA + x - varA &= dispG - varA \\\\
                    {} \\\\
                    x &= calcTheAns
                \\end{aligned}
            \\]

        <p>
            Remember... if your calculator doesn't have a way to 
            specify taking roots other than 2 [i.e., square roots], 
            you can always raise the number to the reciprocal of the 
            exponent. In this example, taking \\( varC^{\\frac{1}{calcE}} \\)
            would give us the same solution as \\( ${texRoot(varC,calcE)} \\).
            This is also how you would have to solve the problem if 
            using Excel.
        </p>
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
