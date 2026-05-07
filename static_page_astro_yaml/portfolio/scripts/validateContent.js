import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE = "./src/content/portfolios";

function validate() {
  const users = fs.readdirSync(BASE);

  let hasError = false;

  users.forEach((user) => {
    const userPath = path.join(BASE, user);

    if (!fs.lstatSync(userPath).isDirectory()) {
      console.log(`⚠️ Skipping non-folder: ${user}`);
      return;
    }

    const files = fs.readdirSync(userPath);

    files.forEach((file) => {
      if (!file.endsWith(".md")) return;

      const filePath = path.join(userPath, file);
      const raw = fs.readFileSync(filePath, "utf-8");

      try {
        const { data } = matter(raw);

        // ❌ missing title
        if (!data.title) {
          console.error(`❌ Missing title → ${filePath}`);
          hasError = true;
        }

        // ❌ missing author
        if (!data.author) {
          console.error(`❌ Missing author → ${filePath}`);
          hasError = true;
        }

        // ❌ mismatch folder vs author
        if (data.author !== user) {
          console.error(
            `❌ Author mismatch → ${filePath} (author=${data.author}, folder=${user})`
          );
          hasError = true;
        }

      } catch {
        console.error(`❌ Invalid frontmatter → ${filePath}`);
        hasError = true;
      }
    });
  });

  if (hasError) {
    console.error("\n🚨 Validation failed");
    process.exit(1);
  } else {
    console.log("✅ All content valid");
  }
}

validate();