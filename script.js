const quizData = [
  {
    que: "What is JavaScript?",
    option: ["Programming Language", "Database", "Operating System", "Browser"],
    correctAnswerIndex: 0,
  },
  {
    que: "Which keyword declares a variable?",
    option: ["define", "var", "int", "string"],
    correctAnswerIndex: 1,
  },
  {
    que: "What is the output of typeof 'Hello'?",
    option: ["number", "boolean", "string", "object"],
    correctAnswerIndex: 2,
  },
  {
    que: "Which symbol is used for strict equality?",
    option: ["=", "==", "===", "!="],
    correctAnswerIndex: 2,
  },
  {
    que: "Which method adds an element to the end of an array?",
    option: ["pop()", "push()", "shift()", "unshift()"],
    correctAnswerIndex: 1,
  },
];

const timeleftElement = document.getElementById("timeleft");
const qns = document.getElementById("que");
const options = document.getElementById("options");
const num = document.getElementById("qnsnum");
const nextque = document.getElementById("nextque");

let currindex = 0;
let timeleft = 30;
let timerId;

let userAnswer = [];
let selectedAnswer = null;
let questionAnswered = false;
let score = 0;

function loadQns() {
  const currentqns = quizData[currindex];

  selectedAnswer = null;
  questionAnswered = false;

  num.innerText = `Qns ${currindex + 1}/${quizData.length}`;
  qns.innerText = currentqns.que;
  options.innerHTML = "";

  currentqns.option.forEach((opt, index) => {
    const btn = document.createElement("button");

    btn.innerText = opt;
    btn.classList.add("option-btn");

    btn.addEventListener("click", () => {
      if (questionAnswered) return;

      selectedAnswer = index;
      questionAnswered = true;

      userAnswer.push({
        qns: currentqns.que,
        selectedAnswer: selectedAnswer,
        options: currentqns.option,
        correctAnswer: currentqns.correctAnswerIndex,
      });

      if (selectedAnswer === currentqns.correctAnswerIndex) {
        score++;
      }

      btn.classList.add("selected");

      clearInterval(timerId);

      setTimeout(() => {
        nextQue();
      }, 500);
    });

    options.appendChild(btn);
  });

  timer();
}

function nextQue() {
  clearInterval(timerId);

  if (!questionAnswered) {
    userAnswer.push({
      qns: quizData[currindex].que,
      selectedAnswer: null,
      options: quizData[currindex].option,
      correctAnswer: quizData[currindex].correctAnswerIndex,
    });
  }

  if (currindex < quizData.length - 1) {
    currindex++;
    loadQns();
  } else {
    result();
  }
}

nextque.addEventListener("click", (event) => {
  event.preventDefault();
  nextQue();
});

function timer() {
  clearInterval(timerId);

  timeleft = 30;
  timeleftElement.innerText = `Time Left: ${timeleft}s`;
  timeleftElement.classList.remove("is-urgent");

  timerId = setInterval(() => {
    timeleft--;
    timeleftElement.innerText = `Time Left: ${timeleft}s`;

    if (timeleft <= 5) {
      timeleftElement.classList.add("is-urgent");
    }

    if (timeleft <= 0) {
      clearInterval(timerId);
      nextQue();
    }
  }, 1000);
}

function result() {
  clearInterval(timerId);

  const quizCard = document.querySelector(".quizCard");

  if (!quizCard) {
    console.error("Quiz card not found! - script.js:145");
    return;
  }

  quizCard.innerHTML = `
    <div class="card-body summary-txt">
      <h4 class="text-center">Quiz Result </h4>

      <h4 class="text-center mt-3">
        Score: ${score}/${quizData.length}
      </h4>

      <ul class="list-group mt-3">
        ${userAnswer
          .map(
            (ans, index) => `
          <li class="list-group-item result-qns">
            <h5>Question ${index + 1}: ${ans.qns}</h5>

            <p class="mb-2">
              Your Answer:
              ${
                ans.selectedAnswer !== null
                  ? ans.options[ans.selectedAnswer]
                  : "Not Selected"
              }
            </p>

            <p class="mb-0">
              Correct Answer:
              ${ans.options[ans.correctAnswer]}
            </p>
          </li>
        `,
          )
          .join("")}
      </ul>
    </div>
  `;
}

// Start Quiz
loadQns();
