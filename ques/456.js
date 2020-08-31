fnQues456 = function (){//quesVariables, objAddlInfo) {


    let defineQuesVars = {
        "a": 1,
        "b": uRand(6,10,1),
        "c": uRand(3, 20, 1),
        "d": uRand(2,4,1)
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
    const e = b-d;
    const g = uRound(c^(1/e), 5);
    const h = (c^(1/e)) - 1
}
    
    // KELSEY don't touch
    let obj = {};
    obj.ansBoxMessage = objAnsBoxMessages.decimalPlaces4;
    // end KELSEY
    
    obj.stem = `
        Solve for ${kxx} given:
        ${kxbig([
            a, 
            "+x", 
            (^b), 
            "=", 
            ((c*(a,"+x")^d))
        ])}
    `
    
    obj.solution = `
    ${kxbig([(a,"+x")^b], "=", (c*(a, "+x")^d))}

    To get the variables on the same side of the equation, 
    divide each side by ${kx([(a+"x")^d])}
    
    [It's easiest to divide each side by the term with the smaller 
    exponent. In this case,
    ${kx((a+"x")^d)} is smaller than ${kx([(a, "+x")^b])}
    This will leave ${c} on the right side by itself.

    ${kxbig([uFrac((a, "+x")^b), (a, "+x")^d], "=", c)}

    Because we are dividing the same term (1+x) by exponents, 
    we can simplify the problem by just subtracting the exponents.
    ${kxbig([
        ("1+x")^(b-d), "=", c])}

    ${kxbig([
        ("1+x")^e, "=", c])}

    In order to isolate the (1+x) term, take the ${e}-root of 
    each side.

    ${kxbig([
        (^e), (sqrt("1+x")^e), "=", (^e), (sqrt(c))])}

    ${kxbig([("1+x"), "=", g])}
    
    Lastly, subtract 1 from each side to solve for x.
    ${kxbig(["x=", (g-1)])}

    ${kxbig([("x=", h)])}

    Remember... if your calculator doesn't have a way to 
    specify taking roots other than 2 [i.e., square roots], 
    you can always raise the number to the reciprocal of the 
    exponent. In this example, taking ${kx([c^(uFrac(1, e))])}
    would give us the same solution as ${kx([e\sqrt(c)])}. 
    This is also how you would have to solve the problem if 
    using Excel.

    For additional help, you can watch the video below to see 
    how to solve this problem. Note: the problem in the video 
    is structured similarly but has different numbers.
    \{ htmlLink("https://wcu.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=5c9cd15c-e232-4de3-a640-d71e3b7d5bfa", "Video solution", 'TARGET= "_blank"'); \}

    `
    return obj;
    }