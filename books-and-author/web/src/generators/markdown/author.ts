import path from "node:path";

import {
    generateAuthorMarkdown,
    generateBookMarkdown,
} from "./templates";

import {
    ensureDir,
    writeFile,
} from "../shared/filesystem";

import type {
    GeneratedAuthorProject,
} from "../shared/types";

export async function generateAuthorMarkdownFiles(
    data: GeneratedAuthorProject
) {
    const baseDir = path.join(
        process.cwd(),
        "content/generated",
        data.author
            .toLowerCase()
            .replaceAll(" ", "-")
    );

    ensureDir(baseDir);

    // index.md
    const authorMarkdown =
        generateAuthorMarkdown(data);

    writeFile(
        path.join(baseDir, "index.md"),
        authorMarkdown
    );

    // books
    for (const book of data.books) {
        const slug = book.title
            .toLowerCase()
            .replaceAll(" ", "-");

        const markdown =
            generateBookMarkdown(book);

        writeFile(
            path.join(baseDir, `${slug}.md`),
            markdown
        );
    }

    return baseDir;
}