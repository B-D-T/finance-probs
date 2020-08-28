
fnQues433 = function(qv, cust) {

    // Variables passed to this question
    const a = qv.a;
    const b = qv.b;
    const c = qv.c;

    // Calculations
    const d = c - a;
    const lnb = cfRound(ln(b), 5);
    const lnd = cfRound(ln(d), 5);
    const ans = ln(c - a) / ln(b);

    let obj = {};

    obj.ansFormatReqs = {
        decimals: 5
    }

    obj.stem = `
        Solve for ${kx("x")} given:
        ${kxbig([a,"+",b,"^x=",c].join(""))}
        `

    obj.solution = `
        Subtract ${kx("a")} from each side. 
        That will isolate ${kx(b+"^x")} on the left side.
        ${kxbig(b+"^x="+c+"-"+a)}
        ${kxbig(b+"^x="+d)}

        The variable is in the exponent, 
        so we need to bring it down with the rest of the equation in order to solve for it. 
        To do this, we can use the natural log (ln). 
        When you take the natural log of each side of the equation, 
        the variable moves down and is multiplied by the rest of the term.
        ${kxbig("x*ln("+b+")=ln("+d+")")}

        Now, use the calculator to determine the natural log of the numbers.
        ${kxbig(["x*",lnb,"=",lnd].join(""))}
        
        Finally, to solve for ${kx("x")}, divide each side by the number that's multiplying the variable (${kx(""+lnb)}).
        ${kxbig(["\\frac{x*", lnb, "}{", lnb, "} = \\frac{", lnd, "}{", lnb, "}"].join(''))}
        ${kxbig(["x = \\frac{", lnd, "}{", lnb, "}"].join(''))}
        ${kxbig("x = "+ans)}
        `

    jQuery("#divQues433").html(obj.stem);
    jQuery("#divQues433-2").html(obj.solution);

    return obj;
}

// This should be set in the db, not here. But I wanted to capture it for now
const fileInfo = {
    "QuesNum": 433,
    "Subject": ["algebra"],
    "Description": "Algebra problem where unknown x is in the exponent (solve using natural log)",
    "Keywords": ["algebra", "natural log", "e", "exponents"],
    "Author": "B. David Tyler",
    "ExcelTestbankID": 433,
    "PGFileName": "alg_natural_log.pg"
}
