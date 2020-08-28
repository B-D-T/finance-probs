
// Use scientific notation trick to improve rounding accuracy
const uRound = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

// Use "ln" for natural log (log base e). I'm just renaming an existing method here, but it's easier to understand when it's "ln."
const uLn = (value) => Math.log(value);

// Create a LaTex-style fraction
const uFrac = (numerator, denominator) => [ "\\frac{", numerator, "}{", denominator, "}" ].join('')


// Create shorthand for katex.renderToString
// We can pass the math as a string, number, or array
const kx = function(mathToBeRendered, renderingOptions){
    const mathForKatex = Array.isArray(mathToBeRendered) ? mathToBeRendered.join("") : mathToBeRendered.toString()
    return katex.renderToString(mathForKatex, renderingOptions);
}

// I write things like "Solve for x" a lot, so kxx is just shorthand.
const kxx = kx("x");

// The default displayMode for kx is inline {displayMode:false}.
// The line below is shorthand for displayMode:true, which makes the katex bigger, centers it, and puts it on its own line.
const kxbig = (mathToBeRendered) => kx(mathToBeRendered, {displayMode:true})