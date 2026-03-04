#!/usr/bin/env node
import { execSync } from "child_process";
import { copyFileSync, mkdirSync, cpSync } from "fs";
import { join } from "path";

const projectName = process.argv[2] || "my-api";
const projectPath = join(process.cwd(), projectName);

console.log(`Creating project: ${projectName}...`);
mkdirSync(projectPath);
cpSync(new URL("./template", import.meta.url), projectPath, {
  recursive: true,
});

console.log("Installing latest dependencies...");
const dependencies =
  "dotenv@latest express@latest express-validator@latest mongoose@latest nodemailer@latest";
const devDependencies =
  "@types/express@latest @types/morgan@latest @types/node@latest @types/nodemailer@latest morgan@latest nodemon@latest ts-node@latest typescript@latest";

execSync(`cd ${projectName} && npm install ${dependencies}`, {
  stdio: "inherit",
});
execSync(`cd ${projectName} && npm install -D ${devDependencies}`, {
  stdio: "inherit",
});
