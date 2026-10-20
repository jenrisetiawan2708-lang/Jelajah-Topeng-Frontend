import { randomBytes, scryptSync } from "node:crypto";

if (!process.stdin.isTTY) {
  console.error("Run this script in an interactive terminal.");
  process.exit(1);
}

process.stdout.write("Admin password (hidden, 12+ characters): ");
process.stdin.setRawMode(true);
process.stdin.resume();
let password = "";
process.stdin.on("data", (chunk) => {
  for (const char of chunk.toString("utf8")) {
    if (char === "\u0003") process.exit(1);
    if (char === "\r" || char === "\n") {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
      if (password.length < 12) {
        console.error("Use at least 12 characters and run again.");
        process.exit(1);
      }
      const salt = randomBytes(16).toString("hex");
      const hash = scryptSync(password, salt, 64).toString("hex");
      console.log(`scrypt$${salt}$${hash}`);
      process.exit(0);
    }
    if (char === "\u007f" || char === "\b") {
      password = password.slice(0, -1);
    } else if (char >= " ") {
      password += char;
    }
  }
});
