const crypto = require("crypto");

// 암호화/복호화 설정
const algorithm = "aes-256-cbc";
const key = crypto.createHash("sha256").update("professor-nam").digest(); // SHA256 해싱으로 32바이트 생성
const iv = Buffer.from("1234567890123456", "utf8"); // 16바이트 IV

// 암호화 함수
function encryptObject(obj) {
  const jsonString = JSON.stringify(obj);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(jsonString, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

// 복호화 함수
function decryptObject(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}

module.exports = { encryptObject, decryptObject };
