// qualtrics_practice_prob_set_intro_code.js

// This is code that I manually add to the first question of the ProbSet_Practice survey in Qualtrics.
// I didn't know where else to put it, so I'm dumping the code in here.


// This is sample HTML for the cover image on the first question of the ProbSet_Practice survey in Qualtrics.
/*
<div style="text-align:center; width=300px; height: 300px; background-color:#ffe6ea;color:black;">
<div style="font-weight:bold; font-size: 1.3em;">Assignment information</div>

<div style="font-size:1.1em;">Assessment for Algebra</div>

<div style="font-style:italic;">You can only take this assignment once. These scores count toward your course grade.</div>

<div style="margin:15px auto;"><img style="border: 10px solid white; width: auto; height: auto;" src="https://b-d-t.github.io/finance-probs/supporting/LessonCover_Algebra.jpg" alt="Algebra expressions on paper with pencil"></div>
</div>
*/


/*
// This is code I put in the Header of the Look & Feel section of each Qualtrics survey.
<link crossorigin="anonymous" href="https://b-d-t.github.io/finance-probs/supporting/finance-probs.css" rel="stylesheet" />
<script defer src="https://b-d-t.github.io/finance-probs/main.js" crossorigin="anonymous"></script>
<script defer src="https://b-d-t.github.io/finance-probs/v3main.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.css" integrity="sha384-FkTZUsHjYVyYpU6dse+5AzszY5617FqhnLpcMIIAlLKTbdmeVMO/7K6BrdHWM28V" crossorigin="anonymous" />
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.js" integrity="sha384-CAltQiu9myJj3FAllEacN6FT+rOyXo+hFZKGuR2p4HB8JvJlyUHm31eLfL4eEiJL" crossorigin="anonymous"></script>
<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/contrib/auto-render.min.js" integrity="sha384-hCXGrW6PitJEwbkoStFjeJxv+fSOOQKOPbJxSfM6G5sWZjAyWhXiTIIAmQqnlLlh" crossorigin="anonymous"></script>
//
//
// In Spring 2025, I replaced the code below with some of the lines above. I can delete the code below once I confirm that the new code works.
<link crossorigin="anonymous" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.css" integrity="sha384-qCEsSYDSH0x5I45nNW4oXemORUZnYFtPy/FqB/OjqxabTMW5HVaaH9USK4fN3goV" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.js" integrity="sha384-YFVvRUwgqxkAVN9bmAVLsKilmOKfQLyUx0ZlmDNs0aBUTsvMLnRxE3Km0NrZa0i9" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.js" integrity="sha256-4O4pS1SH31ZqrSO2A/2QJTVjTPqVe+jnYgOWUVr7EEc=" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/contrib/auto-render.min.js" integrity="sha384-mll67QQFJfxn0IYznZYonOWZ644AWYC+Pt2cHqMaRhXVrursRwvLnLaebdGIlYNa" crossorigin="anonymous"></script> 
*/


/*
// The StudentInfo question requires custom validation.
First name not empty
Last name not empty
StudentID >= 20700000
StudentID <= 89999999
Then assign it the "PS ToC Submit answers" "Failed Validation" message from the Finance Probs library.
That one says, "You must provide your first and last name, and more importantly, your valid student ID (Spire ID). The ID is an 8-digit number, usually starting with 3. E.g., 34567890"
*/


Qualtrics.SurveyEngine.addOnload(function () {
  /* Place your JavaScript here to run when the page loads */

});

Qualtrics.SurveyEngine.addOnReady(function () {
  /* Place your JavaScript here to run when the page is fully displayed */

  const strGithubBaseURL = "https://b-d-t.github.io/finance-probs/supporting/";
  const objCoverImages = {
    Algebra: {
      "src": strGithubBaseURL + "LessonCover_Algebra.jpg",
      "alt": "Algebra expressions on paper with pencil",
    },
    BasicTVM: {
      "src": strGithubBaseURL + "LessonCover_TVMSinglePmts.jpg",
      "alt": "Discount formula tattoo",
    },
    Annuities1: {
      "src": strGithubBaseURL + "LessonCover_TVMAnnuities.png",
      "alt": "Equal-sized money bags on a timeline. Bags in later years are smaller when discounted back to year 0."
    },
    Annuities2: {
      "src": strGithubBaseURL + "LessonCover_TVMAnnuities.png",
      "alt": "Equal-sized money bags on a timeline. Bags in later years are smaller when discounted back to year 0."
    },
    BondValuation: {
      "src": strGithubBaseURL + "LessonCover_FinancingDevices.jpg",
      "alt": "Bull statue near Wall Street, New York"
    },
    DividendPricing: {
      "src": strGithubBaseURL + "LessonCover_FinancingDevices.jpg",
      "alt": "Bull statue near Wall Street, New York"
    },
    CapitalBudg: {
      "src": strGithubBaseURL + "LessonCover_CapitalBudgeting.jpg",
      "alt": "High efficiency beer pourer at sports stadium"
    }
  };

  let strShortName = "${e://Field/qtrxEDBBAsgnmtShortName}"; // previously was qtrxEDAsgnmtShortName. Maybe that's for the Assessments only?
  if (!strShortName) { strShortName = "${e://Field/qtrxEDAsgnmtShortName_TESTING}"; }
  console.log("strShortName", strShortName);
  const currentObj = objCoverImages[strShortName];

  const aryCoverImageElements = ["#PracticeCoverImage", "#AssessmentCoverImage"];

  jQuery.each(aryCoverImageElements, function (index, pageElement) {
    jQuery.each(currentObj, function (coverKey, coverVal) {
      jQuery(pageElement).attr(coverKey, coverVal);
    });
    jQuery(pageElement).attr("style", "width:auto, height:auto");
  });
});

Qualtrics.SurveyEngine.addOnUnload(function () {
  /* Place your JavaScript here to run when the page is unloaded */

});
