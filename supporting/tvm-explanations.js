
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
            ${timelineAnnuity(qvObj, "pv")}
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

function explainFVAnnuityStand_FV(qv) {
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
    const varFV = "??";// qv.varFV || fSetLocalVar("varFV", qv.varFV);
    const varPV = qv.varPV || fSetLocalVar("varPV", qv.varPV);
    const varG = qv.varG || fSetLocalVar("varG", qv.varG);
    const varY = qv.varY || fSetLocalVar("varY", qv.varY);
    const varType = (varY !== 1) ? 0 : qv.varType || fSetLocalVar("type", qv.varType); // if varY is anything OTHER than 1, that means it rules and we should ignore the varType argument.

    const qvObj = { varRate, varN, varPMT, varFV, varPV, varG, varY, varType };

    let myStr = `
        <p>
            There are varN payments of the same amount that start in Year varY.
            Let's see this on a timeline:
            ${timelineAnnuity(qvObj, "fv")}
        </p>
        <p>
            To find the value of all those payments in Year ${varY + varN - 1},
            we could compound each one individually for the correct number of years,
            but that would be a hassle and take too long.
            Instead, we can treat this as an annuity, as shown on the Decision Tree.
            ${tvmtreeFVAnnuityStand(qvObj, objColors)}
        </p>
        <p>
            ${identifyFVVarsAnn(qvObj, objColors)}
        </p>
        <p>
            ${solveFVAnnuityConstant_FV(qvObj, objColors)}
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
// annPmts is a array of two arrays. First is 9 "year" values, next is 9 pmt values.
// e.g., [ [0,1,2,3,4,5,9,7,8], [0,0,0,450,450,450,450,0,0] ]
// It MUST be <=9 elements. The code will quit on anything more than that.
function timelineAnnuity(qv, tvmType = "pv", annPmts = [], showArrow = true) {
    const varY = qv.varY, varN = qv.varN, varPMT = qv.varPMT;

    // If a payment timeline (annPmts) is passed, that's used instead of the qv values.
    let useCallerTL = (annPmts[0].length === 9);
    //varN = annPmts.length > 0 ? annPmts.length : qv.varN
    // Creates an array of length varN, starting in year varY. e.g., [3, 4, 5, 6]
    //annYears = Array(qv.varN). fill(). map((_, idx) => varY + idx);

    // Timeline must have one column empty before(year 0) and one empty after(to show no payment there)
    // Since the max is 9, that means we can show a max of 7 payments.
    const tlMaxCols = 9;
    let yn = varY + varN;
    const tlSecOrder = ["Start", "Delayed", "First", "Mid", "Last", "Fillers"];
    let tlYears = { "Start": [], "Delayed": [], "First": [], "Mid": [], "Last": [], "Fillers": [], };
    let tlPmts = { "Start": [], "Delayed": [], "First": [], "Mid": [], "Last": [], "Fillers": [], };
    let TESTARRAY = [];

    if (useCallerTL) {
        tlYears.Start = annPmts[0];
        tlPmts.Start = annPmts[1];
        yn = tlYears.length + 1;
    } else {
        fBuildTimeline();
    }

    // This is a function so I can return out of it if I fill up the 'First' array
    function fBuildTimeline() {

        // Start
        tlYears.Start.push(varY === 0 ? -1 : 0)
        tlPmts.Start.push(``);
        TESTARRAY.push(`Start`);

        // This if block takes care of all the varY<=1 timelines
        if (varY <= 1) {
            if (varN <= 7) {
                // Show all payments then skip to the end          
                for (let nCount = varY; nCount <= yn - 1; nCount++) {
                    tlYears.First.push(nCount);
                    tlPmts.First.push(varPMT);
                    TESTARRAY.push(`y<=1,n<=7`);
                }
                return;
            } else {
                // [0,1] or [1,2]
                tlYears.First.push(varY, varY + 1);
                tlPmts.First.push(varPMT, varPMT);
                tlYears.Mid.push(".");
                tlPmts.Mid.push(".");
                tlYears.Last.push(yn - 2, yn - 1);
                tlPmts.Last.push(varPMT, varPMT);
                TESTARRAY.push(`y<=1,n>7`);
                return;
            }
        }

        // Delayed - prefill timeline years where possible
        if (varY <= 3 || varY <= 6 && varN == 2 || varY == 4 && varN <= 4) {
            // prefill up to y-1
            for (let nCount = 1; nCount <= varY - 1; nCount++) {
                tlYears.Delayed.push(nCount);
                tlPmts.Delayed.push(``);
                TESTARRAY.push(`Prefill 1`);
            }
        } else {
            tlYears.Delayed.push(".", varY - 1); // this isn't right. what about 3,2)
            tlPmts.Delayed.push(``, ``);
            TESTARRAY.push(`Prefill 2`);
        }


        // These are delayed annuities that do not need to be broken up with a mid
        if (varN <= 5 || varY == 2 && varN == 6) {
            for (let nCount = varY; nCount <= varY + varN - 1; nCount++) {
                tlYears.First.push(nCount);
                tlPmts.First.push(varPMT);
                TESTARRAY.push(`Unbkn delayed`);
            }
            return;
        } else {
            // Years to the mid
            tlYears.First.push(varY, varY + 1);
            tlPmts.First.push(varPMT, varPMT);
            // The dot
            tlYears.Mid.push(".");
            tlPmts.Mid.push(".");
            // The end
            tlYears.Last.push(yn - 2, yn - 1);
            tlPmts.Last.push(varPMT, varPMT);
            TESTARRAY.push(`Brkn delayed`);
            return;
        }
    }; // end of the main if-then logic

    // Concatenate the timelines so far
    let aryTLYears = [], aryTLPmts = [];
    jQuery.each(tlSecOrder, function (idx, val) {
        aryTLYears = aryTLYears.concat(...tlYears[val]);
        aryTLPmts = aryTLPmts.concat(...tlPmts[val]);
    });

    // The timeline always needs tlMaxCols (9) columns (for aesthetics, mostly).
    // This code fills any extra elements one more year and them with trailing spaces.
    for (let colCount = aryTLYears.length; colCount < tlMaxCols; colCount++) {
        let mostRecTLYear = mostRecentYear(aryTLYears);
        const nextTLYear = (mostRecTLYear == yn - 1) ? mostRecTLYear + 1 : ``;
        aryTLYears.push(nextTLYear);
        aryTLPmts.push(``);
        TESTARRAY.push(`filler`);
    }


    let tlWidths = {
        Total: 500, // The width of the entire timeline div, in pixels
        MaxNumOfCols: tlMaxCols - 1, // not counting the rowhead
        curNumOfCols: aryTLYears.length, // cols with years, including year 0 (or -1)
        get RowHead() { return 0.15 * this.Total },
        get MainTL() { return this.Total - this.RowHead },
        get OneYear() { return Math.floor(this.MainTL / this.curNumOfCols) }
    }
    lastPmtYears = []; lastPmts = [];


    function timelineDrawMult(paramAry) {
        let strTLRow = ``;
        jQuery.each(paramAry, function (index, theEntry) {
            strTLRow += `<div style="width:${tlWidths.OneYear}px;">${theEntry}</div>`
        });
        return strTLRow;
    }
    function mostRecentYear(theArray) {
        // Remove any non-numbers before determining the max year
        const tempAry = theArray.map(function (item) {
            return Number.isInteger(item) ? item : 0
        });
        return Math.max(...tempAry);
    };

    let tlStr = ``;

    // Outer DIV for the entire timeline section
    tlStr += `<div style="width:${tlWidths.Total}px; text-align: center; margin:25px;">`;

    // Row of years across the top
    tlStr += `
            <div style="display:flex; justify-content:center; font-weight:bold;">
                <div style="width:${tlWidths.RowHead}px;">Year</div>
                ${timelineDrawMult(aryTLYears)}
            </div>`;

    // The line itself
    tlStr += `<div><hr /></div>`;

    // Row of each payment amount
    tlStr += `<div style="display:flex; justify-content:center;">
                <div style="width:${tlWidths.RowHead}px; font-weight:bold;">Amt</div>
                ${timelineDrawMult(aryTLPmts)}
            </div>`;

    // Arrow showing the value in correct year
    const countAllPmts = TLYearsShown(aryTLYears);
    function TLYearsShown(theArray) {
        const tempAry = theArray.map(function (item) { return (Number.isInteger(item) || item == ".") ? 1 : 0 });
        return tempAry.reduce((prev, cur) => prev + cur, 0);
    }
    //    let colSpacerEnd = tlWidths.MaxNumOfCols - countAllPmts + 1;// tlWidths.curNumOfCols + 1;
     //let arrowBoxCols = countAllPmts - 0.5 - returnsPVInColumn - 1 - colSpacerEnd; // All years - taper adjustment - empty years at start - empty last years

    let arrowBoxCols, startGapCols, arrowBoxText;
    if (tvmType == "pv") {
        // In order to put the arrow in the correct place, we need to know the flex box
        // column on the timeline that is one year before the first payment is made (y-1).
        // Normally that's column 1, but for delayed annuities it's 2 or 3 [Year 0, ..., y-1]
        let returnsPVInColumn = useCallerTL ? 0 : varY - 1; //FIX: Won't work for delayed annuities
        arrowBoxCols = countAllPmts - 0.5 - returnsPVInColumn - 2; // All years - taper adjustment - empty years at start - empty last years
        startGapCols = returnsPVInColumn + 1 + 0.5; // +0.5 to create a longer, more tapered pointer
        arrowBoxText = `Returns value<br>in year ${useCallerTL ? 0 : varY - 1}`;
    } else if (tvmType == "fv") {
        const returnsFVInColumn = countAllPmts - 1;
        const columnOfFirstPayment = 1; // FIX: Won't work for delayed annuities
        arrowBoxCols = countAllPmts - columnOfFirstPayment - 2; // All years - taper adjustment - empty years at start - empty last years
        startGapCols = columnOfFirstPayment;
        arrowBoxText = `Returns value in year ${varY + varN - 1}`;
    }
    if (showArrow) {
    tlStr += `<div style="display:flex; justify-content:left; margin-top:12px;">
                <div style="width:${tlWidths.RowHead}px;"></div>
                <div style="width:${tlWidths.OneYear * startGapCols}px"></div>
                <div id="annuity-arrow" style="width:${tlWidths.OneYear * arrowBoxCols}px";>
                    ${arrowBoxText}
                </div>
            </div>`;
    }
    // Close out entire timeline section
    tlStr += `</div>`;

    // So far the "arrow" is just a filled-in rectangle DIV. This adds pointer to the tip.
    jQuery('head').append(annuityPointer(tvmType));

    function annuityPointer(tvmType) {
        const minHeight = 40; // height of arrow box in pixels
        let w1 = tlWidths.OneYear;
        let arrowOffset = -1 * (w1 + minHeight / 2); // Each "border" on the pointer is half of the min-height of the arrow box (in pixels)

        let styleAnnuityArrow = {
            "position": "relative", "display": "flex", "justify-content": "center",
            "align-items": "center", "text-align": "center", "line-height": "1em",
            "min-height": `${minHeight}px`, "background": "black", "color": "#fff"
        }

        let styleAnnuityArrowBefore = {
            "content": `""`, "position": "absolute", "height": 0, "width": 0, "top": 0,
            "border": `${minHeight / 2}px solid transparent`
        }
        let styleAnnuityArrowAfter = {
            "content": `""`, "position": "absolute", "height": 0, "width": 0, "top": 0,
            "border": `${minHeight / 2}px solid transparent`
        }


        if (tvmType == "pv") {
            styleAnnuityArrowBefore["border-right"] = `${w1}px solid black`;
            styleAnnuityArrowBefore["left"] = `${arrowOffset}px`;
        } else if (tvmType == "fv") { // DOES NOT WORK YET
            styleAnnuityArrowAfter["left"] = `${tlWidths.OneYear * (arrowBoxCols)}px`;
            styleAnnuityArrowAfter["border-left"] = `${w1/2}px solid black`;
        }

        fConcatCSS = (id, cssObj) => {
            let theStr = id + '{';
            jQuery.each(cssObj, function (k, v) { theStr += (k + ":" + v + ";"); })
            return theStr + '}';
        }

        //let stylesToAdd = styleAnnuityArrow.concat(tvmType = "pv" ? styleAnnuityArrowBefore : styleAnnuityArrowAfter);
        let pointerStr = `<style> `;
        pointerStr += fConcatCSS(" #annuity-arrow", styleAnnuityArrow);
        pointerStr += tvmType == "pv" ? fConcatCSS(" #annuity-arrow:before", styleAnnuityArrowBefore) : "";
        pointerStr += tvmType == "fv" ? fConcatCSS(" #annuity-arrow:after", styleAnnuityArrowAfter) : "";
        pointerStr += `</style>`;
        return pointerStr;
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

function tvmtreeFVAnnuityStand(qv, objColors) {
    const formulaVars = {
        varY: "y",
        varN: "n",
        varRate: "i",
        varFV: "FV",
        varPMT: "C"
    };
    let myStr = `
        <div>
            <p style="margin-bottom:4px;">
                We're compounding a value forward (i.e., to the right on the timeline),
                so we'll start on the <b>Future Value</b> side of the TVM Decision Tree and start asking questions:
            </p>
            <p style="margin-left:20px; margin-top:4px;">
                Are we looking at one amount at two different points in time?
                Or is there a series of payments?
                <i>There is a series of payments.</i> 
            </p>
            <p style="margin-left:20px; margin-top:4px;">
                Are the payments variable, the same (constant), or growing at a constant rate?
                <i>They are constant.</i> 
            </p>
            <p>
                <!-- show img of chart with paths drawn -->
            </p>
            <p>
                This leads us to the formula for the <b>Future Value of a Standard Annuity</b>.
                The formula gives us the FV of the series of payments at the time the last
                payment is made. Since the last payment happens in Year ${qv.varY + qv.varN - 1},
                this returns the value of the annuity in Year ${qv.varY + qv.varN - 1}.<br>
                <span style="font-size:0.8em;">
                    Note that this is a different timing from the <i>present</i> value of an annuity formula.
                </span>
            </p>
            \\[
                varFV_{varY + varN - 1}={varPMT}_{varY} \\left( 
                    \\frac{ {(1+varRate)}^varN - 1}{varRate}
                \\right)
            \\]
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
    const theAns = fPVAnnuityStandard(qv);

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
        PV_{${varY - 1}} &= ${theAns}
        \\end{aligned}
    \\]

    <p>
        This can be interpreted as follows:
        The value in Year ${varY - 1} of ${varN} payments of \$${varPMT} each, starting in year ${varY},
        is the same as a lump sum of \$${uRound(theAns, 2).toLocaleString()} in year ${varY - 1}.
    </p>
