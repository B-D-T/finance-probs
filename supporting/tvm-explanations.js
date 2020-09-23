
function explainPVAnnuityStand_PV(qv) {
    // Right now I'm just using black because I found the colors distracting. But I'll leave the code in case I change my mind down the road.
    let objColors = {
        varY: "black",
        varN: "black",
        varPV: "black",
        varRate: "black",
        varFV: "black"
    };

    const varRate = qv.varRate || fSetLocalVar("varRate", qv.varRate);
    const varN = qv.varN || fSetLocalVar("varN", qv.varN);
    const varPMT = qv.varPMT || fSetLocalVar("varPMT", qv.varPMT);
    const varFV = qv.varFV || fSetLocalVar("varFV", qv.varFV);
    const varPV = qv.varPV || fSetLocalVar("varPV", qv.varPV);
    const varG = qv.varG || fSetLocalVar("varG", qv.varG);
    const varY = qv.varY || fSetLocalVar("varY", qv.varY);
    const varType = (varY !== 1) ? 0 : qv.varType || fSetLocalVar("type", qv.varType); // if varY is anything OTHER than 1, that means it rules and we should ignore the varType argument.

    const qvObj = { varRate, varN, varPMT, varFV, varPV, varG, varY, varType };

    let myStr = `
        <p>
            There are varN payments of the same amount that start in Year varY.
            Let's see this on a timeline:
            ${timelinePVAnnuityConstant(qvObj)}
        </p>
        <p>
            To find the value of all those payments in Year ${varY - 1},
            we could discount each one individually for the correct number of years,
            but that would be a hassle and take too long.
            Instead, we can treat this as an annuity, as shown on the Decision Tree.
            ${tvmtreePVAnnuityStand(qvObj, objColors)}
        </p>
        <p>
            ${identifyPVVars(qvObj, objColors)}
        </p>
        <p>
            ${solvePVAnnuityConstant_PV(qvObj, objColors)}
        </p>
    `;

    return fStrReplaceVarsWithVals(myStr, qvObj);
}




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

// Returns HTML with code for the timeline (FIX: Use same logic/code as the annuity timeline??)
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


