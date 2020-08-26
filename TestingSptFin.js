function bdttester(){
    console.log("I'm bdttester(), and I loaded.");
    return true;
}

katex.render(String.raw`c = \pm\sqrt{a^2 + b^2}`, bdtQ2, {
    throwOnError: false
});


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