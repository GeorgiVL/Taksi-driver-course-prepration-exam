let questions = [];
let currentQuestionIndex = 0;
let setOfRandomlyGeneratedQuestions = [];
let totalAnswers = [];

// Hide the Next and Hint buttons initially
function renderHomePage() {
  const header2 = document.createElement("h3");
  const exerciseBtn = document.createElement("button");
  exerciseBtn.classList.add("exeBtn");
  const tryExamBtn = document.createElement("button");
  tryExamBtn.classList.add("tryBtn");
  const rootDiv = document.querySelector("#root");

  header2.innerText = "Taxi Exam Preparation 🚕";
  header2.classList.add("head2");
  exerciseBtn.innerText = "Exercise";
  exerciseBtn.onclick = startExercise;
  tryExamBtn.innerText = "Try Exam";
  tryExamBtn.onclick = startExam;

  rootDiv.appendChild(header2);
  rootDiv.appendChild(exerciseBtn);
  rootDiv.appendChild(tryExamBtn);
  document.body.appendChild(rootDiv);
}

function clearScreen() {
  const rootDiv = document.querySelector("#root");
  rootDiv.innerHTML = ""; // clear the content of the root div
}

function populateRandomQuestion() {
  let arrayOfRandomIndexes = setRandomlyIndexesForQuestions();
  for (let number = 0; number < arrayOfRandomIndexes.length; number++) {
    const value = arrayOfRandomIndexes[number];
    const question = questions[value];
    setOfRandomlyGeneratedQuestions.push(question);
  }
}

const questionList = "questions.json";
// http://localhost:8080/get-list-of-questions

function startExercise() {
  fetch(questionList)
    .then((response) => response.json())
    .then((fetchedQuestions) => {
      questions = fetchedQuestions;

      clearScreen();
      renderQuestion(currentQuestionIndex, questions);
      renderNextBtn();
      renderHintBtn();
    })
    .catch((err) => {
      alert("Error happened" + err);
    });
}

function startExam() {
  fetch(questionList)
    .then((response) => response.json())
    .then((fetchedQuestions) => {
      questions = fetchedQuestions;

      populateRandomQuestion();
      clearScreen();
      renderQuestion(currentQuestionIndex, setOfRandomlyGeneratedQuestions);
      renderNextBtnExam();
    })
    .catch((err) => {
      alert("Error happened" + err);
    });
}

function showQuestion(question) {
  const rootDiv = document.querySelector("#root");
  const label = document.createElement("label");
  const header = document.createElement("h2");
  header.classList.add("showQuestionHead");

  header.innerText = question;

  label.appendChild(header);
  rootDiv.appendChild(label);
  document.body.appendChild(rootDiv);
}

function renderQuestion(index, questionSet) {
  const question = questionSet[index]["question"]["text"];
  const correctAnswer = questionSet[index]["correctAnswer"];
  const incorrectAnswers = [questionSet[index]["incorrectAnswers"]];

  // Combine correct answer and incorrect answers into a single array
  const allAnswers = [correctAnswer, ...incorrectAnswers];

  // Shuffle the array to randomize the order
  const shuffledAnswers = shuffleArray(allAnswers);
  showQuestion(question);

  // Display the shuffled answers
  shuffledAnswers.forEach((answer) => {
    if (answer === correctAnswer) {
      showCorrectAnswer(answer);
    } else {
      showIncorrectAnswers(answer);
    }
  });
}

function showCorrectAnswer(correctAnswer) {
  const rootDiv = document.querySelector("#root");
  const label = document.createElement("label");
  const myCheckbox = document.createElement("input");
  const br = document.createElement("br");
  const span = document.createElement("span");

  myCheckbox.type = "checkbox";
  span.innerText = correctAnswer;

  label.classList.add("correctLable");
  span.classList.add("correctSpan");
  myCheckbox.classList.add("correctCheckbox");

  label.appendChild(myCheckbox);
  label.appendChild(span);
  label.appendChild(br);

  rootDiv.appendChild(label);
  document.body.appendChild(rootDiv);
}

function showIncorrectAnswers(incorrectAnswers) {
  const rootDiv = document.querySelector("#root");

  incorrectAnswers.forEach((answer) => {
    const answerLines = answer.split(",");

    answerLines.forEach((line) => {
      const label = document.createElement("label");
      const myCheckbox = document.createElement("input");
      const span = document.createElement("span");
      const br = document.createElement("br");

      myCheckbox.type = "checkbox";
      span.innerText = line.trim();

      label.classList.add("incorrectLable");
      span.classList.add("incorrectSpan");
      myCheckbox.classList.add("incorrectCheckbox");
      label.appendChild(myCheckbox);
      label.appendChild(span);
      label.appendChild(br);
      rootDiv.appendChild(label);
    });
  });
  document.body.appendChild(rootDiv);
}

function setRandomlyIndexesForQuestions() {
  const maxRangeForNumber = questions.length - 1;
  const numberOfNecessaryIndexes = 20;
  const arrayOfIndexesForQuestions = [];

  while (arrayOfIndexesForQuestions.length < numberOfNecessaryIndexes) {
    const questionNumber = getRandomIndexForQuestion(0, maxRangeForNumber);
    if (!arrayOfIndexesForQuestions.includes(questionNumber)) {
      arrayOfIndexesForQuestions.push(questionNumber);
    }
  }

  return arrayOfIndexesForQuestions;
}

