async function loadHistory() {
  const res = await fetch("http://127.0.0.1:8000/history");
  const data = await res.json();

  const list = document.getElementById("historyList");
  list.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${item.topic}</strong> (${item.interest})<br>
      <small>${item.date}</small><br><br>

      <button onclick="viewExplanation(${item.id})">📘 View Explanation</button>
      <button onclick="retakeQuiz()">📝 Retake Quiz</button>
    `;

    li.className = "history-item";
    list.appendChild(li);
  });
}

function viewExplanation(id) {
  localStorage.setItem("historyId", id);
  window.location.href = "explanation.html";
}

function retakeQuiz() {
  window.location.href = "quiz.html";
}

loadHistory();
