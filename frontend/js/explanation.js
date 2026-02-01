// ===============================
// LOAD EXPLANATION
// ===============================
const explanation = localStorage.getItem("explanation");
const topic = localStorage.getItem("topic");

document.getElementById("explanationText").innerText =
  explanation || "No explanation available.";

// ===============================
// ASK MORE (CHAT STYLE)
// ===============================
async function askMore() {
  const question = document.getElementById("followup").value;

  if (!question.trim()) {
    alert("Please enter your question");
    return;
  }

  document.getElementById("followupAnswer").innerText = "Thinking... ⏳";

  try {
    const response = await fetch("http://127.0.0.1:8000/explore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, question })
    });

    const data = await response.json();
    document.getElementById("followupAnswer").innerText =
      data.answer || "No answer generated.";

  } catch (err) {
    document.getElementById("followupAnswer").innerText =
      "❌ Backend not running.";
  }
}

// ===============================
// 🎥 ANIMATED EXPLANATION LOGIC
// ===============================
let animationIndex = 0;
let animationSentences = [];
let animationPlaying = false;

// ▶ Play Animation
function playAnimatedExplanation() {
  const text =
    document.getElementById("explanationText").innerText.trim();

  if (!text) {
    alert("No explanation available");
    return;
  }

  stopAnimatedExplanation(); // reset previous

  animationSentences = text
    .replace(/\n+/g, " ")
    .split(". ")
    .filter(sentence => sentence.length > 15);

  animationIndex = 0;
  animationPlaying = true;

  playNextScene();
}

// ▶ Play each sentence as scene
function playNextScene() {
  if (!animationPlaying || animationIndex >= animationSentences.length) {
    document.getElementById("videoScreen").innerText =
      "✅ Animation completed";
    return;
  }

  const sentence = animationSentences[animationIndex];

  document.getElementById("videoScreen").innerText = sentence;

  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.lang = "en-US";
  utterance.rate = 0.95;

  utterance.onend = () => {
    animationIndex++;
    setTimeout(playNextScene, 800);
  };

  window.speechSynthesis.speak(utterance);
}

// ⏹ Stop Animation
function stopAnimatedExplanation() {
  animationPlaying = false;
  animationIndex = 0;
  window.speechSynthesis.cancel();

  document.getElementById("videoScreen").innerText =
    "⏹ Animation stopped";
}


async function generateVideo() {
  const explanation = localStorage.getItem("explanation");

  const response = await fetch("http://127.0.0.1:8000/generate-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ explanation })
  });

  const data = await response.json();

  const video = document.getElementById("aiVideo");
  video.src = "http://127.0.0.1:8000/" + data.video_url;
  video.load();
}
