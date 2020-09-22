

// -----Input TVM functions------------------------------------------
//  You'll probably only call either fPresentValue or fFutureValue
//  Everything else is just supporting.
// 
//  These are modeled on the Excel financial functions.
//  However, I added variables that are useful to other TVM calcs
//  and tweaked the functionality where needed. For example...
//  ..If startper <>1, type is irrelevant
//  ..If nper is not defined, treat it like a perpetuity
//  ..The functions accept positive numbers and return positive numbers.
//

//  This receives an object of TVM arguments from the caller and recreates the variables within function scope.
//  If there's no key by that name passed by the caller (i.e., the caller didn't pass that variable),
//  the code assigns a default value to the variable.

// These were ported from tylermacros.pg.
// ------------------------------------------------------------------

// I'm building this as a pseudo module... because I don't really know how to get modules to work correctly.


// Default values
function fSetLocalVar(tvmPart, curVal) {
    const objTVMDefaults = {
        "rate": 0, "nper": 0, "pmt": 0, "fv": 0, "pv": 0, "growthrate": 0,
        "startper": 1, // If startper doesn't exist, we assume that annuity payments start at the end of year 1
        "type": 0, // If startper is anything OTHER than 1, that means it rules and we should ignore the varType argument.
    }
    return !(curVal === "undefined") ? objTVMDefaults[tvmPart] : curVal;
}


// ##### =PV (rate, nper, pmt, [fv], [type], [growthrate], [startper]) ##### 
function fPresentValue(qv) {

    const rate = qv.rate || fSetLocalVar("rate", qv.varRate);
    const nper = qv.nper || fSetLocalVar("nper", qv.varN);
    const pmt = qv.pmt || fSetLocalVar("pmt", qv.varPMT);
    const fv = qv.fv || fSetLocalVar("fv", qv.varFV);
    const pv = qv.pv || fSetLocalVar("pv", qv.varPV);
    const growthrate = qv.growthrate || fSetLocalVar("growthrate", qv.varG);
    const startper = qv.startper || fSetLocalVar("startper", qv.varY);
    const type = (startper !== 1) ? 0 : qv.type || fSetLocalVar("type", qv.varType); // if varY is anything OTHER than 1, that means it rules and we should ignore the varType argument.



    // ---Step through the TVM decision tree-------
    // With all functions, I pass an object with the key:value pairs, then recreate the variables within the subroutine.
    // I could just pass the variables in order and read them based on the position,
    // but I wanted to be explicit with the variable names to reduce the chance of mistakes.

    // Single payment
    if (pmt == 0 && fv != 0) { return fPVSinglePmt({ rate, nper, fv }); }

    // 	Perpetuity (if nper is undefined or 0)
    if (!nper) {
        // Store the present value of a standard perpetuity
        const perpetuityValue = fPVPerpetuityStandard({ rate, pmt, growthrate });
        return fPVAnnuityTiming({ rate, type, startper, "lumpsum": perpetuityValue });
    }

    // 	Annuities
    if (pmt != 0 && fv == 0) {

        // Growing Annuities
        if (growthrate != 0) {
            // Store the present value of a standard growing annuity
            const growingAnnuityValue = fPVGrowingAnnuityStandard({ rate, nper, pmt, growthrate });
            return fPVAnnuityTiming({ rate, type, startper, "lumpsum": growingAnnuityValue });
        }

        // Annuities
        if (growthrate == 0) {
            // Store the present value of a standard annuity
            const annuityValue = fPVAnnuityStandard({ rate, nper, pmt });
            return fPVAnnuityTiming({ rate, type, startper, "lumpsum": annuityValue });
        }

    }

    // Bonds (paid annually)
    if (pmt != 0 && fv != 0) {
        // Run the code twice: 1x for the coupon payment and 1x for the lumpsum (par value)
        const pvCoupons = fPresentValue({ rate, nper, pmt, "fv": 0, type, growthrate, startper });
        const pvParValue = fPresentValue({ rate, nper, "pmt": 0, fv, type, startper });
        return pvCoupons + pvParValue;
    }

    return `The fPresentValue calcs didn't work: (varRate=${rate}, varN=${nper}, varPMT=${pmt}, varFV=${fv}, varType=${type}, varG=${growthrate}, varY=${startper})`;


    // Adjust present value of annuity to account for PV Annuity Due and PV Delayed Annuities
    function fPVAnnuityTiming(tvm) {
        const rate = tvm.rate, lumpsum = tvm.lumpsum, type = tvm.type, startper = tvm.startper;

        // If this is an Annuity Due (first payment in year 0; type=1), the annuity value returned is in year -1.
        // We use fFVSinglePmt to compound the value forward by 1 year.
        if (startper == 0 || type == 1) { // Annuity due
            return fFVSinglePmt({ rate, "nper": 1, "pv": lumpsum });
        } else if (startper > 1) { // Delayed annuity
            return fPVSinglePmt({ rate, "nper": startper - 1, "fv": lumpsum });
        } else {
            return lumpsum;
        }
    }
}

