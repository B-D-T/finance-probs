
function fnQues500(objFromMainQues) {

    let quesVars = {
        varFVa: uRand(4,8,1),
        varFVb: uRand(15,20,1),
        varNa: uRand(7, 10, 1),
        varNb:  uRand(15, 19, 1)
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcNbMinNa: varNb-varNa,
            calcFVbDivFVa: varFVb/varFVa,
            get calcRootRight(){return this.calcFVbDivFVa ** (1/(this.calcNbMinNa))},
            get calcTheAns(){return this.calcRootRight-1},
            get calcAnsCheckAInside(){return 1/( (1 + this.calcTheAns)**varNa ) },
            get calcAnsCheckBInside(){return 1/( (1 + this.calcTheAns)**varNb ) }
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispFVbDivFVa: uRound(calcFVbDivFVa, 5),
            dispRootRight: uRound(calcRootRight,5),
            dispTheAns: uRound(calcTheAns,4)
        };
        createEDVarInScope(displayVars);
        
        jQuery.extend(quesVars, calcVars, displayVars);
        storeQuesRespVars(quesVars, calcTheAns);
        return fillPage();
    }

    function fillPage() {
        let obj = {};
        
        obj.ansBoxMessage = ansBoxMessages("percAsDecimal");

        obj.stem = probDisplay(quesVars)`
        <p>
            Below are two offers.
            At what <i>rate</i> would the present value of the two choices be equal?
        </p>
        <p>
            <b>Choice A:</b> Receive a future amount of \$${varFVa.toLocaleString('en')} in varNa years<br />
            <b>Choice B:</b> Receive a future amount of \$${varFVb.toLocaleString('en')} in varNb years
        </p>
        `;

        obj.solution = probDisplay(quesVars)`
        <p>
            The payments are happening in different years.
            In order to compare them, we need to put them in the same year.
            It doesn't really matter what year we choose,
            but we'll go with Year 0 just to make it easy.
            If we use the PV of a Single Payment formula,
            it will discount each value back to year 0.
            That is, the following formulas give the values of each choice in Year 0.
        </p>
        \\[
            \\text{Choice A: }PV_0 = {varFVa} * \\left( \\frac{1}{(1+i)^{varNa}} \\right) \\\\
            {}\\\\
            \\text{Choice B: }PV_0 = {varFVb} * \\left( \\frac{1}{(1+i)^{varNb}} \\right)
        \\]
        <p>
            Now that we have formulas that put the payments in the same year,
            we can set the payments equal to each other and solve for \\(i\\).
        </p>
        \\[
            {varFVa} \\left( \\frac{1}{(1+i)^{varNa}} \\right) = {varFVb} \\left( \\frac{1}{(1+i)^{varNb}} \\right)
        \\]
        <p>
            We can rewrite the equation to have only one fraction on each side by multiplying
            the offer amount by the numerator of the discount factor (the fraction).
            
        </p>
        \\[
            \\frac{varFVa}{(1+i)^{varNa}} = \\frac{varFVb}{(1+i)^{varNb}}
        \\]
        <p>
            Cross multiply by multiplying the 
            left-side numerator &amp; right-side denominator and the 
            right-side numerator &amp; left-side denominator.
        </p>
        \\[ 
            {varFVa}*(1+i)^{varNb}= {varFVb}*(1+i)^{varNa}
        \\]
        <p>
            Notice that we have the (1+i) term on each side,
            though raised to a different power.
            Since it's the same term, 
            we can divide each side by (1+i)<sup>varNa</sup> and
            subtract the exponents (varNb - varNa = calcNbMinNa).
            <br>
            We can also divide each side by varFVa (the constant)
            in order to isolate (1+i)<sup>calcNbMinNa</sup> on the left.
        </p>
        \\[ 
            \\begin{aligned}
                \\frac{{varFVa}*(1+i)^{varNb}}{(1+i)^{varNa}} &= \\frac{{varFVb}*(1+i)^{varNa}}{(1+i)^{varNa}} \\\\
                {}  \\\\
                {varFVa}*(1+i)^{calcNbMinNa} &= {varFVb} \\\\
                {}  \\\\
                \\frac{{varFVa}*(1+i)^{calcNbMinNa}}{varFVa} &= \\frac{varFVb}{varFVa} \\\\
                {}  \\\\
                (1+i)^{calcNbMinNa} &= {dispFVbDivFVa}
            \\end{aligned}
        \\]
        <p>
            That simplifies the problem considerably.
            Now all that's left is to take the calcNbMinNa-root of each side and subtract the 1.
        </p>
        \\[
            \\begin{aligned}
                \\sqrt[calcNbMinNa]{(1+i)^{calcNbMinNa}} &= \\sqrt[calcNbMinNa]{dispFVbDivFVa} \\\\
                1+i &= dispRootRight \\\\
                1+i-1 &= dispRootRight -1 \\\\
                i &= calcTheAns
            \\end{aligned}
        \\]
        <p>
            This means that, at a rate of ${uRound(calcTheAns*100,1)}%,
            the two choices have the same value.
            We can (and should!) test this by plugging our answer back into the original problem.
        </p>
        \\[
            \\begin{aligned}
                {varFVa} \\left( \\frac{1}{(1+{dispTheAns})^{varNa}} \\right) &= {varFVb} \\left( \\frac{1}{(1+{dispTheAns})^{varNb}} \\right) \\\\
                {varFVa} * ${uRound(calcAnsCheckAInside,5)} &= {varFVb} * ${uRound(calcAnsCheckBInside,5)} \\\\
                ${uRound(varFVa * calcAnsCheckAInside,5)} &= ${uRound(varFVb * calcAnsCheckBInside,5)}
            \\end{aligned}
        \\]
        <p>
            Thus, if you were offered these choices and the rate was ${uRound(calcTheAns*100,1)}%,
            you could choose either options and be equally wealthy.
        </p>
        `;

        return obj;

    } // end of fillPage
}

 // received from addOnPageSubmit
function fnQuesResp(objPageSubmit){
    const qtrxDivID = "#divQues" + objPageSubmit.strQuesNum;
    if (!(jQuery(`${qtrxDivID}-response`).length)){
        let objRespFeedback = objPageSubmit;
        return setEDQuesRespVars(objRespFeedback);
    }
}