// Returns HTML with code for the timeline
function timelineAnnuity(qv, annPmtYears = [], annPmts = [] ) {
    let varY = qv.varY; // change to const

/// DELETE ME
    varY=3; qv.varN = 2;
/// DELETE ME

    annPmtYears = [3,4];
    annPmts = [qv.varPMT, qv.varPMT];

    let firstPmtYears, lastPmtYears, firstPmts, midPmts=["&#x2026;"], lastPmts;
    let firstYearsHTML, midYearsHTML, lastYearsHTML;
    let firstPmtsHTML, midPmtsHTML, lastPmtsHTML;

    firstPmtYears = [varY - 1, varY, varY + 1]; // [0,1,2] or [-1,0,1]
    firstPmts = ["", qv.varPMT, qv.varPMT]; // Works for Annuity due or Standard annuity
    if (varY <= 1) {
        // do nothing
    } else if (varY == 2) {
        // Delayed annuity with y=2
        firstPmtYears.unshift(0); // [0,1,2,3]
        firstPmts.unshift(""); // ["", "", qv.varPMT, qv.varPMT];
    } else if (varY == 3) {
        // Delayed annuity with y=3
        firstPmtYears.unshift(0, 1); // [0,1,2,3,4]
        firstPmts.unshift("", ""); // ["", "", "", qv.varPMT, qv.varPMT];
    } else {
        // Delayed annuity
        firstPmtYears.unshift(0, "\u2026"); // [0,...,y-1,y,y+1]
        firstPmts.unshift("", "");
    }

    // In order to put the arrow in the correct place, we need to know the flex box
    // column on the timeline that is one year before the first payment is made (y-1).
    // Normally that's column 1, but for delayed annuities it's 2 or 3 [Year 0, ..., y-1]
    const returnsPVInColumn = firstPmts.length - 2;

    let tlWidths = {
        Total: 500, // The width of the entire timeline div, in pixels
        MaxNumOfCols: 9, // not counting the rowhead
        get curNumOfCols() {return this.MaxNumOfCols-(3-returnsPVInColumn)}, // cols with years, including year 0 (or -1)
        get RowHead() {return 0.15 * this.Total},
        get MainTL() {return this.Total - this.RowHead},
        get OneYear() {return Math.floor(this.MainTL / this.curNumOfCols) },
        get FirstYears() {return this.OneYear * firstPmtYears.length},
        get LastYears() {return this.OneYear * (qv.varN < 6 ? 0 : 3)},
        get MidYears() {return (qv.varN < 6) ? 0 : (this.MainTL - this.FirstYears - this.LastYears)},
    }
    console.log("curNumOfCols is ", tlWidths.curNumOfCols); lastPmtYears=[];lastPmts=[];

    // If there are fewer than 6 payments, show all the payments on the timeline.
    // We'll extend the firstPmts array and not bother with the last payments array.
    const pmtFinalYear = varY + qv.varN - 1;
    if (qv.varN < 6) {
        midYearsHTML = ``; midPmtsHTML = ``;

        for (let curYear = mostRecentYear(firstPmtYears) + 1; curYear <= pmtFinalYear; curYear++) {
            firstPmtYears.push(curYear);
            firstPmts.push(qv.varPMT);
        }
        firstPmtYears.push(mostRecentYear(firstPmtYears) + 1);
        firstPmts.push("");

        // The timeline needs a minimum of 6 year columns [0,1,2,3,4,5,6]. This makes sure that happens even if the annuity is only 2 years.
        let lastYearOnTimeline = pmtFinalYear+1;
        for (let colCount = tlWidths.curNumOfCols; colCount < tlWidths.MaxNumOfCols; colCount++){
            lastYearOnTimeline += 1;
            lastPmtYears.push(lastYearOnTimeline);
            lastPmts.push("");
        }        

    } else { // 6 or more payments
        const strMidHTML = `<div style="width:${tlWidths.MidYears}px;">${midPmts[0]}</div>`;
        midYearsHTML=strMidHTML; midPmtsHTML=strMidHTML;

        lastPmtYears = [pmtFinalYear - 1, pmtFinalYear, pmtFinalYear + 1];
        lastPmts = [qv.varPMT, qv.varPMT, ""];
    }

    firstYearsHTML = timelineDrawMult(firstPmtYears);
    firstPmtsHTML = timelineDrawMult(firstPmts);
    lastYearsHTML = timelineDrawMult(lastPmtYears);
    lastPmtsHTML = timelineDrawMult(lastPmts);

    function timelineDrawMult(paramAry) {
        let theStr = ``;
        jQuery.each(paramAry, function (index, theEntry) {
            theStr += `<div style="width:${tlWidths.OneYear}px;">${theEntry}</div>`
        });
        return theStr;
    }
    function mostRecentYear(theArray) {
        // Remove any non-numbers before determining the max year
        const tempAry = theArray.map(function (item) {
            return Number.isInteger(item) ? item : 0 });
        return Math.max(...tempAry);
    };
    
    let tlStr = ``;
    
    // Outer DIV for the entire timeline section
    tlStr += `<div style="width:${tlWidths.Total}px; text-align: center; margin:25px;">`;

    // Row of years across the top
    tlStr += `
            <div style="display:flex; justify-content:center; font-weight:bold;">
                <div style="width:${tlWidths.RowHead}px;">Year</div>
                ${firstYearsHTML}
                ${midYearsHTML}
                ${lastYearsHTML}
            </div>`;

    // The line itself
    tlStr += `<div><hr /></div>`;

    // Row of each payment amount
    tlStr += `<div style="display:flex; justify-content:center;">
                <div style="width:${tlWidths.RowHead}px; font-weight:bold;">Amt</div>
                ${firstPmtsHTML}
                ${midPmtsHTML}
                ${lastPmtsHTML}
            </div>`;

    // Arrow showing the value in correct year
    console.log(firstPmtYears.length);
    const countAllPmts = firstPmts.length + midPmts.length + lastPmts.length;
    const colSpacerEnd = tlWidths.MaxNumOfCols - countAllPmts ;// tlWidths.curNumOfCols + 1;

    let arrowBoxCols = tlWidths.curNumOfCols - 0.5 - returnsPVInColumn - colSpacerEnd; // All years - taper adjustment - empty years at start - empty last years
    console.log(`arrowBoxCols (${arrowBoxCols}) = curNumOfCols (${tlWidths.curNumOfCols}) - 0.5 - returnsPVInColumn (${returnsPVInColumn}) - colSpacerEnd (${colSpacerEnd})`);
    let startGapCols = returnsPVInColumn + 0.5; // +0.5 to create a longer, more tapered pointer
    tlStr += `<div style="display:flex; justify-content:left; margin-top:12px;">
                <div style="width:${tlWidths.RowHead}px;"></div>
                <div style="width:${tlWidths.OneYear * startGapCols}px"></div>
                <div id="annuity-arrow" style="width:${tlWidths.OneYear * arrowBoxCols}px";>
                    Returns the value<br>in year ${varY-1}
                </div>
            </div>`;
    // Close out entire timeline section
    tlStr += `</div>`;

    // So far the "arrow" is just a filled-in rectangle DIV. This adds pointer to the tip.
    annuityPointer("pv");


    function annuityPointer(tvmType){
        const minHeight = 40; // height of arrow box in pixels
        const styleAnnuityArrow = {
            "position":"relative", "display":"flex", "justify-content":"center", 
            "align-items":"center", "text-align":"center", "line-height":"1em",
            "min-height":`${minHeight}px`,"background":"black", "color":"#fff"
        }
        const annuityArrows= { // common properties in left and right arrows

        }
        const styleAnnuityArrowBefore = {
            "content":"", "position":"absolute", "height":0, "width":0, "top":0,
            "border":`${minHeight/2}px solid transparent`
        }
        let w1=tlWidths.OneYear;
        let arrowOffset = -1*(w1+40/2); // Each "border" on the pointer is half of the min-height of the arrow box (in pixels)
        let pointerStr = `<style> `;
        pointerStr += (tvmType == "pv")
            ? `#annuity-arrow:before{ border-right:${w1}px solid black; left:${arrowOffset}px;}`
            : `#annuity-arrow:after{ border-left:${w1}px solid black;}`; // DOES NOT WORK YET
        pointerStr += `</style>`;
        jQuery('head').append(pointerStr);
    }

    return fStrReplaceVarsWithVals(tlStr, qv);
}


