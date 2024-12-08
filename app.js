const express = require("express");
const { encryptObject, decryptObject } = require("./crypto");

const app = express();
app.use(express.json());

// 파일 정보 (샘플 데이터베이스 대체)
const files = [
  { id: 1, name: "file1.txt", size: "2MB", type: "text/plain" },
  { id: 2, name: "file2.jpg", size: "5MB", type: "image/jpeg" },
];

// 암호화된 링크 생성
app.get("/generate-link/:id", (req, res) => {
  const fileId = parseInt(req.params.id, 10);
  const file = files.find((f) => f.id === fileId);

  if (!file) {
    return res.status(404).json({ error: "File not found." });
  }

  const encryptedData = encryptObject({ id: file.id });
  const link = `http://localhost:3000/access?data=${encodeURIComponent(
    encryptedData
  )}`;

  res.json({
    message: "Encrypted access link generated.",
    link,
  });
});

// 암호화된 링크 접근 및 HATEOAS 제공
app.get("/access", (req, res) => {
  const { data } = req.query;

  try {
    const decryptedData = decryptObject(data);
    const file = files.find((f) => f.id === decryptedData.id);

    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }

    res.json({
      file,
      _links: {
        self: { href: `/access?data=${encodeURIComponent(data)}` },
        download: { href: `/download/${file.id}` },
        delete: { href: `/delete/${file.id}`, method: "DELETE" },
      },
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid or malformed encrypted data." });
  }
});

// 파일 다운로드
app.get("/download/:id", (req, res) => {
  const fileId = parseInt(req.params.id, 10);
  const file = files.find((f) => f.id === fileId);

  if (!file) {
    return res.status(404).json({ error: "File not found." });
  }

  res.json({ message: `File ${file.name} is being downloaded.` });
});

// 파일 삭제
app.delete("/delete/:id", (req, res) => {
  const fileId = parseInt(req.params.id, 10);
  const fileIndex = files.findIndex((f) => f.id === fileId);

  if (fileIndex === -1) {
    return res.status(404).json({ error: "File not found." });
  }

  files.splice(fileIndex, 1);
  res.json({ message: `File with ID ${fileId} has been deleted.` });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
