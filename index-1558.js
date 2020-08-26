jQuery.getScript("https://cdn.jsdelivr.net/gh/B-D-T/finance-probs/probs/433.js", function(data, textStatus, jqxhr) {
    console.log(data); //data returned
    console.log(textStatus); //success
    console.log(jqxhr.status); //200
    console.log('Load was performed.');
    });
    
    
function bdttester(){
    console.log("I'm still bdttester(), and I loaded");
    return true;
}

const problems = {
    quesid433: String.raw`c = \pm\sqrt{a^2 + b^2}`
}

// For each Qualtrics question I'd write loadProb('quesid433') or something. I should also make the element dynamic, but I'll need to think about that a bit more
function loadProb(probID){
    //let strToLoad = problems[probID];
    strToLoad = stem();
    console.log("I'm loadProb(" + probID + ") and I'm trying to load this string: " + strToLoad);
    katex.render(strToLoad, bdtQ2, {
        throwOnError: false
    });    
}


(function katexLoadFonts(){
    window.WebFontConfig = {
        custom: {
            families: ['KaTeX_AMS', 'KaTeX_Caligraphic:n4,n7', 'KaTeX_Fraktur:n4,n7',
                'KaTeX_Main:n4,n7,i4,i7', 'KaTeX_Math:i4,i7', 'KaTeX_Script',
                'KaTeX_SansSerif:n4,n7,i4', 'KaTeX_Size1', 'KaTeX_Size2', 'KaTeX_Size3',
                'KaTeX_Size4', 'KaTeX_Typewriter'],
        },
    };
})();

/*
// This was the first line, when this was an NPM package
// When someone adds this package, the index.js file is the one that gets loaded.
exports.printMsg = function() {
    console.log("This is a message from the finance-probs package");
}
*/