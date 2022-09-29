var questionBox = document.getElementById("question-container");
var startButton = document.getElementById("start-button");
var highscoresButton = document.getElementById("highscores-button");

startButton.addEventListener("click", function() {
    questionBox.setAttribute("style", "display: block;");
    startButton.setAttribute("style", "display: none;");
    highscoresButton.setAttribute("style", "display: none;");
});