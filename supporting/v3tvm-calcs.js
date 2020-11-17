/*

I've been manually assigning variables to scope them within each function.
Use something like this instead (though including the default variable check), 
which I think you'll need to put inside each function in place of the explicit definitions.

for (let objProp in qv){ if (qv.hasOwnProperty(objProp)) {eval(objProp + " = qv[objProp];");} }














*/

// -----Input TVM functions------------------------------------------
//  You'll probably only call either fPresentValue or fFutureValue
//  Everything else is just supporting.
// 
//  These are modeled on the Excel financial functions.
//  However, I added variables that are useful to other TVM calcs
//  and tweaked the functionality where needed. For example...
//  ..If varY <>1, varType is irrelevant
//  ..If varN is not defined, treat it like a perpetuity
//  ..The functions accept positive numbers and return positive numbers.
//

//  This receives an object of TVM arguments from the caller and recreates the variables within function scope.
//  If there's no key by that name passed by the caller (i.e., the caller didn't pass that variable),
//  the code assigns a default value to the variable.

// These were ported from tylermacros.pg.
// ------------------------------------------------------------------

// I'm building this as a pseudo module... because I don't really know how to get modules to work correctly.

// I've added "decimals" as an argument to some of the functions (though it should be on all of them).
// If that's populated, the function returns the rounded number for display purposes.