function getRandomIndexForQuestion(min, max) {
  const range = max - min + 1;
  const randomNumber = Math.floor(Math.random() * range) + min;
  return randomNumber;
}

function calculateExamScore(results) {
  const actualCorrectAnswers = results.length;
  const totalCorrectAnswers = 20;

  const percentage = (actualCorrectAnswers / totalCorrectAnswers) * 100;
  return percentage;
}

// Fisher-Yates shuffle algorithm to mix the positions of the answers based on the random number generated
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderNextBtnExam() {
  const rootDiv = document.querySelector("#root");
  const nextExamBtn = document.createElement("button");
  nextExamBtn.innerText = "Next Question";
  nextExamBtn.classList.add("nextBtnExam");
  rootDiv.appendChild(nextExamBtn);

  nextExamBtn.addEventListener("click", function () {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    let isCorrectAnswerSelected = false;

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const label = checkbox.parentNode;
        const answerText = label.querySelector("span").innerText;
        const correctAnswer =
          setOfRandomlyGeneratedQuestions[currentQuestionIndex].correctAnswer;

        if (answerText === correctAnswer) {
          isCorrectAnswerSelected = true;
        }

        if (isCorrectAnswerSelected) {
          totalAnswers.push(1);
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < setOfRandomlyGeneratedQuestions.length) {
          clearScreen();
          renderQuestion(currentQuestionIndex, setOfRandomlyGeneratedQuestions);
          renderNextBtnExam();
        } else {
          clearScreen();
          rederEndExamBtn();
        }
      }
    });
  });
}

function rederEndExamBtn() {
  const rootDiv = document.querySelector("#root");
  const endBtn = document.createElement("button");
  endBtn.innerText = "End Exam";
  endBtn.classList.add("endBtn");

  const label = document.createElement("label");
  const header3 = document.createElement("h2");

  rootDiv.appendChild(endBtn);
  // Display the result of the Exam after clicking the button
  endBtn.addEventListener("click", function () {
    clearScreen();
    let result = calculateExamScore(totalAnswers);
    if (result >= 90) {
      header3.innerText =
        "Your have passed the Exam with " + result + "% correct answers. ✅";
    } else {
      header3.innerText =
        "Your have failed the Exam with " + result + "% correct answers. ⛔";
    }
    label.appendChild(header3);
    rootDiv.appendChild(label);
    renderHomePageBtn();
  });
  document.body.appendChild(rootDiv);
}

function renderNextBtn() {
  const rootDiv = document.querySelector("#root");
  const nextBtn = document.createElement("button");
  nextBtn.innerText = "Next";
  nextBtn.classList.add("nextBtn");
  rootDiv.appendChild(nextBtn);

  nextBtn.addEventListener("click", function () {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    let isCorrectAnswerSelected = false;
    let isIncorrectAnswerSelected = false;

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const label = checkbox.parentNode;
        const answerText = label.querySelector("span").innerText;
        const correctAnswer = questions[currentQuestionIndex].correctAnswer;

        if (answerText === correctAnswer) {
          isCorrectAnswerSelected = true;
        } else {
          isIncorrectAnswerSelected = true;
        }
      }
    });

    if (isCorrectAnswerSelected && !isIncorrectAnswerSelected) {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        clearScreen();
        renderQuestion(currentQuestionIndex, questions);
        renderNextBtn();
        renderHintBtn();
      } else {
        clearScreen();
        renderRestartExericesBtn();
        renderHomePageBtn();
      }
    } else {
      const correctAnswer = questions[currentQuestionIndex].correctAnswer;
      alert("Incorrect answer. The correct answer is:\n" + correctAnswer);
    }
  });
}

function renderHintBtn() {
  const rootDiv = document.querySelector("#root");
  const hintBtn = document.createElement("button");
  hintBtn.innerText = "Hint";
  rootDiv.appendChild(hintBtn);
  hintBtn.classList.add("hintBtn");
  hintBtn.addEventListener("click", function () {
    // Get the current question's correct answer
    const correctAnswer = questions[currentQuestionIndex]["correctAnswer"];

    // Display the hint as an alert
    alert("Hint: Правилният отговор е \n" + correctAnswer);
  });
}

function renderRestartExericesBtn() {
  const rootDiv = document.querySelector("#root");
  const restartBtn = document.createElement("button");
  restartBtn.innerText = "Restart Exercise";
  restartBtn.classList.add("restBtn");
  rootDiv.appendChild(restartBtn);

  restartBtn.addEventListener("click", function () {
    currentQuestionIndex = 0;
    clearScreen();
    renderQuestion(currentQuestionIndex, questions);
    renderNextBtn();
    renderHintBtn();
  });
}

function renderHomePageBtn() {
  const rootDiv = document.querySelector("#root");
  const homeBtn = document.createElement("button");
  homeBtn.innerText = "Home";
  homeBtn.classList.add("homeBtn");
  rootDiv.appendChild(homeBtn);

  homeBtn.addEventListener("click", function () {
    clearScreen();
    window.location.reload();
  });
}

renderHomePage();