function tvmtreePVAnnuityStand(qv, objColors) {
    const formulaVars = {
        varY: "y",
        varN: "n",
        varRate: "i",
        varPV: "PV",
        varPMT: "C"
    };
    let myStr = `
        <div>
            <p style="margin-bottom:4px;">
                We're discounting a value back (i.e., to the left on the timeline),
                so we'll start on the <b>Present Value</b> side of the TVM Decision Tree and start asking questions:
            </p>
            <p style="margin-left:20px; margin-top:4px;">
                Are we looking at one amount at two different points in time?
                Or is there a series of payments?
                <i>There is a series of payments.</i> 
            </p>
            <p style="margin-left:20px; margin-top:4px;">
                Do the payments go on forever?
                Or do they stop after a certain number of payments?
                <i>They stop after ${qv.varN} payments.</i> 
            </p>
            <p style="margin-left:20px; margin-top:4px;">
                Are the payments variable, the same (constant), or growing at a constant rate?
                <i>They are constant.</i> 
            </p>
            <p style="margin-left:20px; margin-top:4px;">
                Do the payments start in year 0, year 1, or some later year?
                <i>They start in Year ${qv.varY}.</i> 
            </p>
            <p>
                <!-- show img of chart with paths drawn -->
            </p>
            <p>
                This leads us to the formula for the <b>Present Value of a Standard Annuity</b>.
                The formula gives us the PV of the series of payments one year before the first
                payment is made. Since the first payment is in Year ${qv.varY},
                this returns the value of the annuity in Year ${qv.varY - 1}.
            </p>
            \\[
                varPV_{varY-1}={varPMT}_{varY} \\left( 
                    \\frac{ 1- \\frac{1}{(1+varRate)^varN} }{varRate}
                \\right)
            \\]
            <p>
                In case you skimmed over the line above, it's worth reiterating:
                <span style="color: red; font-weight:bold"><br />
                The annuity formula returns the PV of the series of payments 
                one year before the first payment is made.</span> <br />
                (First payment: Year ${qv.varY}. Formula returns: PV<sub>${qv.varY - 1}</sub>.)
            </p>
        </div>
    `;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, formulaVars);
}

