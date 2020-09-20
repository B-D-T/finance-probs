
function explainPVSinglePmt_PV(qvObj) {
    // Right now I'm just using black because I found the colors distracting. But I'll leave the code in case I change my mind down the road.
    let objColors = {
        varY: "black",
        varN: "black",
        varPV: "black",
        varRate: "black",
        varFV: "black"
    };

    let myStr = `
        <p>
            There is a lump sum (\$varFV) in the future (year varN),
            and you want to know what it is going to be worth in year ${qvObj.varY - qvObj.varN}.
            Let's see this on a timeline:
            ${timelinePVSinglePmt(qvObj)}
        </p>
        <p>
            ${tvmtreePVSinglePmt(qvObj, objColors)}
        </p>
        <p>
            ${identifyPVVars(qvObj, objColors)}
        </p>
        <p>
            ${solvePVSinglePmt_PV(qvObj, objColors)}
        </p>
    `;

    return fStrReplaceVarsWithVals(myStr, qvObj);
}


function solvePVSinglePmt_PV(qv, objColors) {
    const varPV = qv.varPV;
    const varFV = qv.varFV;
    const varN = qv.varN;
    const varRate = qv.varRate;
    const varY = qv.varY;

    const calcPVYear = varY - varN;
    const calcFVIF = (1 + varRate) ** varN;
    const calcPVIF = 1 / calcFVIF;
    const dispGrowthRate = uRound(1 + varRate, 4);
    const dispFVIF = uRound(calcFVIF, 5);
    const dispPVIF = uRound(calcPVIF, 5);
    const calcTheAns = varFV * calcPVIF;

    let myStr = `
    Plug the variables into the formula and solve for the unknown term.
    \\[
        \\begin{aligned}
            PV_{varY-varN} &= varFV \\left( \\frac{1}{(1+{varRate})^{varN}} \\right) \\\\
            PV_${calcPVYear} &= varFV \\left( \\frac{1}{(${dispGrowthRate})^{varN}} \\right) \\\\
            PV_${calcPVYear} &= varFV \\left( \\frac{1}{${dispFVIF}} \\right) \\\\
            PV_${calcPVYear} &= varFV \\left( ${dispPVIF} \\right) \\\\
            PV_${calcPVYear} &= ${calcTheAns}
        \\end{aligned}
    \\]
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, qv);
}

// Returns HTML with code for the timeline
function timelinePVSinglePmt(qv) {
    let myStr = `
    <div style="width:300px;text-align: center; margin:25px;">
        <div style="display:flex; justify-content:center; font-weight:bold;">
            <div style="width:15%;">Year</div>
            <div style="width:20%;">${qv.varY - qv.varN}</div>
            <div style="width:45%;"></div>
            <div style="width:20%;">varN</div>
        </div>
        <div><hr /></div>
        <div style="display:flex; justify-content:center;">
            <div style="width:15%; font-weight:bold;">Amt</div>
            <div style="width:20%;">varPV</div>
            <div style="width:45%;"></div>
            <div style="width:20%;">varFV</div>
        </div>
        <div style="margin-left:15%;">
            \\( \\overleftarrow{\\text{Bring back}} \\)
        </div>
    </div>
    `;
    return fStrReplaceVarsWithVals(myStr, qv);
}

function tvmtreePVSinglePmt(qv, objColors) {
    const formulaVars = {
        varY: "y",
        varN: "n",
        varRate: "i",
        varPV: "PV",
        varFV: "C"
    };
    let myStr = `
        <div>
            <p style="margin-bottom:4px;">
                We're discounting a value back (i.e., to the left on the timeline),
                so we'll start on the <b>Present Value</b> side of the TVM Decision Tree and start asking questions:
            </p>
            <p style="margin-left:20px; margin-top:4px;">
                Are we looking at one amount at two different points in time?
                Or is there a series of payments? <i>There is a single payment.</i> 
            </p>
            <p>
                <!-- show img of chart with paths drawn -->
            </p>
            <p>
                This leads us to the formula for the <b>Present Value of a Single Payment</b>:
            \\[
                varPV_{varY-varN}={varFV}_{varN} \\left( \\frac{1}{(1+{varRate})^{varN}} \\right)
            \\]
            </p>
        </div>
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, formulaVars);
}

