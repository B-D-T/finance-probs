function fnQues433(qv, cust) {

    // Variables passed to this question
    const a = qv.a;
    const b = qv.b;
    const c = qv.c;
    const d = c - a;
    const lnb = cust_round(Math.log(b), 5);
    const lnd = cust_round(Math.log(d), 5);
    //???       bx = b+"^x",
    const ans = Math.log(c - a) / Math.log(b);

    let obj = {};

    // Calculations
    obj.calcs = {
    }

    obj.ansFormatReqs = {
        decimals: 5
    }

    let kx = function(v,a){return katex.renderToString(v,a)};
    kxx = kx("x", { displayMode: false });

    obj.stem = [
        "Solve for " + kxx + " given:",
        kx([a,"+",b,"^x=",c].join(""), { displayMode: true })
    ],
    console.log(obj.stem);

    obj.solution = [
        [
            "Subtract",
            kx(""+a+"", { displayMode: false }),
            "from each side. That will isolate",
            kx(b+"^x", { displayMode: false }),
            "on the left side."
        ].join(" "),
        kx(b+"^x="+c+"-"+a),
        kx(b+"^x="+d),
        "The variable is in the exponent, so we need to bring it down with the rest of the equation in order to solve for it. To do this, we can use the natural log (ln). When you take the natural log of each side of the equation, the variable moves down and is multiplied by the rest of the term.",
        kx("x*ln("+b+")=ln("+d+")"),
        "Now, use the calculator to determine the natural log of the numbers.",
        kx(["x*",lnb,"=",lnd].join("")),
        ["Finally, to solve for ",kxx,", divide each side by the number that's multiplying the variable (",kx(""+lnb,{displayMode:false }),")."].join(''),
        kx(["\\frac{x*", lnb, "}{", lnb, "} = \\frac{", lnd, "}{", lnb, "}"].join('')),
        kx(["x = \\frac{", lnd, "}{", lnb, "}"].join('')),
        kx("x = "+ans)
    ].join("\n");

    jQuery("#divQues433").html(obj.solution);

    return obj;
}

function cust_round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
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
