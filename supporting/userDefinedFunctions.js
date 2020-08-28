
// Use scientific notation trick to improve rounding accuracy
const udfRound = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

// Use "ln" for natural log (log base e). I'm just renaming an existing method here, but it's easier to understand when it's "ln."
const udfLn = (value) => Math.log(value);

// Create shorthand for katex.renderToString
const kx = (mathToBeRendered, renderingOptions) => katex.renderToString(mathToBeRendered.toString(), renderingOptions)

// The default displayMode for kx is inline {displayMode:false}.
// The line below is shorthand for displayMode:true, which makes the katex bigger, centers it, and puts it on its own line.
const kxbig = (mathToBeRendered) => kx(mathToBeRendered, {displayMode:true})