`;
    myStr = addColorToVars(myStr, objColors);
    return fStrReplaceVarsWithVals(myStr, qv);
}


function solveFVAnnuityConstant_FV(qv, objColors) {
    const varPV = qv.varPV;
    const varFV = "FV";
    const varN = qv.varN;
    const varRate = qv.varRate;
    const varY = qv.varY;
    const varPMT = qv.varPMT;
    const varG = qv.varG;
    const varType = qv.varType;
    const theAns = fFVAnnuityStandard(qv);
    const fvInYear = varN + varY - 1;

    let myStr = `
    <p>
        Plug the variables into the formula and solve for the unknown term.
    </p>

    \\[
        \\begin{aligned}
            FV_{varY + varN - 1} &= {varPMT} \\left( 
                \\frac{ {(1+varRate)}^varN - 1}{varRate}
            \\right) \\\\
            {} \\\\
            FV_{${fvInYear}} &= {varPMT} \\left( 
                \\frac{ ${ftvm1Rate(qv)}^varN - 1}{varRate}
            \\right) \\\\
            {} \\\\
            FV_{${fvInYear}} &= {varPMT} \\left( 
                \\frac{ ${ftvmFVIF(qv,5)} - 1}{varRate}
            \\right) \\\\
            {} \\\\
            FV_{${fvInYear}} &= {varPMT} \\left( 
                \\frac{ ${ftvmFVANetNumerator(qv,5)} }{varRate}
            \\right) \\\\
            {} \\\\
            FV_{${fvInYear}} &= {varPMT} \\left( 
                { ${ftvmFVIFA(qv,5)} }
            \\right) \\\\
            {} \\\\
            FV_{${fvInYear}} &= ${theAns}
        \\end{aligned}
    \\]

    <p>
        This can be interpreted as follows:
        The value in year ${fvInYear} of ${varN} payments of \$${varPMT} each
        is the same as a lump sum of \$${uRound(theAns, 2).toLocaleString()} in year ${fvInYear}.
    </p>
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
// Returns HTML for variables in the Future Value of a standard annuity
function identifyFVVarsAnn(qv, objColors) {
    let myStr = `
    List the variables in the formula and write what is known and unknown.
    \\[
        \\begin{aligned}
            FV_{varY+varN -1} &= {varFV} \\\\
            C_{varY} &= {varPMT} \\\\
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