// Grab all the elements we need
var questionBox = document.getElementById("question-container");
var startButton = document.getElementById("start-button");
var highscoresButton = document.getElementById("highscores-button");
var timer = document.getElementById("timer");
var rightWrongLabel = document.getElementById("right-wrong-label");

var readyState = document.getElementById("ready-state");
var quizState = document.getElementById("quiz-state");
var inputState = document.getElementById("input-state");
var scoreState = document.getElementById("score-state");

var saveButton = document.getElementById("save-button");

// Keep track of highscores
var highscores = [];
var listLimit = 10;
var correctCount = 0;
var time = 60;
var timeInterval;

// Quiz question data ----------------------------------------------------//
var question_0 = {
    question: "What is CSS mainly used for?",
    answers: [
        "Styling the page presentation",
        "Lets the user dynamically interact with elements",
        "Determines the page structure",
        "Communicating with other web services"
    ],
    answer: "Styling the page presentation"
};

var question_1 = {
    question: "How do you reference an element id in CSS?",
    answers: [
        "-element",
        ".element",
        "#element",
        "$element"
    ],
    answer: "#element"
};

var question_2 = {
    question: "How do you join two arrays into a new array in Javascript?",
    answers: [
        ".join()",
        ".concat()",
        ".merge()",
        ".create()"
    ],
    answer: ".concat()"
};

var question_3 = {
    question: "What does prompt() do?",
    answers: [
        "Presents text to a user in a popup box",
        "Takes the user to another web page",
        "Changes the page color",
        "Asks the user for text input"
    ],
    answer: "Asks the user for text input"
};

var question_4 = {
    question: "What does JSON stand for?",
    answers: [
        "Just Some Other Notation",
        "JavaScript Object Notation",
        "Junior Standard Object Notation",
        "Nothing"
    ],
    answer: "JavaScript Object Notation"
};

var question_5 = {
    question: "How do you log to the console in JS?",
    answers: [
        "console.log()",
        "System.out.print()",
        "Log.d()",
        "printf()"
    ],
    answer: "console.log()"
};
//------------------------------------------------------------------------//

var questions = [ question_0, question_1, question_2, question_3, question_4, question_5 ];
var currentQuestion = 0;

loadScoresFromStorage();

startButton.addEventListener("click", function() {
    quizState.setAttribute("style", "display: block;");
    readyState.setAttribute("style", "display: none;");
    scoreState.setAttribute("style", "display: none;");

    // Starts the quiz
    currentQuestion = 0;
    correctCount = 0;
    advanceQuiz();

    // Starts the timer for the quiz
    time = 60;
    timer.textContent = "Time Left: " + time;
    timeInterval = setInterval(function() {
        if(time > 0) {
            updateTimer(-1);
        } else {
            displayScores("You lose!");
        }
    }, 1000);
});

function advanceQuiz() {
    if(currentQuestion < questions.length) {
        // Grabs the question data ion the array and puts it to a single variable
        var question = questions[currentQuestion];

        // Sets up the question header for the current question and adds it to the page
        var questionHeader = document.createElement("h2");
        questionHeader.setAttribute("id", "question-header");
        questionHeader.textContent = question.question;
        questionBox.appendChild(questionHeader);

        // Adds a line break under the header
        var lineBreak = document.createElement("hr");
        questionBox.appendChild(lineBreak);

        // Sets up the question data for the current question
        for(var i = 0; i < question.answers.length; i++) {

            // Creates the headers used as answer buttons
            var questionChoice = document.createElement("h3");
            questionChoice.setAttribute("id", "question");
            questionChoice.textContent = question.answers[i];

            // Adds a click listener to each button that progresses the quiz
            questionChoice.addEventListener("click", function() {
                // Increases the score if the question was correct
                if(question.answer === this.textContent) {
                    correctCount++;
                    displayResult("Right");
                } else {
                    updateTimer(-10);
                    displayResult("Wrong");
                    if(time <= 0) {
                        displayScores("You lose!");
                        if(time < 0) {
                            updateTimer(-time);
                        }
                    }
                }
                
                // Clears the question box and advances the quiz
                questionBox.innerHTML = '';
                advanceQuiz();
            });
            questionBox.appendChild(questionChoice);
        }

        // Advacnes the question counter
        currentQuestion++;
    } else {
        endGame("Your score is: " + time);
    }
};

// This changes the timer based on the given amount and updates the header that display the time
function updateTimer(amount) {
    time += amount;
    timer.textContent = "Time Left: " + time;
}

// This is called when a question is answered and fades in-out the result to the user
function displayResult(result) {
    rightWrongLabel.style.color = "#D2D3D5FF";
    rightWrongLabel.textContent = result;
    colorFadeOut = setInterval(function() {
        rightWrongLabel.style.color = "#D2D3D500";
        clearInterval(colorFadeOut);
    }, 1000);
}

function endGame(text) {
    var header = document.getElementById("result");
    header.textContent = text;

    clearInterval(timeInterval);
    quizState.setAttribute("style", "display:none;");
    inputState.setAttribute("style", "display:block;");
}

saveButton.addEventListener("click", function() {
    var name = document.getElementById("name-input");
    saveScores(time + " by: " + name.value);
    inputState.setAttribute("style", "display:none;");
    displayScores("Your Score: " + time);
});

function saveScores(newScore) {
    if(highscores.length < listLimit) {
        highscores[highscores.length] = newScore;
    } else {
       for(var i = 0; i < highscores.length; i++) {
            if(highscores[i] < newScore) {
                highscores.splice(i, 0, newScore);
                if(highscores.length > listLimit) {
                    highscores.splice(listLimit);
                }
                break;
            }
       }
    }
    highscores.sort();
    highscores.reverse();
    saveScoresToStorage();
}

function displayScores(text) {
    scoreState.setAttribute("style", "display:block;");
    var scoreHeader = document.getElementById("score-header");
    scoreHeader.textContent = text;

    var scoreList = document.getElementById("score-list");
    scoreList.innerHTML = '';

    for(const score of highscores) {
        var listing = document.createElement("li");
        listing.textContent = score;
        scoreList.appendChild(listing);
    }
}

function saveScoresToStorage() {
    var scoreString = "";
    for(const score of highscores) {
        scoreString += score + ",-,";
    }
    localStorage.setItem("scores", scoreString);
}

function loadScoresFromStorage() {
    var scoreString = localStorage.getItem("scores");
    if(scoreString != null) {
        highscores = scoreString.split(",-,").filter(function (e) {
            return e != '';
        });
    }
    console.log(highscores);
}