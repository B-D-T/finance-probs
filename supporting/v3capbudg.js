
function CapitalBudgeting($, objFromMain) {
    "use strict";
    let udf = objFromMain.udf, Finance = objFromMain.Finance;
    const self=this;

    this.CapBudgVar;

    // Create the object constructor function for DefineCapBudgVarible
    function DefineCapBudgVarible(strMacroCatg, strMicroCatg, strMeaning, strExpectedSign, strVarName, strCSSClassName) {
        this.macroCatg = strMacroCatg;
        this.microCatg = strMicroCatg;
        this.meaning = strMeaning;
        this.expectedSign = strExpectedSign;
        this.varName = strVarName;
        this.cssClassName = strCSSClassName;
    }

    const defsCapbudgVars = {
        "varIP": new DefineCapBudgVarible("IC", "IP", "Invoice price", "negative", "varIP", "ip"),
        "varATP": new DefineCapBudgVarible("IC", "ATP", "Adjustments to price", "negative", "varATP", "atp"),
        "varDTP": new DefineCapBudgVarible("IC", "DTP", "Discounts to price", "positive", "varDTP", "dtp"),
        "varEQP": new DefineCapBudgVarible("IC", "EQP", "Revenue from sale of existing equipment", "positive", "varEQP", "eqp"),
        "varTOE": new DefineCapBudgVarible("IC", "TOE", "Taxes paid on sales of existing asset above book value", "negative", "varTOE", "toe"),
        "varTCE": new DefineCapBudgVarible("IC", "TCE", "Taxes paid on sales of existing asset above below value", "positive", "varTCE", "tce"),
        "varENEWPRev": new DefineCapBudgVarible("ANE", "ENEWP", "Annual revenues from existing asset", "positive", "varENEWPRev", "enewp-rev"),
        "varENEWPExp": new DefineCapBudgVarible("ANE", "ENEWP", "Annual expenses from existing asset", "negative", "varENEWPExp", "enewp-exp"),
        "varENEPIRev": new DefineCapBudgVarible("ANE", "ENEPI", "Annual revenues from new asset", "positive", "varENEPIRev", "enepi-rev"),
        "varENEPIExp": new DefineCapBudgVarible("ANE", "ENEPI", "Annual expenses from new asset", "negative", "varENEPIExp", "enepi-exp"),
        "varSalvage": new DefineCapBudgVarible("ADT", "Salvage Value", "Expected revenue gained from new asset at end of its useful life", "positive", "varSalvage", "salvage-value"),
        "varLifespan": new DefineCapBudgVarible("ADT", "Lifespan", "Number of useful years expected from asset", "positive", "varLifespan", "lifespan"),
        "varTaxRate": new DefineCapBudgVarible("ADT", "TAX", "Tax rate for organization", "positive", "varTaxRate", "tax-rate"),
        "varDiscRate": new DefineCapBudgVarible("All", "All", "Cost of capital (discount rate)", "positive", "varDiscRate", "discount-rate"),
        "calcIC": new DefineCapBudgVarible("IC", "IC", "Total initial cost", "negative", "calcIC", "ic"),
        "calcENEPI": new DefineCapBudgVarible("ANE", "ENEPI", "Annual profit from new asset", "positive", "calcENEPI", "enepi-total"),
        "calcENEWP": new DefineCapBudgVarible("ANE", "ENEWP", "Annual profit from existing asset", "negative", "calcENEWP", "enewp-total"),
        "calcENE": new DefineCapBudgVarible("ANE", "ENE", "Pretax change in earnings", "unknown", "calcENE", "ene-total"),
        "calcANE": new DefineCapBudgVarible("ANE", "ANE", "Additional net earnings", "unknown", "calcANE", "ane-total"),
        "calcDepAmt": new DefineCapBudgVarible("ADT", "DEP", "Annual depreciation amount of new asset", "positive", "calcDepAmt", "dep-amt"),
        "calcDepTaxSavings": new DefineCapBudgVarible("ADT", "DEP", "Annual tax savings from depreciation", "positive", "calcDepTaxSavings", "dep-tax-savings")
    }
    //const aryVarValues = Object.keys(defsCapbudgVars).map(key => defsCapbudgVars[key].cssClassName); // Create array of values for a given variable

    // Create an array of values per year
    function capbudgTimeline(objCBVars, varAbbr) {
        const periods = objCBVars.varLifespan + 1;
        let tl = Array(periods);
        tl[0] = objCBVars.calcIC;
        switch (varAbbr) {
            case "IC":
                tl.fill(0, 1, periods);
                break;
            case "ANE":
                tl.fill(objCBVars.calcANE, 1, periods);
                break;
            case "ADT":
                tl.fill(objCBVars.calcDepTaxSavings, 1, periods);
                break;
            case "ICF":
                tl.fill(objCBVars.calcANE + objCBVars.calcDepTaxSavings, 1, periods);
                break;
            case "ICFPV":
                let tlICF = tl;
                tlICF.fill(objCBVars.calcANE + objCBVars.calcDepTaxSavings, 1, periods); // Start with the ICF timeline, then discount those back
                tl = tlInPV(tlICF, objCBVars.varDiscRate);
                break;
            default:
                tl.fill(0, 1, periods);
                break;
        };
        return tl;
    }

    // This takes a timeline of values and returns a timeline of their PVs. This is needed for calculating NPV and the discounted payback period.
    const tlInPV = (aryCashflow, discRate = 0) => aryCashflow.map((val, idx) => val / Math.pow(1 + discRate, idx))

    // This takes an instance of CapBudgVar and returns the IRR 
    // Or, if IRR<0, it returns a text message saying it couldn't find a positive IRR
    self.financeIRR = (aryCashflow) => Finance.IRR(aryCashflow)
    // this.financeIRR = financeIRR;

    // This calculates the Payback Period for a series of cash flows.
    // The discRate is optional; if it's included, all payments are discounted before the payback period is calculated
    const financePaybackPeriod = (aryCashflow, discRate = 0) => Finance.PaybackPeriod(tlInPV(aryCashflow, discRate))

    const financeNPV = (aryCashflow) => aryCashflow.reduce((a, b) => a + b, 0)

    // Create the object constructor function for CapBudgVars
    // To use this, create a new object and pass it an object with any variables that you have.
    // It will use the arguments if present. If a varXXX variable is undefined, the code substitutes using the default value.
    // If a calcXXX variable is undefined, the code uses the default value or, if blnHideCalcs=false, it calculates the answers
    // const myVar = new CapBudgVar({varATP: -2000}, true) [true or omitted] --returns--> {varIP:0, varATP:-2000, calcIC:0, ...}
    // const myVar = new CapBudgVar({varATP: -2000}, false) --returns--> {varIP:0, varATP:-2000, calcIC: -2000, ...}
    // const myVar = new CapBudgVar({varATP: -2000, calcIC:500}) --returns--> {varIP:0, varATP:-2000, calcIC:500, ...}
    // You typically won't input the tlXXX or ansXXX variables, but they work the same as the rest just in case you do pass that value to the constructor.
    function CapBudgVar(
        {
            varIP, varATP, varDTP, varEQP, varTOE, varTCE, varENEWPRev, varENEWPExp, varENEPIRev, varENEPIExp, varSalvage, varLifespan, varTaxRate, varDiscRate,
            calcIC, calcENEPI, calcENEWP, calcENE, calcANE, calcDepAmt, calcDepTaxSavings,
            tlIC, tlANE, tlADT, tlICF, tlICFPV,
            ansPaybackPeriodReg, ansPaybackPeriodDisc, ansIRR, ansNPV,
            decisionPaybackPerReg, decisionPaybackPerDisc, decisionIRR, decisionNPV
        }, blnHideCalcs = true) {

        this.varIP = varIP || 0;
        this.varATP = varATP || 0;
        this.varDTP = varDTP || 0;
        this.varEQP = varEQP || 0;
        this.varTOE = varTOE || 0;
        this.varTCE = varTCE || 0;
        this.varENEWPRev = varENEWPRev || 0;
        this.varENEWPExp = varENEWPExp || 0;
        this.varENEPIRev = varENEPIRev || 0;
        this.varENEPIExp = varENEPIExp || 0;
        this.varSalvage = varSalvage || 0;
        this.varLifespan = varLifespan || 0;
        this.varTaxRate = varTaxRate || 0;
        this.varDiscRate = varDiscRate || 0;
        this.calcIC = calcIC || (blnHideCalcs ? 0 : this.varIP + this.varATP + this.varDTP + this.varEQP + this.varTOE + this.varTCE);
        this.calcENEPI = calcENEPI || (blnHideCalcs ? 0 : this.varENEPIRev + this.varENEPIExp);
        this.calcENEWP = calcENEWP || (blnHideCalcs ? 0 : this.varENEWPRev + this.varENEWPExp);
        this.calcENE = calcENE || (blnHideCalcs ? 0 : this.calcENEPI - this.calcENEWP);
        this.calcANE = calcANE || (blnHideCalcs ? 0 : this.calcENE * (1 - this.varTaxRate));
        this.calcDepAmt = calcDepAmt || (blnHideCalcs ? 0 : (-1 * this.varIP - this.varSalvage) / this.varLifespan);
        this.calcDepTaxSavings = calcDepTaxSavings || (blnHideCalcs ? 0 : (this.calcDepAmt * this.varTaxRate));
        this.tlIC = tlIC || (blnHideCalcs ? [] : capbudgTimeline(this, "IC"));
        this.tlANE = tlANE || (blnHideCalcs ? [] : capbudgTimeline(this, "ANE"));
        this.tlADT = tlADT || (blnHideCalcs ? [] : capbudgTimeline(this, "ADT"));
        this.tlICF = tlICF || (blnHideCalcs ? [] : capbudgTimeline(this, "ICF"));
        this.tlICFPV = tlICFPV || (blnHideCalcs ? [] : capbudgTimeline(this, "ICFPV"));
        this.ansIRR = ansIRR || (blnHideCalcs ? '' : self.financeIRR(capbudgTimeline(this, "ICF")));
        this.ansPaybackPeriodReg = ansPaybackPeriodReg || (blnHideCalcs ? '' : financePaybackPeriod(capbudgTimeline(this, "ICF")));
        this.ansPaybackPeriodDisc = ansPaybackPeriodDisc || (blnHideCalcs ? '' : financePaybackPeriod(capbudgTimeline(this, "ICF"), this.varDiscRate));
        this.ansNPV = ansNPV || (blnHideCalcs ? '' : financeNPV(capbudgTimeline(this, "ICFPV")));
        this.decisionPaybackPerReg = decisionPaybackPerReg || (blnHideCalcs ? '' : decisionText(this).PaybackPerReg);
        this.decisionPaybackPerDisc = decisionPaybackPerDisc || (blnHideCalcs ? '' : decisionText(this).PaybackPerDisc);
        this.decisionIRR = decisionIRR || (blnHideCalcs ? '' : decisionText(this).IRR);
        this.decisionNPV = decisionNPV || (blnHideCalcs ? '' : decisionText(this).NPV);
    }
    this.CapBudgVar = CapBudgVar;

    function decisionText(objCBVars) {
        // Constructor for the Decision Methods
        function DecisionMethod({ method, prompt, threshold, compareValue, calcTest, calcTestOutcome, decisionYes, decisionNo, decisionOther }) {
            this.method = method || '';
            this.prompt = prompt || '';
            this.threshold = threshold;
            this.compareValue = compareValue; // The student's answer for this question
            this.calcTest = calcTest || ''; // This can be anything used to produce an answer. It feeds the calcTestOutcome.
            this.calcTestOutcome = calcTestOutcome || false; // This is a function that must return true/false
            this.decisionYes = decisionYes || '';
            this.decisionNo = decisionNo || '';
            this.decisionOther = decisionOther || '';
            this.decisionResult = calcTestOutcome ? this.decisionYes : this.decisionNo || '';
        }

        return {
            PaybackPerReg: new DecisionMethod({
                method: 'PaybackPerReg',
                prompt: 'Accept using normal payback?',
                threshold: objCBVars.varLifespan,
                get calcTest() { return financePaybackPeriod(capbudgTimeline(objCBVars, "ICF")) },
                get calcTestOutcome() { return this.calcTest < this.threshold },
                get decisionYes() { return `Yes, but only if your timeframe is less than ${udf.uRound(this.calcTest, 4)} years.` },
                decisionNo: `No, it does not pay back within the timeframe.`,
            }),
            PaybackPerDisc: new DecisionMethod({
                method: 'PaybackPerDisc',
                prompt: 'Accept using discounted payback?',
                threshold: objCBVars.varLifespan,
                get calcTest() { return financePaybackPeriod(capbudgTimeline(objCBVars, "ICFPV")) },
                get calcTestOutcome() { return this.calcTest < this.threshold },
                get decisionYes() { return `Yes, but only if your timeframe is less than ${udf.uRound(this.calcTest, 4)} years.` },
                decisionNo: `No, it does not pay back within the timeframe.`,
            }),
            IRR: new DecisionMethod({
                method: 'IRR',
                prompt: 'Accept using IRR?',
                threshold: objCBVars.varDiscRate,
    // get calcTest() { return this.financeIRR(capbudgTimeline(objCBVars, "ICF")) },
                get calcTest() { return self.financeIRR(capbudgTimeline(objCBVars, "ICF")) },
                get calcTestOutcome() { return this.calcTest >= this.threshold },
                get decisionYes() { return `Yes, because the IRR is >= the cost of capital.` },
                decisionNo: `No, because the IRR is < the cost of capital.`
            }),
            NPV: new DecisionMethod({
                method: 'NPV',
                prompt: 'Accept based on the NPV?',
                threshold: 0,
                get calcTest() { return financeNPV(capbudgTimeline(objCBVars, "ICF")) }, // =IF(D63=0,"Yes, although the NPV of $0 means you're only just breaking even.")))
                get calcTestOutcome() { return this.calcTest >= this.threshold },
                get decisionYes() { return (udf.uRound(this.calcTest,0) == udf.uRound(this.threshold,0)) ? "Yes, although the NPV of 0 means you're only just breaking even." : `Yes, because the NPV is positive.` },
                decisionNo: `No, since the NPV is negative.`
            })
        };
    }



    // This builds an HTML table from an array of cash flows starting in year 0
    this.htmlCashFlowTable = function(aryCashFlows){
        let aryYears = aryCashFlows.map((elem, idx)=>`<div class="entry year">${idx}</div>`);
        let aryAmts = aryCashFlows.map((elem)=>`<div class="entry amt">${elem.$$()}</div>`);
        return [
            `<div class="cash-flow-table">`,
                `<div class="years-container">`,
                    `<div class="heading year">Year</div>`,
                    aryYears.join(''),
                `</div>`,
                `<div class="amts-container">`,
                    `<div class="heading amt">Value</div>`,
                    aryAmts.join(''),
                `</div>`,
            `</div>`
        ].join('');
    }






    // I need to edit the HTML like this because I can't easily access it once it's loaded.
    // *** Notice that 'answerbox"' needs to be the last class listed, and have type="number" right after it. I don't know that it's so rigid, but it'll do for now.
    const cssAnsboxSolutions = (strHTML) => strHTML.replace(/ansbox" type="number"/g, '"ansbox solution" type="text"');

    this.htmlRespPaybackPeriodReg = function(includeAnswers=false, objAns={}){
        const dispLifespan = objAns.varLifespan ||'the visible years';
        let tableText = `
            <div class="capbudg-resp-area">
                <div class="prompt">
                    <p class="prompt-text payback-period">
                        What is the regular (normal) Payback Period for the project?
                    </p>
                    <p class="payback-period">If the payback period is beyond the timeline (i.e., greater than ${dispLifespan}), input a 0 in this blank</p>
                </div>
                <div class="resp">
                    <input class="payback-reg ansbox" type="number" placeholder="Regular payback period" value="${includeAnswers ? objAns.ansPaybackPeriodReg.toFixed(5).toLocaleString('en-US') : ''}">
                </div>
            </div>
        `;
        tableText = includeAnswers ? cssAnsboxSolutions(tableText) : tableText
        return tableText;
    }

    this.htmlRespPaybackPeriodDisc = function(includeAnswers=false, objAns={}){
        const dispLifespan = objAns.varLifespan ||'the visible years';
        const dispAnsPaybackPeriodDisc = objAns.dispAnsPaybackPeriodDisc || '';
        let tableText = `
            <div class="capbudg-resp-area">
                <div class="prompt">
                    <p class="prompt-text payback-period">
                        What is the discounted Payback Period for the project?
                    </p>
                    <p class="payback-period">If the discounted payback period is beyond the timeline (i.e., greater than ${dispLifespan}), input a 0 in this blank</p>
                </div>
                <div class="resp">
                    <input class="payback-disc ansbox" type="number" placeholder="Discounted payback period" value="${includeAnswers ? dispAnsPaybackPeriodDisc : ''}">
                </div>
            </div>
        `;
        if (includeAnswers) {
            tableText = cssAnsboxSolutions(tableText);
        }
        return tableText;
    }

    this.htmlRespNPV= function(includeAnswers=false, objAns={}){
        const dispLifespan = objAns.varLifespan ||'the visible years';
        const dispAns = objAns.dispAnsNPV || '';
        let tableText = `
            <div class="capbudg-resp-area">
                <div class="prompt">
                    <p class="prompt-text npv">
                        What is the net present value (NPV) for the project?
                    </p>
                </div>
                <div class="resp">
                    <input class="npv ansbox" type="number" placeholder="Net Present value" value="${includeAnswers ? dispAns : ''}">
                </div>
            </div>
        `;
        if (includeAnswers) {
            tableText = cssAnsboxSolutions(tableText);
        }
        return tableText;
    }

    this.htmlRespIRR= function(includeAnswers=false, objAns={}){
        const dispAns = objAns.dispAnsIRR || objAns.ansIRR || '';
        let tableText = `
            <div class="capbudg-resp-area">
                <div class="prompt">
                    <p class="prompt-text irr">
                        What is the IRR for this series of cash flows?
                    </p>
                    <p class="irr">If the IRR cannot be determined, input a 0 in this blank</p>
                </div>
                <div class="resp">
                    <input class="irr ansbox" type="number" placeholder="Enter IRR as a decimal (4+ decimal places)" value="${includeAnswers ? dispAns : ''}">
                </div>
            </div>
        `;
        if (includeAnswers) {
            tableText = cssAnsboxSolutions(tableText);
        }
        return tableText;
    }
    // Returns HTML string of a blank variables table
    this.htmlVariableTable = function(includeAnswers = false, objAns={}){

        let tableText = `
                <div class="capbudg-variables-container">
                    <div class="row-top-heading">
                        <div>Static values</div>
                    </div>
                    <div class="variable-rows">
                        <div class="row-section-heading">
                            <div class="catg">Category</div>
                            <div class="meaning">Meaning</div>
                            <div class="value">Value</div>
                        </div>
                        <div class="row-variable ip">
                            <div class="catg">
                                IP
                            </div>
                            <div class="meaning">
                                Invoice price
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" placeholder="Write as negative" value="${includeAnswers ? objAns.varIP.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable atp">
                            <div class="catg">
                                ATP
                            </div>
                            <div class="meaning">
                                Adjustments to price
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" placeholder="Write as negative" value="${includeAnswers ? objAns.varATP.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable eqp">
                            <div class="catg">
                                EQP
                            </div>
                            <div class="meaning">
                                Revenue from sale of existing equipment
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" value="${includeAnswers ? objAns.varEQP.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable enewp-rev">
                            <div class="catg">
                                ENEWP
                            </div>
                            <div class="meaning">
                                Annual revenues from existing asset
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" value="${includeAnswers ? objAns.varENEWPRev.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable enewp-exp">
                            <div class="catg">
                                ENEWP
                            </div>
                            <div class="meaning">
                                Annual expenses from existing asset
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" placeholder="Write as negative" value="${includeAnswers ? objAns.varENEWPExp.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable enepi-rev">
                            <div class="catg">
                                ENEPI
                            </div>
                            <div class="meaning">
                                Annual revenues from new asset
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" value="${includeAnswers ? objAns.varENEPIRev.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable enepi-exp">
                            <div class="catg">
                                ENEPI
                            </div>
                            <div class="meaning">
                                Annual expenses from new asset
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" placeholder="Write as negative" value="${includeAnswers ? objAns.varENEPIExp.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable salvage-value">
                            <div class="catg">
                                Salvage value
                            </div>
                            <div class="meaning">
                                Expected revenue gained from new asset at end of its useful life
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" value="${includeAnswers ? objAns.varSalvage.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable lifespan">
                            <div class="catg">
                                Lifespan
                            </div>
                            <div class="meaning">
                                Number of useful years expected from asset
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" value="${includeAnswers ? objAns.varLifespan : ''}">
                            </div>
                        </div>
                        <div class="row-variable tax-rate">
                            <div class="catg">
                                TAX
                            </div>
                            <div class="meaning">
                                Tax rate for organization
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" placeholder="Write as decimal" value="${includeAnswers ? udf.uRound(objAns.varTaxRate,4) : ''}">
                            </div>
                        </div>
                        <div class="row-variable discount-rate">
                            <div class="catg">
                                ALL
                            </div>
                            <div class="meaning">
                                Cost of capital
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" placeholder="Write as decimal" value="${includeAnswers ? udf.uRound(objAns.varDiscRate,4) : ''}">
                            </div>
                        </div>
                    </div>

                    <div class="row-top-heading">
                        <div>Calculated values</div>
                    </div>
                    <div class="variable-rows">
                        <div class="row-section-heading">
                            <div class="catg">Category</div>
                            <div class="meaning">Meaning</div>
                            <div class="value">Value</div>
                        </div>
                        <div class="row-variable ic">
                            <div class="catg">
                                IC
                            </div>
                            <div class="meaning">
                                Total initial cost
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" placeholder="Write as negative" value="${includeAnswers ? objAns.calcIC.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable enepi-total">
                            <div class="catg">
                                ENEPI
                            </div>
                            <div class="meaning">
                                Annual profit from new asset
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" value="${includeAnswers ? objAns.calcENEPI.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable enewp-total">
                            <div class="catg">
                                ENEWP
                            </div>
                            <div class="meaning">
                                Annual profit from existing asset
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" value="${includeAnswers ? objAns.calcENEWP.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable ene-total">
                            <div class="catg">
                                ENE
                            </div>
                            <div class="meaning">
                                Pretax change in earnings
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" value="${includeAnswers ? objAns.calcENE.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable ane-total">
                            <div class="catg">
                                ANE
                            </div>
                            <div class="meaning">
                                Additional net earnings
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" value="${includeAnswers ? objAns.calcANE.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable dep-amt">
                            <div class="catg">
                                DEP
                            </div>
                            <div class="meaning">
                                Annual depreciation amount of new asset
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" placeholder="Write as positive" value="${includeAnswers ? objAns.calcDepAmt.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                        <div class="row-variable dep-tax-savings">
                            <div class="catg">
                                DEP
                            </div>
                            <div class="meaning">
                                Annual tax savings from depreciation
                            </div>
                            <div class="value">
                                <input class="ansbox" type="number" value="${includeAnswers ? objAns.calcDepTaxSavings.toLocaleString('en-US') : ''}">
                            </div>
                        </div>
                    </div>

                </div>
            `;
    
        // I need to edit the HTML like this because I can't easily access it once it's loaded
        if (includeAnswers) {
            tableText = cssAnsboxSolutions(tableText);
            tableText = tableText.replace(/-heading"/g, '-heading solution"'); // Replaces both Top and Section headers
        }
        return tableText;
    }


}
console.log("capbudg.js loaded.");

// const myVar = new CapBudgVar(
//     {
//         varIP: -170000,
//         varATP: -9000,
//         varEQP: 4900,
//         varENEWPRev: 168000,
//         varENEWPExp: -1600,
//         varENEPIRev: 192000,
//         varENEPIExp: -2000,
//         varSalvage: 7000,
//         varLifespan: 8,
//         varTaxRate: 0.30,
//         varDiscRate: 0.10
//     }, false);
// console.log(myVar);



