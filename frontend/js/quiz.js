const quizData = [
  {
    question: "What does the topic mainly explain?",
    options: ["A force", "A process", "A concept", "An object"],
    correct: 2,
    explanation: "The topic explains a concept."
  },
  {
    question: "Where is this concept commonly used?",
    options: ["Only textbooks", "Real life", "Only exams", "Only labs"],
    correct: 1,
    explanation: "Concepts are applied in real-life situations."
  },
  {
    question: "Why is this concept important?",
    options: ["Marks only", "Basic understanding", "Memorization", "Entertainment"],
    correct: 1,
    explanation: "Basic understanding helps advanced learning."
  },
  {
    question: "Which is a correct real-life example?",
    options: ["Random task", "Imaginary case", "Practical situation", "Unrelated task"],
    correct: 2,
    explanation: "Practical situations best explain concepts."
  },
  {
    question: "What should you do if confused?",
    options: ["Ignore", "Skip topic", "Revise & practice", "Quit subject"],
    correct: 2,
    explanation: "Revision improves understanding."
  }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];

function loadQuestion() {
  document.getElementById("feedback").innerText = "";
  document.getElementById("question").innerText =
    quizData[currentQuestion].question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  quizData[currentQuestion].options.forEach((opt, index) => {
    const btn = document.createElement("div");
    btn.className = "option-btn";
    btn.innerHTML = `<span>${opt}</span>`;
    btn.onclick = () => selectOption(index);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("progress").innerText =
    `Question ${currentQuestion + 1} of ${quizData.length}`;

  // 🔁 Reapply previous answer if exists
  if (userAnswers[currentQuestion] !== undefined) {
    applyPreviousAnswer();
  }
}

function selectOption(index) {
  if (userAnswers[currentQuestion] !== undefined) return;

  userAnswers[currentQuestion] = index;

  const correctIndex = quizData[currentQuestion].correct;
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    if (i === correctIndex) {
      btn.classList.add("correct");
      btn.innerHTML += `<span class="option-icon">✔</span>`;
    }
    if (i === index && index !== correctIndex) {
      btn.classList.add("wrong");
      btn.innerHTML += `<span class="option-icon">✖</span>`;
    }
  });

  if (index === correctIndex) score++;

  document.getElementById("feedback").innerText =
    (index === correctIndex ? "✅ Correct. " : "❌ Wrong. ") +
    "Explanation: " + quizData[currentQuestion].explanation;
}

function applyPreviousAnswer() {
  const selected = userAnswers[currentQuestion];
  const correctIndex = quizData[currentQuestion].correct;
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    if (i === correctIndex) {
      btn.classList.add("correct");
      btn.innerHTML += `<span class="option-icon">✔</span>`;
    }
    if (i === selected && selected !== correctIndex) {
      btn.classList.add("wrong");
      btn.innerHTML += `<span class="option-icon">✖</span>`;
    }
  });

  document.getElementById("feedback").innerText =
    (selected === correctIndex ? "✅ Correct. " : "❌ Wrong. ") +
    "Explanation: " + quizData[currentQuestion].explanation;
}

function nextQuestion() {
  if (userAnswers[currentQuestion] === undefined) {
    alert("Please select an option");
    return;
  }

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    document.body.innerHTML = `
  <!-- Top Navigation -->
  <a href="index.html" class="home-btn">⬅ Home</a>
  <a href="history.html" class="history-btn">History</a>

  <div class="quiz-container">
    <h2>Quiz Completed 🎉</h2>
    <p>Your Score: ${score} / ${quizData.length}</p>

    <div class="result-buttons">
      <button onclick="location.reload()">🔁 Retake Quiz</button>
      <button onclick="window.location.href='explanation.html'">
        📘 Back to Explanation
      </button>
    </div>
  </div>
`;

  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

loadQuestion();
