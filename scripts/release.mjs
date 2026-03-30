#!/usr/bin/env bun
/**
 * Version bump script for InkWeave
 *
 * Usage:
 *   bun scripts/release.mjs patch     # Bump patch
 *   bun scripts/release.mjs minor    # Bump minor
 *   bun scripts/release.mjs major    # Bump major
 */

import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const input = process.argv[2] || "patch";

const packages = [
  "packages/core/package.json",
  "packages/react/package.json",
  "packages/plugins/package.json",
];

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function getBaseVersion(pkg) {
  const content = readFileSync(pkg, "utf8");
  const json = JSON.parse(content);
  return json.version;
}

function getNewVersion(baseVersion, bumpType) {
  const [major, minor, patch] = baseVersion.split(".").map(Number);
  switch (bumpType) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    default:
      console.error(`Invalid bump type: ${bumpType}`);
      process.exit(1);
  }
}

function updateVersions(newVersion) {
  const versionMap = {};

  for (const pkg of packages) {
    const content = readFileSync(pkg, "utf8");
    const json = JSON.parse(content);

    json.version = newVersion;
    writeFileSync(pkg, JSON.stringify(json, null, 2) + "\n");

    const pkgName = pkg.replace("packages/", "").replace("/package.json", "");
    versionMap[pkgName] = newVersion;
    console.log(`${pkgName}: ${json.version}`);
  }

  console.log("\nUpdating workspace dependencies...");

  for (const pkg of packages) {
    const content = readFileSync(pkg, "utf8");
    const json = JSON.parse(content);

    const updateDeps = (deps) => {
      if (!deps) return;
      for (const [dep, version] of Object.entries(deps)) {
        if (version.startsWith("workspace:")) {
          const depName = dep.replace("@inkweave/", "");
          if (versionMap[depName]) {
            deps[dep] = `^${versionMap[depName]}`;
          }
        }
      }
    };

    updateDeps(json.dependencies);
    updateDeps(json.peerDependencies);

    writeFileSync(pkg, JSON.stringify(json, null, 2) + "\n");
  }
}

function main() {
  if (!input || !["patch", "minor", "major"].includes(input)) {
    console.error("Usage: bun scripts/release.mjs <patch|minor|major>");
    process.exit(1);
  }

  const status = execSync("git status --porcelain", { encoding: "utf8" });
  if (status.trim()) {
    console.error("Error: Uncommitted changes detected. Commit or stash first.");
    console.error(status);
    process.exit(1);
  }

  const version = getNewVersion(getBaseVersion(packages[0]), input);

  console.log(`Updating to version: ${version}\n`);
  updateVersions(version);

  console.log("\nCommitting...");
  run("git add .");
  run(`git commit -m "chore(release): v${version}"`);
  run(`git tag v${version}`);

  console.log("\nPushing...");
  run("git push origin main");
  run(`git push origin v${version}`);
  run("git push origin --tags");

  console.log(`\n✅ Released v${version}`);
}

main();