// Returns HTML for variables in the Present Value of a single payment formula
function identifyPVVars(qv, objColors) {
    let myStr = `
    List the variables in the formula and write what is known and unknown.
    \\[
        \\begin{aligned}
            C_{varN} &= {varFV} \\\\
            PV_{varY-varN} &= {varPV} \\\\
            i &= varRate \\\\
            n &= varN \\\\
            y &= varY
        \\end{aligned}
    \\]
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, qv);
}


function explainFVSinglePmt_FV(qvObj) {
    // Right now I'm just using black because I found the colors distracting. But I'll leave the code in case I change my mind down the road.
    let objColors = {
        varY: "black",
        varN: "black",
        varPV: "black",
        varRate: "black",
        varFV: "black"
    };

    let myStr = `
        <p>
            You have a lump sum (\$varPV) in year varY,
            and you want to know what it is worth in year ${varY + varN}.
            Let's see this on a timeline:
            ${timelineFVSinglePmt(qvObj)}
        </p>
        <p>
            ${tvmtreeFVSinglePmt(qvObj, objColors)}
        </p>
        <p>
            ${identifyFVVars(qvObj, objColors)}
        </p>
        <p>
            ${solveFVSinglePmt_FV(qvObj, objColors)}
        </p>
    `;

    return fStrReplaceVarsWithVals(myStr, qvObj);
}

function explainFVSinglePmt_N(qvObj) {
    // Right now I'm just using black because I found the colors distracting. But I'll leave the code in case I change my mind down the road.
    let objColors = {
        varY: "black",
        varN: "black",
        varPV: "black",
        varRate: "black",
        varFV: "black"
    };

    let myStr = `
        <p>
            You know PV<sub>varY</sub> (\$varPV) and FV<sub>??</sub> (\$varFV),
            but you don't know how long it will take for the
            PV to grow to the FV amount.
            Let's see this on a timeline:
            ${timelineFVSinglePmt(qvObj)}
        </p>
        <p>
            ${tvmtreeFVSinglePmt(qvObj, objColors)}<br />
        </p>
        <p>
            ${identifyFVVars(qvObj, objColors)}
        </p>
        <p>
            ${solveFVSinglePmt_N(qvObj, objColors)}
        </p>

    `;

    return fStrReplaceVarsWithVals(myStr, qvObj);
}

function solveFVSinglePmt_FV(qv, objColors) {
    let myStr = `
    Plug the variables into the formula and solve for the unknown term.
    \\[
        \\begin{aligned}
        FV_{varY+varN} &= varPV(1+varRate)^{varN} \\\\
        FV_{${varY + varN}} &= varPV({dispGrowthRate})^{varN} \\\\
        FV_{${varY + varN}} &= varPV({dispFVIF}) \\\\
        FV_{${varY + varN}} &= calcTheAns
        \\end{aligned}
    \\]
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, qv);
}


function solveFVSinglePmt_N(qv, objColors) {
    let myStr = `
    Plug the variables into the formula and solve for the unknown term.
    \\[
        \\begin{aligned}
            varFV &= varPV(1+varRate)^n \\\\
            {}  \\\\
            \\frac{varFV}{varPV} &= {dispGrowthRate}^n \\\\
            {}  \\\\
            dispFVdivPV &= {dispGrowthRate}^n
        \\end{aligned}
    \\]
    The variable (\\(n\\)) is in the exponent, so we need to bring it 
        down with the rest of the equation in order to solve for 
        it. To do this, we can use the natural log (ln). When you 
        take the natural log of each side of the equation, \\(n\\) 
        moves down and is multiplied by the rest of the term.
    \\[
        \\begin{aligned}
            ln(dispFVdivPV) &= n*ln(dispGrowthRate) \\\\
            {}  \\\\
            dispLnFVdivPV &=  n*dispLnGrowthRate  \\\\
            {}  \\\\
            \\frac{dispLnFVdivPV}{dispLnGrowthRate}  &=  n  \\\\
            {}  \\\\
            calcTheAns  &=  n
        \\end{aligned}
    \\]
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, qv);
}


function timelineFVSinglePmt(qv) {
    let myStr = `
    <div style="width:300px;text-align: center; margin:25px;">
        <div style="display:flex; justify-content:center; font-weight:bold;">
            <div style="width:15%;">Year</div>
            <div style="width:20%;">varY</div>
            <div style="width:45%;"></div>
            <div style="width:20%;">varN</div>
        </div>
        <div><hr /></div>
        <div style="display:flex; justify-content:center;">
            <div style="width:15%; font-weight:bold;">Amt</div>
            <div style="width:20%;">varPV</div>
            <div style="width:45%;"></div>
            <div style="width:20%;">varFV</div>
        </div>
        <div style="margin-left:15%;">
            \\( \\overrightarrow{\\text{To the future}} \\)
        </div>
    </div>
    `;
    return fStrReplaceVarsWithVals(myStr, qv);
}


// Returns HTML for the Future Value of a single payment formula on the TVM Decision Tree
function tvmtreeFVSinglePmt(qv, objColors) {
    const formulaVars = {
        varY: "y",
        varN: "n",
        varRate: "i",
        varPV: "C",
        varFV: "FV"
    };
    let myStr = `
        <div>
            <p style="margin-bottom:4px;">
                We're moving to the future,
                so we'll start on the <b>Future Value</b> side of the TVM Decision Tree and start asking questions:
            </p>
            <p style="margin-left:20px; margin-top:4px;">
                Are we looking at one amount at two different points in time?
                Or is there a series of payments? <i>There is a single payment.</i> 
            </p>
            <p>
                <!-- show img of chart with paths drawn -->
            </p>
            <p>
                This leads us to the formula for the <b>Future Value of a Single Payment</b>:
            \\[
                FV_{varY+varN}={varPV}_{varY}(1+{varRate})^{varN}
            \\]
            </p>
        </div>
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, formulaVars);
}



// Returns HTML for variables in the Future Value of a single payment formula
function identifyFVVars(qv, objColors) {
    let myStr = `
    List the variables in the formula and write what is known and unknown.
    \\[
        \\begin{aligned}
            FV_{varY+varN} &= {varFV} \\\\
            PV_{varY} &= {varPV} \\\\
            i &= varRate \\\\
            n &= varN \\\\
            y &= varY
        \\end{aligned}
    \\]
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, qv);
}

console.log("tvm-related.js loaded.");