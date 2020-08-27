function fnQues433(objVars) {
    varA = objVars.varA;
    varB = objVars.varB;
    const objToReturn = {
        ansValue: varA + varB,
        solution: {
            firstline: firstline(varA, varB),
            secondline: objVars.fnName
        }
    };

    jQuery("#divQues433").text('The response is ' + objToReturn.ansValue);
    return objToReturn;
}

function firstline(a, b) {
    let renderedKatex = katex.renderToString("c = \\pm\\sqrt{" + a + "^2 + {" + b + "^2}", {
        throwOnError: false
    });
    return renderedKatex;
}