
fnQues433 = function(quesVariables, objAddlInfo) {

    // Variables passed to this question
    const a = quesVariables.a;
    const b = quesVariables.b;
    const c = quesVariables.c;

    // Calculations
    const d = c - a;
    const lnb = uRound(uLn(b), 5); // functions starting with u are [probably] from the user-defined-functions.js file
    const lnd = uRound(uLn(d), 5);
    const ans = uLn(c - a) / uLn(b);

    const bx = b+"^x"; // this isn't necessary, but it makes the code a bit more readable because I use it a lot

    let obj = {};

    obj.ansFormatReqs = {
        decimals: 5
    }

    obj.stem = `
        Solve for ${kxx} given:
        ${kxbig([a, "+", bx, "=", c])}
        `

    obj.solution = `
        Subtract ${a} from each side. 
        That will isolate ${kx(bx)} on the left side.
        ${kxbig([bx, "=", c , "-", a])}
        ${kxbig([bx, "=", d])}

        The variable is in the exponent, 
        so we need to bring it down with the rest of the equation in order to solve for it. 
        To do this, we can use the natural log (ln). 
        When you take the natural log of each side of the equation, 
        the variable moves down and is multiplied by the rest of the term.
        ${kxbig([ "x*ln(", b, ")=ln(", d, ")" ])}

        Now, use the calculator to determine the natural log of the numbers.
        ${kxbig(["x*", lnb, "=", lnd])}
        
        Finally, to solve for ${kxx}, divide each side by the number that's multiplying the variable (${lnb}).
        ${kxbig([
            uFrac("x*"+lnb, lnb ), 
            " = ",
            uFrac(lnd, lnb)
        ])}
        ${kxbig(`x = ${uFrac(lnd, lnb)}` )}
        ${kxbig(`x = ${ans}`)}
        `

    jQuery("#divQues433-stem").html(obj.stem);
    jQuery("#divQues433-ansFormatReqs").html(obj.ansFormatReqs);
    jQuery("#divQues433-solution").html(obj.solution);

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


