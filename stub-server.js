// Run this on port 5000 so your frontend (port 3000) has something to talk to.

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 5050;

// --- CORS ---
// Your frontend is served from http://localhost:3000, this server runs on
// http://localhost:5000 — to a browser, different port = different "origin",
// and browsers block cross-origin requests by default for security reasons.
// cors() adds the response headers that tell the browser "it's fine, let
// localhost:3000 talk to me." Without this line, fetch() in script.js would
// fail even though the server is running correctly.
app.use(cors());

// --- Multer ---
// Browsers send file uploads as "multipart/form-data", which is NOT plain
// JSON — Express can't parse it on its own. Multer is middleware that reads
// that multipart data, saves the uploaded file to disk, and makes it
// available on req.file. dest: "uploads/" is the folder it saves into
// (created automatically if it doesn't exist).
const upload = multer({ dest: "uploads/" });

// --- The route ---
// This matches the FormData keys your script.js already sends:
//   formData.append("file", fileInput.files[0])   -> upload.single("file")
//   formData.append("message", textInput.value)   -> req.body.message
// upload.single("file") tells multer "expect exactly one file, sent under
// the field name 'file'" — this name has to match on both ends.
app.post("/upload", upload.single("file"), (req, res) => {
  const message = req.body.message;
  const file = req.file; // undefined if no file was attached

  console.log("Received message:", message);
  if (file) {
    console.log("Received file:", file.originalname, `(${file.size} bytes)`);
  } else {
    console.log("No file attached");
  }

  // res.send() with plain text — matches script.js reading the response
  // with res.text() rather than res.json().
  res.send(
    `Got your message: "${message}"` +
      (file ? ` and file "${file.originalname}"` : " (no file attached)")
  );
});

app.listen(PORT, () => {
  console.log(`stub server running at http://localhost:${PORT}`);
});