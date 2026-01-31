const explanation = localStorage.getItem("explanation");

if (explanation) {
  document.getElementById("explanationText").innerText = explanation;
} else {
  document.getElementById("explanationText").innerText =
    "No explanation available.";
}
