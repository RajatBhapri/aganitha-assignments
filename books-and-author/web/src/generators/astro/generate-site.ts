import fs from "node:fs";
import path from "node:path";

import { execa } from "execa";

type GenerateSiteInput = {
    author: {
        name: string;
        bio: string;
    };

    books: {
        title: string;
        author?: string;
        year?: number;
        summary: string;
        coverUrl?: string;
    }[];
};

function slugify(value?: string) {
    if (!value) {
        return `unknown-${Date.now()}`;
    }

    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export async function generateAstroSite(
    input: GenerateSiteInput
) {
    const astroRoot = path.join(
        process.cwd(),
        "astro-site"
    );

    const authorsDir = path.join(
        astroRoot,
        "src/content/authors"
    );

    const booksDir = path.join(
        astroRoot,
        "src/content/books"
    );

    fs.mkdirSync(authorsDir, {
        recursive: true,
    });

    fs.mkdirSync(booksDir, {
        recursive: true,
    });

    // AUTHOR MARKDOWN

    const authorSlug = slugify(
        input.author.name
    );

    const authorMarkdown = `---
name: ${input.author.name}
bio: ${input.author.bio}
---
`;

    fs.writeFileSync(
        path.join(
            authorsDir,
            `${authorSlug}.md`
        ),
        authorMarkdown
    );

    // BOOK MARKDOWN

    for (
        const book of input.books.filter(
            (b) => b?.title
        )
    ) {
        const bookSlug = slugify(
            book.title
        );

        const markdown = `---
title: ${book.title}
author: ${book.author ||
            input.author.name
            }
year: ${book.year || ""}
summary: |
  ${book.summary.replace(
                /\n/g,
                "\n  "
            )}
coverUrl: ${book.coverUrl || ""}
---
`;

        fs.writeFileSync(
            path.join(
                booksDir,
                `${bookSlug}.md`
            ),
            markdown
        );
    }

    console.log(authorsDir);
    console.log(booksDir);

    // BUILD ASTRO

    await execa(
        "bun",
        ["run", "build"],
        {
            cwd: astroRoot,
            stdio: "inherit",
        }
    );

    return path.join(
        astroRoot,
        "dist"
    );
}