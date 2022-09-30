// Grab all the elements we need
var questionBox = document.getElementById("question-container");
var startButton = document.getElementById("start-button");
var highscoresButton = document.getElementById("highscores-button");
var timer = document.getElementById("timer");
var rightWrongLabel = document.getElementById("right-wrong-label");

var readyState = document.getElementById("ready-state");
var quizState = document.getElementById("quiz-state");

// Keep track of highscores
var highscores = [];
var correctCount = 0;
var time = 60;

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
    answer: "#element"
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
//------------------------------------------------------------------------//

var questions = [ question_0, question_1, question_2, question_3 ];
var currentQuestion = 0;

startButton.addEventListener("click", function() {
    quizState.setAttribute("style", "display: block;");
    readyState.setAttribute("style", "display: none;");

    // Starts the quiz
    currentQuestion = 0;
    correctCount = 0;
    advanceQuiz();

    // Starts the timer for the quiz
    timer.textContent = "Time Left: " + time;
    setInterval(function() {
        if(time > 0) {
            updateTimer(-1);
        } else {
            // Go to fail screen
        }
    }, 1000);
});

function advanceQuiz() {
    if(currentQuestion < questions.length) {
        // Grabs the question data ion the array and puts it to a single variable
        var question = questions[currentQuestion];

        // Sets up the question header for the current question
        var questionHeader = document.createElement("h2");
        questionHeader.setAttribute("id", "question-header");
        questionHeader.textContent = question.question;
        questionBox.appendChild(questionHeader);

        var lineBreak = document.createElement("hr");
        questionBox.appendChild(lineBreak);

        // Sets up the question data for the current question
        for(var i = 0; i < question.answers.length; i++) {
            var questionChoice = document.createElement("h3");
            questionChoice.setAttribute("id", "question");
            questionChoice.textContent = question.answers[i];
            questionChoice.addEventListener("click", function() {
                // Increases the score if the question was correct
                if(question.answer === this.textContent) {
                    correctCount++;
                    isRight();
                } else {
                    updateTimer(-10);
                    isWrong();
                    // If timer <= 0 go to fail
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
        // End the game here
    }
};

function updateTimer(amount) {
    time += amount;
    timer.textContent = "Time Left: " + time;
}

function isRight() {
    rightWrongLabel.style.color = "#D2D3D5FF";
    rightWrongLabel.textContent = "Right";
    colorFadeOut = setInterval(function() {
        rightWrongLabel.style.color = "#D2D3D500";
        clearInterval(colorFadeOut);
    }, 1000);
}

function isWrong() {
    rightWrongLabel.style.color = "#D2D3D5FF";
    rightWrongLabel.textContent = "Wrong";
    colorFadeOut = setInterval(function() {
        rightWrongLabel.style.color = "#D2D3D500";
        clearInterval(colorFadeOut);
    }, 1000);
}