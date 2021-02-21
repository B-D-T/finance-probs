function fnQues487(objFromMainQues) {

    let quesVars = {
        "varRate": uRand(.04, .10, .01),
        "AmtYr00": uRand(10000000, 18000000, 1000000),
        "AmtYr01": uRand(2000000, 5000000, 100000),
        "AmtYr02": uRand(2000000, 5000000, 100000),
        "AmtYr03": uRand(2000000, 5000000, 100000),
        "AmtYr04": uRand(2000000, 5000000, 100000),
        "AmtYr05": uRand(2000000, 5000000, 100000)
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcPVYr00: AmtYr00,
            calcPVYr01: fPVSinglePmt({ varRate, "varN": 1, "varFV": AmtYr01 }),
            calcPVYr02: fPVSinglePmt({ varRate, "varN": 2, "varFV": AmtYr02 }),
            calcPVYr03: fPVSinglePmt({ varRate, "varN": 3, "varFV": AmtYr03 }),
            calcPVYr04: fPVSinglePmt({ varRate, "varN": 4, "varFV": AmtYr04 }),
            calcPVYr05: fPVSinglePmt({ varRate, "varN": 5, "varFV": AmtYr05 }),

            get calcTheAns() {
                return this.calcPVYr00
                    + this.calcPVYr01
                    + this.calcPVYr02
                    + this.calcPVYr03
                    + this.calcPVYr04
                    + this.calcPVYr05
            }
        };
        createEDVarInScope(calcVars);

        let displayVars = {

        };
        createEDVarInScope(displayVars);

        jQuery.extend(quesVars, calcVars, displayVars);
        storeQuesRespVars(quesVars, calcTheAns);
        return fillPage();
    }

    function fillPage() {

        // Filter the object to show only the annual amounts
        const contractAmt = Object.keys(quesVars)
            .filter(key => key.startsWith("AmtYr"))
            .reduce((obj, key) => {
                return { ...obj, [key.slice(5)]: quesVars[key] };
            }, {});

        // Create object with the full value of the variable ready for display
        const dispFull = Object.fromEntries(
            Object.entries(contractAmt).map( ([key, curVal], idx) => ["AmtYr"+key, `\$`+curVal.toLocaleString('en-US')] )
        );

        // Create object with the full value of the variable ready for display
        const dispTL = Object.fromEntries(
            Object.entries(contractAmt).map( ([key, curVal], idx) => [parseInt(key), curVal / 1000000] )
        );

        let tlYears = [Object.keys(dispTL), Object.values(dispTL)]
        // The timeline builder requires 9 years of payments, so I added these to fill out the array
        const maxTLYear = Math.max(tlYears[0]);
        for (let colCount = tlYears[0].length; colCount < 9; colCount++) {
            const mostRecTLYear = Math.max(tlYears[0]);
            const nextTLYear = (mostRecTLYear == maxTLYear) ? mostRecTLYear + 1 : ``;
            tlYears[0].push(nextTLYear);
            tlYears[1].push(``);
        }

        let obj = {};

        obj.ansBoxMessage = ansBoxMessages("writeOutNums");

        obj.stem = probDisplay(quesVars)`
        <p>
            What is the present value (in year 0) of the following contract,
            assuming a rate of ${uRound(varRate * 100, 4)}%?
        </p>
        <style>.yearlyContracts li{margin-top:0.5em;}</style>
        <ul class="yearlyContracts">
            <li>${dispFull.AmtYr00} signing bonus (paid in year 0)</li>
            <li>${dispFull.AmtYr01} in year 1</li>
            <li>${dispFull.AmtYr02} in year 2</li>
            <li>${dispFull.AmtYr03} in year 3</li>
            <li>${dispFull.AmtYr04} in year 4</li>
            <li>${dispFull.AmtYr05} in year 5</li>
        </ul>
        `


        obj.solution = probDisplay(quesVars)`
        <p>
            This problem has a series of payments,
            but they are <b>not</b> constant or growing at a constant rate.
            Thus, we need to determine the PV of each payment in year 0,
            then add up all those PVs to determine the total contract value.
            Here are the annual payment amounts on the timeline (in millions).
            ${timelineAnnuity(quesVars, "pv", tlYears, false)}
        </p>
        <p>
            Since each value is a lump sum happening in that year,
            we'll use the PV of a single payment formula on each of the 
            the values to determine their worth in Year 0.
        </p>
        <p>
            The full steps for each year are done out below,
            but to save you some scrolling, here is the total contract value
            in year 0 based on the PVs of the annual amounts.
        </p>
        <p>
        \\[
            \\begin{aligned}
                \\text{Year 0} &= \\$${parseInt(calcPVYr00).toLocaleString('en-US')} \\\\
                \\text{+ Year 1} &= \\$${parseInt(calcPVYr01).toLocaleString('en-US')} \\\\
                \\text{+ Year 2} &= \\$${parseInt(calcPVYr02).toLocaleString('en-US')} \\\\
                \\text{+ Year 3} &= \\$${parseInt(calcPVYr03).toLocaleString('en-US')} \\\\
                \\text{+ Year 4} &= \\$${parseInt(calcPVYr04).toLocaleString('en-US')} \\\\
                \\text{+ Year 5} &= \\$${parseInt(calcPVYr05).toLocaleString('en-US')} \\\\
                \\text{Total } PV_0 \\text{ of the contact} &= \\bold{\\$${parseInt(calcTheAns).toLocaleString('en-US')}}
            \\end{aligned}

        \\]
        </p>
        <h3 style="margin-top:2em;">Year 0</h3>
        <p>
        This payment is already in the present value,
        so we do not need to do anything with it.
        </p>
            \\[
                PV_{0} = ${AmtYr00}
            \\]
        <h3>Year 1</h3>
        ${solvePVSinglePmt_PV({"varFV": AmtYr01, "varN": 1, "varRate":varRate, varY:1})}
        <h3>Year 2</h3>
        ${solvePVSinglePmt_PV({"varFV": AmtYr02, "varN": 2, "varRate":varRate, get varY() {return this.varN}})}
        <h3>Year 3</h3>
        ${solvePVSinglePmt_PV({"varFV": AmtYr03, "varN": 3, "varRate":varRate, get varY() {return this.varN}})}
        <h3>Year 4</h3>
        ${solvePVSinglePmt_PV({"varFV": AmtYr04, "varN": 4, "varRate":varRate, get varY() {return this.varN}})}
        <h3>Year 5</h3>
        ${solvePVSinglePmt_PV({"varFV": AmtYr05, "varN": 5, "varRate":varRate, get varY() {return this.varN}})}

        `
        return obj;

    } // end of fillPage
}

// received from addOnPageSubmit
function fnQuesResp(objPageSubmit) { 
    const qtrxDivID = "#divQues" + objPageSubmit.strQuesNum;
    if (!(jQuery(`${qtrxDivID}-response`).length)) {
        let objRespFeedback = objPageSubmit;
        return setEDQuesRespVars(objRespFeedback);
    }
}