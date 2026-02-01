let quizData = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];

// =======================
// LOAD QUIZ FROM BACKEND
// =======================

async function loadQuiz() {
  const topic = localStorage.getItem("topic");
  const interest = localStorage.getItem("interest");

  if (!topic || !interest) {
    alert("No quiz data found. Please generate a lesson first.");
    window.location.href = "index.html";
    return;
  }

  const response = await fetch("http://127.0.0.1:8000/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, interest })
  });

  quizData = await response.json();

  if (quizData.length === 0) {
    alert("No quiz available for this topic.");
    window.location.href = "explanation.html";
    return;
  }

  loadQuestion();
}

// =======================
// LOAD QUESTION
// =======================

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

  if (userAnswers[currentQuestion] !== undefined) {
    applyPreviousAnswer();
  }
}

// =======================
// SELECT OPTION
// =======================

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

// =======================
// REAPPLY ANSWER
// =======================

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

// =======================
// NAVIGATION
// =======================

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

// =======================
// INIT
// =======================

loadQuiz();