function solvePVAnnuityConstant_PV(qv, objColors) {
    const varPV = "PV";
    const varFV = qv.varFV;
    const varN = qv.varN;
    const varRate = qv.varRate;
    const varY = qv.varY;
    const varPMT = qv.varPMT;
    const varG = qv.varG;
    const varType = qv.varType;

    let myStr = `
    <p>
        Plug the variables into the formula and solve for the unknown term.
    </p>

    \\[
        \\begin{aligned}
        PV_{varY-1} &= {varPMT} \\left( \\frac{ 1- \\frac{1}{(1+varRate)^{varN}} }{varRate} \\right) \\\\
        {} \\\\
        PV_{${varY - 1}} &= {varPMT} \\left( \\frac{ 1- \\frac{1}{${ftvm1Rate(qv)}^{varN}} }{varRate} \\right) \\\\
        {} \\\\
        PV_{${varY - 1}} &= {varPMT} \\left( \\frac{ 1- ${ftvmPVIF(qv, 5)} }{varRate} \\right) \\\\
        {} \\\\
        PV_{${varY - 1}} &= {varPMT} \\left( ${ftvmPVIFA(qv, 5)}  \\right) \\\\
        {} \\\\
        PV_{${varY - 1}} &= ${fPVAnnuityStandard(qv)}
        \\end{aligned}
    \\]
`;
    myStr = addColorToVars(myStr, objColors);
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
    const isAnnuity = (qv.varPMT > 0);
    let myStr = `List the variables in the formula and write what is known and unknown.`;
    if (isAnnuity) {
        myStr += `
        \\[
            \\begin{aligned}
                C_{varY} &= {varPMT} \\\\
                PV_{varY-1} &= {varPV} \\\\
                i &= varRate \\\\
                n &= varN \\\\
                y &= varY
            \\end{aligned}
        \\]
        `;
    } else {
        myStr += `
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
    }
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
            You know PV<sub>varY</sub> (\$${varPV.toLocaleString('en')}) and FV<sub>??</sub> (\$${varFV.toLocaleString('en')}),
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
    <div style="width:350px;text-align: center; margin:25px;">
        <div style="display:flex; justify-content:center; font-weight:bold;">
            <div style="width:15%;">Year</div>
            <div style="width:20%;">varY</div>
            <div style="width:45%;"></div>
            <div style="width:20%;">varN</div>
        </div>
        <div><hr /></div>
        <div style="display:flex; justify-content:center;">
            <div style="width:15%; font-weight:bold;">Amt</div>
            <div style="width:20%;">${varPV.toLocaleString('en')}</div>
            <div style="width:45%;"></div>
            <div style="width:20%;">${varFV.toLocaleString('en')}</div>
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

console.log("tvm-explanations.js loaded.");