// ✅ STEP 1: Handle dropdown change (Others option)
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

// ✅ STEP 2: Get correct interest value (THIS WAS MISSING)
function getSelectedInterest() {
  const dropdown = document.getElementById("interest").value;
  const custom = document.getElementById("customInterest").value;

  return dropdown === "Others" ? custom : dropdown;
}

// ✅ STEP 3: Generate explanation + navigate
async function generate() {
  console.log("Generate button clicked");

  const topic = document.getElementById("topic").value;
  const interest = getSelectedInterest();

  if (!topic || !interest) {
    alert("Please enter both topic and interest");
    return;
  }

  const response = await fetch("http://127.0.0.1:8000/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, interest })
  });

  const data = await response.json();

  // ✅ store explanation for next page
  localStorage.setItem("explanation", data.explanation);

  // ✅ navigate to explanation page
  window.location.href = "explanation.html";
}
