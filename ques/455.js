fnQues455 = function (){//quesVariables, objAddlInfo) {


let defineQuesVars = {
    "a": uRand(2,8,1),
    "b": uRand(10,29,1),
    "c": uRand(30,50,2)
}

// KELSEY -- don't touch
    // If the variable is already in the embedded data, it uses that. Otherwise, it creates one in the embedded data based on our definition.
    // Create local variables with the same names as the keys in defineQuesVars. These are what we'll use in our code.
    jQuery.each(defineQuesVars, function(theKey, theValue){ 
        window[theKey] = theValue;  //<-- TESTING. Real one is something like syncEmbeddedData(theValue); 
        console.log("New student name is " + getEDValue("StudentNameFL"));
    });
    // end KELSEY
    
// Calculations
const d = c-b;
const ax = a+"x";
const ans = ((c-b)/a);
const ansr = uRound((c-b)/a, 5);

// KELSEY don't touch
let obj = {};
obj.ansBoxMessage = objAnsBoxMessages.decimalPlaces4;
// end KELSEY

obj.stem = `
    Solve for ${kxx} given:
    ${kxbig([ax, "+", b, "=", c])}
`

obj.solution = `
    Subtract ${b} from each side. That will leave ${kx(ax)} on the left side.
    ${kxbig([ax, "+", b, "-", b, "=", c, "-", b])}
    ${kxbig([ax, "=", d])}
    
    Divide each side by ${a} to isolate the variable.
    ${kxbig([
        uFrac(ax, a), 
        "=",
        uFrac(d, a)
    ])}

    ${kxbig(`x = ${uFrac(ax,a)}`)}
    ${kxbig(`x = ${ans}`)}
`
return obj;

}