function TVMCalcsClass($, objFromMain){
    // Default values
    function fSetLocalVar(tvmPart, curVal) {
        const objTVMDefaults = {
            "varRate": 0, "varN": 0, "varPMT": 0, "varFV": 0, "varPV": 0, "varG": 0, "varReturnInYear": 0,
            "varY": 1, // If varY doesn't exist, we assume that annuity payments start at the end of year 1
            "varType": 0, // If varY is anything OTHER than 1, that means it rules and we should ignore the varType argument.
        }
        return !(curVal === "undefined") ? objTVMDefaults[tvmPart] : curVal;
    }


    // ##### =PV (varRate, varN, varPMT, [varFV], [varType], [varG], [varY]) ##### 
    this.fPresentValue = function(qv) {

        const varRate = qv.varRate || fSetLocalVar("varRate", qv.varRate);
        const varN = qv.varN || fSetLocalVar("varN", qv.varN);
        const varPMT = qv.varPMT || fSetLocalVar("varPMT", qv.varPMT);
        const varFV = qv.varFV || fSetLocalVar("varFV", qv.varFV);
        const varPV = qv.varPV || fSetLocalVar("varPV", qv.varPV);
        const varG = qv.varG || fSetLocalVar("varG", qv.varG);
        const varY = qv.varY || fSetLocalVar("varY", qv.varY);
        const varReturnInYear = qv.varReturnInYear === undefined ? fSetLocalVar("varReturnInYear", qv.varReturnInYear) : qv.varReturnInYear;
        const varType = (varY !== 1) ? 0 : qv.varType || fSetLocalVar("varType", qv.varType); // if varY is anything OTHER than 1, that means it rules and we should ignore the varType argument.


        // ---Step through the TVM decision tree-------
        // With all functions, I pass an object with the key:value pairs, then recreate the variables within the subroutine.
        // I could just pass the variables in order and read them based on the position,
        // but I wanted to be explicit with the variable names to reduce the chance of mistakes.

        // Single payment
        if (varPMT == 0 && varFV != 0) { return fPVSinglePmt({ varRate, varN, varFV }); }

        // 	Perpetuity (if varN is undefined or 0)
        if (!varN) {
            // Store the present value of a standard perpetuity
            const perpetuityValue = fPVPerpetuityStandard({ varRate, varPMT, varG });
            return fPVAnnuityTiming({ varRate, varType, varY, "lumpsum": perpetuityValue });
        }

        // 	Annuities
        if (varPMT != 0 && varFV == 0) {

            // Growing Annuities // *** FIX: I don't think this works. Use fPVGrowingAnnuityStandard directly for now. ****
            if (varG != 0) {
                // Store the present value of a standard growing annuity
                const growingAnnuityValue = fPVGrowingAnnuityStandard({ varRate, varN, varPMT, varG });
                return fPVAnnuityTiming({ varRate, varType, varY, "lumpsum": growingAnnuityValue });
            }

            // Annuities
            if (varG == 0) {
                // Store the present value of a standard annuity
                const annuityValue = fPVAnnuityStandard({ varRate, varN, varPMT });
                return fPVAnnuityTiming({ varRate, varType, varY, "lumpsum": annuityValue });
            }

        }

        // Bonds (paid annually)
        if (varPMT != 0 && varFV != 0) {
            // Run the code twice: 1x for the coupon payment and 1x for the lumpsum (par value)
            const pvCoupons = fPresentValue({ varRate, varN, varPMT, "varFV": 0, varType, varG, varY });
            const pvParValue = fPresentValue({ varRate, varN, "varPMT": 0, varFV, varType, varY });
            return pvCoupons + pvParValue;
        }

        return `The fPresentValue calcs didn't work: (varRate=${varRate}, varN=${varN}, varPMT=${varPMT}, varFV=${varFV}, varType=${varType}, varG=${varG}, varY=${varY})`;


        // Adjust present value of annuity to account for PV Annuity Due and PV Delayed Annuities
        function fPVAnnuityTiming(tvm) {
            const varRate = tvm.varRate, lumpsum = tvm.lumpsum, varType = tvm.varType, varY = tvm.varY;

            // If this is an Annuity Due (first payment in year 0; type=1), the annuity value returned is in year -1.
            // We use fFVSinglePmt to compound the value forward by 1 year.
            if (varY == 0 || varType == 1) { // Annuity due
                return fFVSinglePmt({ varRate, "varN": 1, "varPV": lumpsum });
            } else if (varY > 1) { // Delayed annuity
                return fPVSinglePmt({ varRate, "varN": varY - 1, "varFV": lumpsum });
            } else {
                return lumpsum;
            }
        }
    }

    // ##### =FV (varRate, varN, varPMT, [varPV], [varType], [varG], [varY]) ##### 
    function fFutureValue(qv) {
        //  This works just like the fPresentValue function above, so I omitted the comments here.

        const varRate = qv.varRate || fSetLocalVar("varRate", qv.varRate);
        const varN = qv.varN || fSetLocalVar("varN", qv.varN);
        const varPMT = qv.varPMT || fSetLocalVar("varPMT", qv.varPMT);
        const varFV = qv.varFV || fSetLocalVar("varFV", qv.varFV);
        const varPV = qv.varPV || fSetLocalVar("varPV", qv.varPV);
        const varG = qv.varG || fSetLocalVar("varG", qv.varG);
        const varY = qv.varY || fSetLocalVar("varY", qv.varY);
        const varReturnInYear = qv.varReturnInYear === undefined ? fSetLocalVar("varReturnInYear", qv.varReturnInYear) : qv.varReturnInYear;
        const varType = (varY !== 1) ? 0 : qv.varType || fSetLocalVar("varType", qv.varType); // if varY is anything OTHER than 1, that means it rules and we should ignore the varType argument.


        // Single payment
        if (varPMT == 0 && varPV != 0) { return fFVSinglePmt({varRate, varN, varPV}); }

        // Annuities
        if (varPMT != 0 && varPV == 0) {

            if (varG != 0) {
                const growingAnnuityValue = fFVGrowingAnnuity({ varRate, varN, varPMT, varG });
                return fFVAnnuityTiming({ varRate, "lumpsum": growingAnnuityValue, varType, varY });
            }

            if (varG == 0) {
                const annuityValue = fFVAnnuityStandard({ varRate, varN, varPMT });
                return fFVAnnuityTiming({ varRate, "lumpsum": annuityValue, varType, varY });
            }
        }

        // Bonds (paid annually)
        if (varPMT != 0 && varFV != 0 && varFV.includes("?")==false ) { //Notice that this is FV instead of PV
            const fvCoupons = fFutureValue({ varRate, varN, varPMT, "varPV": 0, varType, varG, varY });
            const fvParValue = varFV;
            return fvCoupons + fvParValue;
        }

        return `The fFutureValue calcs didn't work: (varRate=${varRate}, varN=${varN}, varPMT=${varPMT}, varPV=${varPV}, varType=${varType}, varG=${varG}, varY=${varY})`;
    }

    // Adjust future value of annuity to account for FV Annuity Due
    function fFVAnnuityTiming(tvm) {
        const varRate = tvm.varRate, lumpsum = tvm.lumpsum, varType = tvm.varType, varY = tvm.varY;

        // FV of Annuity due
        if (varY == 0 || varType == 1) {
            return fFVSinglePmt({ varRate, "varN": 1, "varPV": lumpsum });
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
        const varFV = tvm.varFV, varRate = tvm.varRate, varN = tvm.varN;
        return varFV * ftvmPVIF({ varRate, varN });
    }

    // PV of a standard perpetuity
    function fPVPerpetuityStandard(tvm, decimals=12) {
        const varRate = tvm.varRate; varPMT = tvm.varPMT; varG = tvm.varG;
        return uRound(varPMT / ftvmRateSpreadIntrGrowth({ varRate, varG }), decimals);
    }

    // PV of a standard annuity
    function fPVAnnuityStandard(tvm, decimals=12) {
        const varRate = tvm.varRate, varN = tvm.varN, varPMT = tvm.varPMT;
        return uRound(varPMT * ftvmPVIFA({ varRate, varN }), decimals);
    }

    // PV of a growing standard annuity
    function fPVGrowingAnnuityStandard(tvm) {
        const varRate = tvm.varRate, varN = tvm.varN, varPMT = tvm.varPMT, varG = tvm.varG;
        const perpetuity = fPVPerpetuityStandard({ varRate, varPMT, varG });
        const GAPVIF = ftvmPVGrowAnnIntrFact({ varRate, varN, varG });
        return perpetuity * GAPVIF;
    }


    // ---Future value formulas-----------------
    // 
    // -----------------------------------------

    // FV of a single payment
    function fFVSinglePmt(tvm) {
        const varRate = tvm.varRate, varN = tvm.varN, varPV = tvm.varPV;
        return varPV * ftvmFVIF({varRate, varN});
    }

    // FV of a standard annuity
    function fFVAnnuityStandard(tvm) {
        const varRate = tvm.varRate, varN = tvm.varN, varPMT = tvm.varPMT;
        return varPMT * ftvmFVIFA({ varRate, varN });
    }

    // FV of a growing annuity
    function fFVGrowingAnnuity(tvm) {
        const varRate = tvm.varRate, varN = tvm.varN, varPMT = tvm.varPMT, varG = tvm.varG;
        return varPMT * ftvmGrowAnnFVIF({varRate, varN, varG});
    }



    //---TVM Components-----------------------
    // The calcs below are components of other calculations.
    // The TVM formulas use these functions instead of repeatedly writing the same calculations.
    // I also use these when writing out the steps of the solutions.
    //----------------------------------------

    // 1 + i
    function ftvm1Rate(tvm, decimals=12) {
        const varRate = tvm.varRate;
        return uRound(1 + varRate, decimals);
    }

    // Future value interest factor (FVIF)
    // (1+i)^n
    function ftvmFVIF(tvm, decimals=12) {
        const varRate = tvm.varRate, varN = tvm.varN;
        return uRound(ftvm1Rate({ varRate }) ** varN, decimals);
    }

    // Present value interest factor (PVIF)
    // 1 / ((1+i)^n)
    function ftvmPVIF(tvm, decimals=12) {
        const varRate = tvm.varRate, varN = tvm.varN;
        return uRound(1 / ftvmFVIF({ varRate, varN }), decimals);
    }

    // Net numerator? Not sure if there's a name for this.
    // 1 – (1 / ((1+i)^n))
    function ftvmPVANetNumerator(tvm) {
        const varRate = tvm.varRate, varN = tvm.varN;
        return 1 - ftvmPVIF({ varRate, varN });
    }

    // Present Value Interest Factor Annuity (PVIFA)
    // (1 – (1 / ((1+i)^n))) / i
    function ftvmPVIFA(tvm, decimals=12) {
        const varRate = tvm.varRate, varN = tvm.varN;
        return uRound(ftvmPVANetNumerator({ varRate, varN }) / varRate, decimals);
    }


    // --PV of growing annuity specific---------
    // Components used only for present value of growing annuity formulas
    // -----------------------------------------

    // Present Value of Growing annuity rate weighting (I made up this name)
    // (1+g)/(1+i)
    function ftvmPVGrowAnnRateRatio(tvm, decimals=12) {
        const varRate = tvm.varRate, varG = tvm.varG;
        return uRound(ftvm1Rate({ "varRate": varG }) / ftvm1Rate({ varRate }), decimals);
    }

    // Present Value of Growing annuity interest factor (I made up this name)
    // ((1+g)/(1+i))^n
    function ftvmPVGrowAnnIntFactor(tvm, decimals=12) {
        const varRate = tvm.varRate, varN = tvm.varN, varG = tvm.varG;
        return uRound(ftvmPVGrowAnnRateRatio({ varRate, varG }) ** varN, decimals);
    }

    // Present Value of Growing annuity interest factor (I made up this name)
    // 1 - ((1+g)/(1+i))^n
    function ftvmPVGrowAnnIntrFact(tvm, decimals=12) {
        const varRate = tvm.varRate, varN = tvm.varN, varG = tvm.varG;
        return uRound(1 - ftvmPVGrowAnnIntFactor({ varRate, varN, varG }), decimals);
    }


    // --Future value specific------------------
    // Components used only for future value formulas
    // -----------------------------------------

    // FV of an annuity net numerator (I made this name up)
    // (1+i)^n - 1
    function ftvmFVANetNumerator(tvm, decimals=12) {
        const varRate = tvm.varRate, varN = tvm.varN;
        return uRound(ftvmFVIF({ varRate, varN }) - 1, decimals);
    }

    // Future Value Interest Factor Annuity (FVIFA) (I made this name up)
    // ((1+i)^n - 1)/ i
    function ftvmFVIFA(tvm, decimals=12) {
        const varRate = tvm.varRate, varN = tvm.varN;
        return uRound(ftvmFVANetNumerator({ varRate, varN }) / varRate, decimals);
    }


    // --FV of growing annuity specific---------
    // Components used only for future value of growing annuity formulas (at least when first built)
    // -----------------------------------------

    // FV of growing annuity (i<>g) net numerator (I made this name up)
    // (1+i)^n - (1+g)^n
    function ftvmFVGrowAnnNetNumer(tvm) {
        const varRate = tvm.varRate, varN = tvm.varN, varG = tvm.varG;
        return ftvmFVIF({ varRate, varN }) - ftvmFVIF({ "varRate": varG, varN });
    }

    // Rate spread between interest rate and growth rate (used for FV of growing annuity when i<>g)
    // i-g
    function ftvmRateSpreadIntrGrowth(tvm, decimals=12) {
        const varRate = tvm.varRate; varG = tvm.varG;
        return uRound(varRate - varG, decimals);
    }

    // FV of growing annuity interest factor (i<>g) (I made this name up)
    // ( (1+i)^n - (1+g)^n ) / (i-g)
    function ftvmFVGrowAnnIntrFact(tvm) {
        const varRate = tvm.varRate, varN = tvm.varN, varG = tvm.varG;
        return ftvmFVGrowAnnNetNumer({ varRate, varN, varG }) / ftvmRateSpreadIntrGrowth({ varRate, varG });
    }

    // FV Interest Factor 1 year short of n (I made this name up)
    // (1+i) ^ (n-1)
    function ftvmFVIFLess1(tvm) {
        const varRate = tvm.varRate, varN = tvm.varN;
        return (ftvm1Rate({ varRate })) ** (varN - 1);
    }

    // FVIFLess1 multiplier  (I made this name up)
    // n * ((1+i)^(n-1))
    function ftvmFVIFLess1Multiplier(tvm) {
        const varRate = tvm.varRate, varN = tvm.varN;
        return varN * ftvmFVIFLess1({ varRate, varN });
    }

    // Growing Annuity Future Value Interest Factor
    // This is the part that gets multiplied by the PMT. It varies depending on i=g or i<>g
    function ftvmGrowAnnFVIF(tvm) {
        const varRate = tvm.varRate, varN = tvm.varN, varG = tvm.varG;
        if (varRate != varG) { return ftvmFVGrowAnnIntrFact({ varRate, varN, varG }) }
        if (varRate == varG) { return ftvmFVIFLess1Multiplier({ varRate, varN }) }
    }
}
console.log("tvm-calcs.js loaded.");