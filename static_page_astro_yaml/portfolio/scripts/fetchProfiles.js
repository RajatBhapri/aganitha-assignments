import fs from "fs";
import path from "path";

const PROFILES_PATH = "./src/content/profiles.yaml";
const PORTFOLIO_PATH = "./src/content/portfolios";

// ==============================
// 🧠 READ EXISTING YAML
// ==============================
function readProfiles() {
  if (!fs.existsSync(PROFILES_PATH)) return {};

  const raw = fs.readFileSync(PROFILES_PATH, "utf-8");

  const lines = raw.split("\n");
  const data = {};

  let currentUser = null;

  lines.forEach((line) => {
    if (!line.trim()) return;

    if (!line.startsWith(" ")) {
      currentUser = line.replace(":", "").trim();
      data[currentUser] = {};
    } else if (currentUser) {
      const [key, value] = line.trim().split(": ");
      data[currentUser][key] = value;
    }
  });

  return data;
}

// ==============================
// 🧠 WRITE YAML
// ==============================
function writeProfiles(data) {
  let output = "";

  for (const user in data) {
    output += `${user}:\n`;

    for (const key in data[user]) {
      output += `  ${key}: ${data[user][key]}\n`;
    }
  }

  fs.writeFileSync(PROFILES_PATH, output);
}

// ==============================
// 🧠 GET USERS FROM FOLDERS
// ==============================
function getUsers() {
  const users = fs.readdirSync(PORTFOLIO_PATH);

  return users.filter((u) =>
    fs.statSync(path.join(PORTFOLIO_PATH, u)).isDirectory()
  );
}

// ==============================
// 🔥 FETCH FROM GITHUB
// ==============================
async function fetchGitHubUser(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    const data = await res.json();

    if (!data.login) return null;

    return {
      name: data.name || username,
      avatar: data.avatar_url,
      bio: data.bio || "",
      github: data.html_url,
      followers: data.followers,
      repos: data.public_repos,
    };
  } catch (err) {
    console.error("GitHub fetch failed:", username);
    return null;
  }
}

// ==============================
// 🚀 MAIN
// ==============================
async function run() {
  const existingProfiles = readProfiles();
  const users = getUsers();

  console.log("Users found:", users);

  for (const user of users) {
    if (existingProfiles[user]) {
      console.log(`✔ Skipping ${user} (already exists)`);
      continue;
    }

    console.log(`🚀 Fetching ${user}...`);

    const profile = await fetchGitHubUser(user);

    if (profile) {
      existingProfiles[user] = profile;
    }
  }

  writeProfiles(existingProfiles);

  console.log("✅ Profiles updated!");
}

run();