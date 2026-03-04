#!/usr/bin/env node
import { execSync } from "child_process";
import { copyFileSync, mkdirSync, cpSync, readdirSync } from "fs";
import { join, basename } from "path";

const projectName = process.argv[2] || "my-api";
const isCurrentDir = projectName === ".";
const projectPath = isCurrentDir
  ? process.cwd()
  : join(process.cwd(), projectName);

console.log(
  `Creating project${isCurrentDir ? " in current directory" : ": " + projectName}...`,
);

if (!isCurrentDir) {
  mkdirSync(projectPath);
}

cpSync(new URL("./template", import.meta.url), projectPath, {
  recursive: true,
});

console.log("Installing latest dependencies...");
const dependencies =
  "dotenv@latest express@latest express-validator@latest mongoose@latest nodemailer@latest";
const devDependencies =
  "@types/express@latest @types/morgan@latest @types/node@latest @types/nodemailer@latest morgan@latest nodemon@latest ts-node@latest typescript@latest";

const cdCommand = isCurrentDir ? "" : `cd ${projectName} && `;

execSync(`${cdCommand}npm install ${dependencies}`, {
  stdio: "inherit",
  cwd: projectPath,
});
execSync(`${cdCommand}npm install -D ${devDependencies}`, {
  stdio: "inherit",
  cwd: projectPath,
});