// ##### =FV (rate, nper, pmt, [pv], [type], [growthrate], [startper]) ##### 
function fFutureValue(qv) {
    //  This works just like the fPresentValue function above, so I omitted the comments here.

    const rate = qv.rate || fSetLocalVar("rate", qv.varRate);
    const nper = qv.nper || fSetLocalVar("nper", qv.varN);
    const pmt = qv.pmt || fSetLocalVar("pmt", qv.varPMT);
    const fv = qv.fv || fSetLocalVar("fv", qv.varFV);
    const pv = qv.pv || fSetLocalVar("pv", qv.varPV);
    const growthrate = qv.growthrate || fSetLocalVar("growthrate", qv.varG);
    const startper = qv.startper || fSetLocalVar("startper", qv.varY);
    const type = (startper !== 1) ? 0 : qv.type || fSetLocalVar("type", qv.varType); // if varY is anything OTHER than 1, that means it rules and we should ignore the varType argument.


    // Single payment
    if (pmt == 0 && pv != 0) { return fFVSinglePmt(rate, nper, pv); }

    // Annuities
    if (pmt != 0 && pv == 0) {

        if (growthrate != 0) {
            const growingAnnuityValue = fFVGrowingAnnuity({ rate, nper, pmt, growthrate });
            return fFVAnnuityTiming({ rate, "lumpsum": growingAnnuityValue, type, startper });
        }

        if (growthrate == 0) {
            const annuityValue = fFVAnnuityStandard({ rate, nper, pmt });
            return fFVAnnuityTiming({ rate, "lumpsum": annuityValue, type, startper });
        }
    }

    // Bonds (paid annually)
    if (pmt != 0 && fv != 0) { //Notice that this is FV instead of PV
        const fvCoupons = fFutureValue({ rate, nper, pmt, "pv": 0, type, growthrate, startper });
        const fvParValue = fv;
        return fvCoupons + fvParValue;
    }

    return `The fFutureValue calcs didn't work: (varRate=${rate}, varN=${nper}, varPMT=${pmt}, varPV=${pv}, varType=${type}, varG=${growthrate}, varY=${startper})`;
}

// Adjust future value of annuity to account for FV Annuity Due
function fFVAnnuityTiming(tvm) {
    const rate = tvm.rate, lumpsum = tvm.lumpsum, type = tvm.type, startper = tvm.startper;

    // FV of Annuity due
    if (startper == 0 || type == 1) {
        return fFVSinglePmt({ rate, "nper": 1, "pv": lumpsum });
    } else {
        // The FV of an annuity formulas return the value in the final year of the annuity,
        // so I don't need to worry about Delayed Annuities vs Standard Annuities.
        return lumpsum;
    }
}


