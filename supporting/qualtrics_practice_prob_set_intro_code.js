// qualtrics_practice_prob_set_intro_code.js

// This is code that I manually add to the first question of the ProbSet_Practice survey in Qualtrics.
// I didn't know where else to put it, so I'm dumping the code in here.

Qualtrics.SurveyEngine.addOnload(function () {
  /* Place your JavaScript here to run when the page loads */

});

Qualtrics.SurveyEngine.addOnReady(function () {
  /* Place your JavaScript here to run when the page is fully displayed */

  const strGithubBaseURL = "https://b-d-t.github.io/finance-probs/supporting/";
  const objCoverImages = {
    Algebra: {
      // "src": "https://uma.umassonline.net/bbcswebdav/xid-19884065_1",
      // "src": "https://uma.umassonline.net/bbcswebdav/courses/dtyler_dev/FilesInProd/ModulesFinance/Algebra/LessonCover_Algebra.jpg",
      "src": strGithubBaseURL + "LessonCover_Algebra.jpg",
      "alt": "Algebra expressions on paper with pencil",
    },
    BasicTVM: {
      // "src": "https://uma.umassonline.net/bbcswebdav/xid-19959122_1",
      "src": strGithubBaseURL + "LessonCover_TVMSinglePmts.jpg",
      "alt": "Discount formula tattoo",
    },
    Annuities1: {
      // "src": "https://uma.umassonline.net/bbcswebdav/xid-20018306_1",
      "src": strGithubBaseURL + "LessonCover_TVMAnnuities.png",
      "alt": "Equal-sized money bags on a timeline. Bags in later years are smaller when discounted back to year 0."
    },
    Annuities2: {
      // "src": "https://uma.umassonline.net/bbcswebdav/xid-20018306_1",
      "src": strGithubBaseURL + "LessonCover_TVMAnnuities.png",
      "alt": "Equal-sized money bags on a timeline. Bags in later years are smaller when discounted back to year 0."
    },
    BondValuation: {
      // "src": "https://uma.umassonline.net/bbcswebdav/xid-20751123_1",
      "src": strGithubBaseURL + "LessonCover_FinancingDevices.jpg",
      "alt": "Bull statue near Wall Street, New York"
    },
    DividendPricing: {
      // "src": "https://uma.umassonline.net/bbcswebdav/xid-20751123_1",
      "src": strGithubBaseURL + "LessonCover_FinancingDevices.jpg",
      "alt": "Bull statue near Wall Street, New York"
    },
    CapitalBudg: {
      // "src": "https://uma.umassonline.net/bbcswebdav/xid-20900783_1",
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
