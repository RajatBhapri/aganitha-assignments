import fs from "node:fs";
import path from "node:path";

import {
    Document,
    Packer,
    Paragraph,
    HeadingLevel,
} from "docx";

import type {
    GeneratedAuthorProject,
} from "../shared/types";

export async function generateDocx(
    data: GeneratedAuthorProject
) {
    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        text: data.author,
                        heading: HeadingLevel.TITLE,
                    }),

                    ...data.books.flatMap((book) => [
                        new Paragraph({
                            text: book.title,
                            heading: HeadingLevel.HEADING_1,
                        }),

                        new Paragraph({
                            text:
                                book.summary ||
                                "No summary available.",
                        }),
                    ]),
                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);

    const outputPath = path.join(
        process.cwd(),
        "output/docx",
        `${data.author}.docx`
    );

    fs.mkdirSync(
        path.dirname(outputPath),
        { recursive: true }
    );

    fs.writeFileSync(outputPath, buffer);

    return outputPath;
}