// ------TVM calculations---------------------------------------------
//  There are eight 'core' TVM formulas. We use these to answer all other problems.
//  The caller passes the arguments needed for each specific calculation.
// 
//  To keep things simple, I used the same variable names as the Excel variables.
//  They didn't have to match, but it's convenient.
//  Variables are scoped locally, so I can reuse the variable names without an issue.
// -------------------------------------------------------------------


// ---Present value formulas----------------
// 
// -----------------------------------------

// PV of a single payment
function fPVSinglePmt(tvm) {
    const fv = tvm.fv, rate = tvm.rate, nper = tvm.nper;
    return fv * ftvmPVIF({ rate, nper });
}

// PV of a standard perpetuity
function fPVPerpetuityStandard(tvm) {
    const rate = tvm.rate; pmt = tvm.pmt; growthrate = tvm.growthrate;
    return pmt / ftvmRateSpreadIntrGrowth({ rate, growthrate });
}

// PV of a standard annuity
function fPVAnnuityStandard(tvm) {
    const rate = tvm.rate, nper = tvm.nper, pmt = tvm.pmt;
    return pmt * ftvmPVIFA({ rate, nper });
}

// PV of a growing standard annuity
function fPVGrowingAnnuityStandard(tvm) {
    const rate = tvm.rate, nper = tvm.nper, pmt = tvm.pmt, growthrate = tvm.growthrate;
    const perpetuity = fPVPerpetuityStandard({ rate, pmt, growthrate });
    const GAPVIF = ftvmPVGrowAnnIntrFact({ rate, nper, growthrate });
    return perpetuity * GAPVIF;
}


// ---Future value formulas-----------------
// 
// -----------------------------------------

// FV of a single payment
function fFVSinglePmt(tvm) {
    const rate = tvm.rate, nper = tvm.nper, pv = tvm.pv;
    return pv * ftvmFVIF(rate, nper);
}

// FV of a standard annuity
function fFVAnnuityStandard(tvm) {
    const rate = tvm.rate, nper = tvm.nper, pmt = tvm.pmt;
    return pmt * ftvmFVIFA({ rate, nper });
}

// FV of a growing annuity
function fFVGrowingAnnuity(tvm) {
    const rate = tvm.rate, nper = tvm.nper, pmt = tvm.pmt, growthrate = tvm.growthrate;
    return pmt * ftvmGrowAnnFVIF(rate, nper, growthrate);
}



//---TVM Components-----------------------
// The calcs below are components of other calculations.
// The TVM formulas use these functions instead of repeatedly writing the same calculations.
// I also use these when writing out the steps of the solutions.
//----------------------------------------

// 1 + i
function ftvm1Rate(tvm) {
    const rate = tvm.rate;
    return 1 + rate;
}

// Future value interest factor (FVIF)
// (1+i)^n
function ftvmFVIF(tvm) {
    const rate = tvm.rate, nper = tvm.nper;
    return ftvm1Rate({ rate }) ** nper;
}

// Present value interest factor (PVIF)
// 1 / ((1+i)^n)
function ftvmPVIF(tvm) {
    const rate = tvm.rate, nper = tvm.nper;
    return 1 / ftvmFVIF({ rate, nper });
}

// Net numerator? Not sure if there's a name for this.
// 1 – (1 / ((1+i)^n))
function ftvmPVANetNumerator(tvm) {
    const rate = tvm.rate, nper = tvm.nper;
    return 1 - ftvmPVIF({ rate, nper });
}

// Present Value Interest Factor Annuity (PVIFA)
// (1 – (1 / ((1+i)^n))) / i
function ftvmPVIFA(tvm) {
    const rate = tvm.rate, nper = tvm.nper;
    return ftvmPVANetNumerator({ rate, nper }) / rate;
}


// --PV of growing annuity specific---------
// Components used only for present value of growing annuity formulas
// -----------------------------------------

