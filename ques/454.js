fnQues454 = function (objFromMainQues) {


    let quesVars = {
        "a": uRand(2, 9, 1),
        "b": uRand(2, 10, 1),
    }

    // Static code
    let obj = {};
    obj.ansBoxMessage = objAnsBoxMessages.decimalPlaces4;
    const windowScope = this;
    if (objFromMainQues.isProduction) { return createEDVarInScope(fetchQuesVars(quesVars)) } else { return createEDVarInScope(quesVars); }
    function createEDVarInScope(objEDVars) { jQuery.each(objEDVars, function (edKey, edValue) { windowScope[edKey] = edValue; }); return fillPage(); }
    function fillPage() {
    // End static code

        // Calculations
        const ans = Math.sqrt(b / a)
        const ansr = uRound(Math.sqrt(b / a), 5);


        obj.stem = `
        Solve for ${kxx} given:
        ${kxbig([a, "x", "=", uFrac(b, "x")])}

        ${kxbig(["x", "=",])}

    `

        obj.solution = `
        There are a few approaches you can use to solve this problem.  
        We'll look at two possible ways.

        Approach A:
        First, we have to get the x variable out of the denominator. 
        To do this, multiply each side by the reciprocal of the term 
        on the right.
    
        ${kxbig([
            (uFrac(a * "x", 1)) * (uFrac("x" * b)),
            "=",
            (uFrac(b * "x")) * (uFrac("x" * b))
        ])}

        ${kxbig([
            (uFrac(a * "x" ^ 2), b),
            "=",
            (uFrac(b * "x"))
        ])}

        ${kxbig([
            (uFrac(a * "x" ^ 2), b),
            "=",
            1
        ])}
            
        By rewriting the left side, we can separate the variable 
        from the number.

        ${kxbig([
            (uFrac(a, b)) * (uFrac("x" ^ 2), 1),
            "=",
            1
        ])}

        Then, multiply each side by the reciprocal.

        ${kxbig([
            (uFrac(b, a)) * (uFrac(a, b) * "x" ^ 2),
            "=",
            1 * (uFrac(b, a))
        ])}

        ${kxbig([
            "x^2=",
            uFrac(b, a)
        ])}

        Finally, take the square root of each side to figure out x.
    
        ${kxbig([
            'sqrt("x"^2)',
            "=",
            'sqrt(uFrac(b, a))'
        ])}

        ${kxbig(`x = ${ans}`)}
        
        Approach B:
        A faster way to solve this problem is to cross multiply in 
        the first step. To see how this works, it helps to write the 
        original problem in fractions.

        ${kxbig([
            (uFrac(a + "*x"), 1),
            "=",
            uFrac(b, "x")
        ])}

        Cross multiply by mutiplying the left-side numerator & 
        right-side denominator and the right-side numerator & left-side 
        denominator.

        ${kxbig([
            ((a + "x") + "*x"),
            "=",
            b + "*1"
        ])}

        ${kxbig([a, "x^2=", b])}

        Separate the variable from the number by dividing each side by $a.
        ${kxbig([
            uFrac(a + "x^2", a),
            "=",
            uFrac(b, a)
        ])}

        ${kxbig([
            "x^2=", uFrac(b, a)
        ])}

        Finally, take the square root of each side to figure out x.
        ${kxbig([
            'sqrt("x"^2)', "=", 'sqrt(uFrac(b, a))'
        ])}

        ${kxbig(`x = ${ans}`)}
        
        `

        return obj;

    }
}