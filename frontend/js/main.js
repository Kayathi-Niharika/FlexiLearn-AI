// ===============================
// STEP 1: Handle dropdown change
// ===============================
function handleInterestChange() {
  const interest = document.getElementById("interest").value;
  const customInput = document.getElementById("customInterest");

  if (interest === "Others") {
    customInput.style.display = "block";
  } else {
    customInput.style.display = "none";
    customInput.value = "";
  }
}

// ===============================
// STEP 2: Get selected interest
// ===============================
function getSelectedInterest() {
  const dropdown = document.getElementById("interest").value;
  const custom = document.getElementById("customInterest").value;
  return dropdown === "Others" ? custom : dropdown;
}

// ===============================
// STEP 3: Generate explanation
// ===============================
async function generate() {
  const topic = document.getElementById("topic").value.trim();
  const interest = getSelectedInterest();

  if (!topic || !interest) {
    alert("Please enter both topic and interest");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, interest })
    });

    const data = await response.json();

    // Store context
    localStorage.setItem("topic", topic);
    localStorage.setItem("interest", interest);
    localStorage.setItem("explanation", data.explanation);

    window.location.href = "explanation.html";
  } catch (error) {
    alert("Backend is not running. Please start the server.");
    console.error(error);
  }
}

// ===============================
// 🎤 VOICE INPUT (Speech → Text)
// ===============================
function startVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice input not supported. Please use Google Chrome.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;

  recognition.start();

  recognition.onresult = (event) => {
    document.getElementById("topic").value =
      event.results[0][0].transcript;
  };

  recognition.onerror = (event) => {
    alert("Voice recognition error: " + event.error);
  };
}

// ===============================
// 📎 FILE UPLOAD (MULTI-FORMAT)
// ===============================
function uploadFile() {
  document.getElementById("fileInput").click();
}

document.addEventListener("DOMContentLoaded", () => {

  // 🎤 Bind voice icon
  document.getElementById("voiceIcon")?.addEventListener(
    "click",
    startVoiceInput
  );

  // 📎 Bind upload icon
  document.getElementById("uploadIcon")?.addEventListener(
    "click",
    uploadFile
  );

  // 📎 File input handler
  const fileInput = document.getElementById("fileInput");
  if (!fileInput) return;

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // TEXT / MD / JSON
    if (
      fileType.includes("text") ||
      fileName.endsWith(".md") ||
      fileName.endsWith(".json")
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("topic").value =
          e.target.result.substring(0, 500);
      };
      reader.readAsText(file);
    }

    // PDF
    else if (fileType === "application/pdf") {
      document.getElementById("topic").value =
        "PDF uploaded. Content will be processed by AI backend.";
    }

    // DOCX
    else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      document.getElementById("topic").value =
        "DOCX uploaded. Content will be processed by AI backend.";
    }

    // IMAGE (OCR-ready)
    else if (fileType.startsWith("image/")) {
      document.getElementById("topic").value =
        "Image uploaded. OCR-based text extraction will be enabled.";
    }

    else {
      alert("Unsupported file format");
    }
  });
});

// ===============================
// 🧠 ASK MORE (Chat-style doubts)
// ===============================
async function askMore() {
  const question = document.getElementById("followup").value;
  const topic = localStorage.getItem("topic");

  if (!question.trim()) {
    alert("Please enter your doubt");
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
      data.answer || "No response generated.";
  } catch (err) {
    document.getElementById("followupAnswer").innerText =
      "Backend not running.";
  }
}