// Present Value of Growing annuity rate weighting (I made up this name)
// (1+g)/(1+i)
function ftvmPVGrowAnnRateRatio(tvm) {
    const rate = tvm.rate, growthrate = tvm.growthrate;
    return ftvm1Rate({ "rate": growthrate }) / ftvm1Rate({ rate });
}

// Present Value of Growing annuity interest factor (I made up this name)
// ((1+g)/(1+i))^n
function ftvmPVGrowAnnIntFactor(tvm) {
    const rate = tvm.rate, nper = tvm.nper, growthrate = tvm.growthrate;
    return ftvmPVGrowAnnRateRatio({ rate, growthrate }) ** nper;
}

// Present Value of Growing annuity interest factor (I made up this name)
// 1 - ((1+g)/(1+i))^n
function ftvmPVGrowAnnIntrFact(tvm) {
    const rate = tvm.rate, nper = tvm.nper, growthrate = tvm.growthrate;
    return 1 - ftvmPVGrowAnnIntFactor({ rate, nper, growthrate });
}


// --Future value specific------------------
// Components used only for future value formulas
// -----------------------------------------

// FV of an annuity net numerator (I made this name up)
// (1+i)^n - 1
function ftvmFVANetNumerator(tvm) {
    const rate = tvm.rate, nper = tvm.nper;
    return ftvmFVIF({ rate, nper }) - 1;
}

// Future Value Interest Factor Annuity (FVIFA) (I made this name up)
// ((1+i)^n - 1)/ i
function ftvmFVIFA(tvm) {
    const rate = tvm.rate, nper = tvm.nper;
    return ftvmFVANetNumerator({ rate, nper }) / rate;
}


// --FV of growing annuity specific---------
// Components used only for future value of growing annuity formulas (at least when first built)
// -----------------------------------------

// FV of growing annuity (i<>g) net numerator (I made this name up)
// (1+i)^n - (1+g)^n
function ftvmFVGrowAnnNetNumer(tvm) {
    const rate = tvm.rate, nper = tvm.nper, growthrate = tvm.growthrate;
    return ftvmFVIF({ rate, nper }) - ftvmFVIF({ "rate": growthrate, nper });
}

// Rate spread between interest rate and growth rate (used for FV of growing annuity when i<>g)
// i-g
function ftvmRateSpreadIntrGrowth(tvm) {
    const rate = tvm.rate; growthrate = tvm.growthrate;
    return rate - growthrate;
}

// FV of growing annuity interest factor (i<>g) (I made this name up)
// ( (1+i)^n - (1+g)^n ) / (i-g)
function ftvmFVGrowAnnIntrFact(tvm) {
    const rate = tvm.rate, nper = tvm.nper, growthrate = tvm.growthrate;
    return ftvmFVGrowAnnNetNumer({ rate, nper, growthrate }) / ftvmRateSpreadIntrGrowth({ rate, growthrate });
}

// FV Interest Factor 1 year short of n (I made this name up)
// (1+i) ^ (n-1)
function ftvmFVIFLess1(tvm) {
    const rate = tvm.rate, nper = tvm.nper;
    return (ftvm1Rate({ rate })) ** (nper - 1);
}

// FVIFLess1 multiplier  (I made this name up)
// n * ((1+i)^(n-1))
function ftvmFVIFLess1Multiplier(tvm) {
    const rate = tvm.rate, nper = tvm.nper;
    return nper * ftvmFVIFLess1({ rate, nper });
}

// Growing Annuity Future Value Interest Factor
// This is the part that gets multiplied by the PMT. It varies depending on i=g or i<>g
function ftvmGrowAnnFVIF(tvm) {
    const rate = tvm.rate, nper = tvm.nper, growthrate = tvm.growthrate;
    if (rate != growthrate) { return ftvmFVGrowAnnIntrFact({ rate, nper, growthrate }) }
    if (rate == growthrate) { return ftvmFVIFLess1Multiplier({ rate, nper }) }
}

