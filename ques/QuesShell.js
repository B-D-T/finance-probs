
fnQuesSHELL = function (){

    let defineQuesVars = {
        "": ,
        "": ,
        "": 
    }

    // KELSEY -- don't touch
    jQuery.each(defineQuesVars, function(theKey, theValue){ 
        window[theKey] = theValue;  //<-- TESTING. Real one is something like syncEmbeddedData(theValue); 
        console.log("New student name is " + getEDValue("StudentNameFL"));
    });
    // end KELSEY
    

    // Calculations



    // KELSEY -- don't touch
    let obj = {}; obj.ansBoxMessage = objAnsBoxMessages.decimalPlaces4;
    // end KELSEY

    obj.stem = `

    `

    obj.solution = `

    `
    return obj;
}
