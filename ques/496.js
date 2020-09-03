fnQues496 = function (objFromMainQues) {

    let quesVars = {
        "a": uRand(20000,50000,1000),
        "b": uRand(.05, .25, .01),
        "c": uRand(5, 10, 1)
    }

    // Static code
    let obj = {};
    obj.ansBoxMessage = ansBoxMessages("decimalPlaces4");
    const windowScope = this; const varPrefix = "var_q" + quesNum() + "z__";
    jQuery.each(quesVars, function(theKey, theValue){const newKey = varPrefix + theKey; quesVars[newKey] = [theValue]; delete quesVars[theKey]; });
    if (objFromMainQues.isProduction) { return createEDVarInScope(fetchQuesVars(quesVars)) } else { return createEDVarInScope(quesVars); }
    function createEDVarInScope(objEDVars) { jQuery.each(objEDVars, function (edKey, edValue) { const origKey = edKey.replace(varPrefix, ''); quesVars[origKey]= quesVars[edKey]; delete quesVars[edKey]; windowScope[origKey] = edValue; }); return fillPage(); } function fillPage() {
    // End static code

        // Calculations
        $per= $b*100;
        $d = 1+$b;
        $e = $d**$c;
        $e2 = sprintf("%0.4f",$d**$c);
        $ans= $a*$e;
        
        
        obj.stem =
            `
            You have ~~$$a right now.  What is the value of ~~$$a $c years
            from now, assuming $per%
            $BR
            $BR
            (Please write out all numbers to all places.  For example, do not write "12.5 million," write out 12500000.  Do not use any commas, dollar signs or percent symbols.)

        `

        obj.solution =
            `
            \(FV=C_0(1+i)^n\)
            $BR
            $BR
            Begin by identifying the variables (what is known and unknown).
            $BR
            \( FV= ?  \)    $BR
            \( C_0(PV)= $a \)   $BR
            \( i= $b  \)    $BR
            \( n= $c  \)    $BR
            $BR
            $BR
            Once you have identified the variables, plug them into the proper formula and solve for FV. [feed the unknown variable to that FV slot]
            $BR
            \(FV=$a(1+$b)^{$c}\)
            $BR
            $BR
            \(FV=$a($d)^{$c}\)
            $BR
            $BR
            \(FV=$a($e2)\)
            $BR
            $BR
            \(FV=$ans\) \(dollars.\)
        `

        let objFindReplace = {
            "$": "",

        }

        jQuery.each(varQues, function(newKey, newVal){
            // Replace each $var

            varQues.newKey = myString.replace(RegExp(origVar,"g"),newVar);
        });

        return obj;
    } // end of fillPage



}
