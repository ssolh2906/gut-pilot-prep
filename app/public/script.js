// Swap this for the teammate's backend endpoint once it's ready.
const API_URL = "http://localhost:5000/upload";

const form = document.getElementById("test-form");
const fileInput = document.getElementById("file-input");
const fileNameLabel = document.getElementById("file-name");
const textInput = document.getElementById("text-input");
const submitBtn = document.getElementById("submit-btn");
const result = document.getElementById("result");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  fileNameLabel.textContent = file ? file.name : "No file selected";
});

textInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  if (fileInput.files[0]) formData.append("file", fileInput.files[0]);
  formData.append("message", textInput.value);

  setStatus("pending", "Sending...");
  submitBtn.disabled = true;

  try {
    const res = await fetch(API_URL, { method: "POST", body: formData });
    const text = await res.text();

    if (!res.ok) {
      setStatus("error", `Server responded with ${res.status}\n${text}`);
    } else {
      setStatus("success", `Connected. Server response:\n${text}`);
    }
  } catch (err) {
    setStatus("error", `Could not reach ${API_URL}\n${err.message}`);
  } finally {
    submitBtn.disabled = false;
  }
});

function setStatus(kind, message) {
  result.hidden = false;
  result.className = `result ${kind}`;
  result.textContent = message;
}
