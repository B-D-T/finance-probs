
// Use scientific notation trick to improve rounding accuracy
const cfRound = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)

// Natural log (log base e)
const ln = (value) => Math.log(value)

// Create shorthand for katex.renderToString
const kx = (mathToBeRendered, renderingOptions) => katex.renderToString(mathToBeRendered, renderingOptions)

// The default displayMode for kx is inline {displayMode:false}.
// The line below is shorthand for displayMode:true, which makes the katex bigger, centers it, and puts it on its own line.
const kxbig = (mathToBeRendered) => katex.renderToString(mathToBeRendered, {displayMode:true})