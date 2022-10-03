// Grab all the elements we need
var questionBox = document.getElementById("question-container");
var startButton = document.getElementById("start-button");
var highscoresButton = document.getElementById("highscores-button");
var saveButton = document.getElementById("save-button");
var backButton = document.getElementById("back-button");
var timer = document.getElementById("timer");
var rightWrongLabel = document.getElementById("right-wrong-label");

var readyState = document.getElementById("ready-state");
var quizState = document.getElementById("quiz-state");
var inputState = document.getElementById("input-state");
var scoreState = document.getElementById("score-state");

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
            loseGame();
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
                        loseGame();
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
    } else if(time > 0) {
        winGame();
        clearInterval(timeInterval);
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

// This takes the user to the score input page
function winGame() {
    var header = document.getElementById("result");
    header.textContent = "Your score is: " + time;

    quizState.setAttribute("style", "display:none;");
    inputState.setAttribute("style", "display:block;");
}

// This swaps the game to the score state with losing text along with stopping the timer
function loseGame() {
    quizState.setAttribute("style", "display: none;");
    displayScores("You lose!");
    clearInterval(timeInterval);
}

// When clicked this button saves the score to the array then swaps to the score state
saveButton.addEventListener("click", function() {
    var name = document.getElementById("name-input");
    saveScores(time + " by: " + name.value);
    inputState.setAttribute("style", "display:none;");
    displayScores("Your Score: " + time);
});

// This takes in a new score and saves it in the appropriate place in the array
function saveScores(newScore) {
    // This adds a score to the end of the array
    highscores[highscores.length] = newScore;

    // This sorts then reverses the array so that its in descending order
    highscores.sort();
    highscores.reverse();

    // This cuts off the array if theres more scores than the list limit allows
    if(highscores.length > listLimit) {
        highscores.splice(listLimit);
    }

    saveScoresToStorage();
}

// Swaps the state to the highscore screen when the game is over
function displayScores(text) {
    // Makes the score state visible and sets the header text
    scoreState.setAttribute("style", "display:block;");
    var scoreHeader = document.getElementById("score-header");
    scoreHeader.textContent = text;

    // Clears the score list
    var scoreList = document.getElementById("score-list");
    scoreList.innerHTML = '';

    // Recreates the score list from the highscore array
    for(const score of highscores) {
        var listing = document.createElement("li");
        listing.textContent = score;
        scoreList.appendChild(listing);
    }
}

// This saves the scores as a single string
function saveScoresToStorage() {
    var scoreString = "";
    for(const score of highscores) {
        scoreString += score + ",-,";
    }
    localStorage.setItem("scores", scoreString);
}

// Loads the score list from local storage
function loadScoresFromStorage() {
    var scoreString = localStorage.getItem("scores");
    if(scoreString != null) {
        // This loads the scores as one string then splits them apart into an array
        highscores = scoreString.split(",-,").filter(function (e) {
            return e != '';
        });
    }
}

// Takes the user to the highscore screen from the home screen
highscoresButton.addEventListener("click", function() {
    readyState.setAttribute("style", "display: none;");
    displayScores("");
});

// Takes the user back to the home screen from the highscore screen
backButton.addEventListener("click", function() {
    readyState.setAttribute("style", "display: block;");
    scoreState.setAttribute("style", "display: none;");
});