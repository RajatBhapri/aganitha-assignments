import {
    getBooksByAuthor,
    getBookDetails,
} from "@/lib/services/books";

import { summarizeBook } from "@/lib/services/llm";

import type {
    GeneratedAuthorProject,
    GeneratedBook,
} from "./types";

export async function buildAuthorProject(
    authorName: string
): Promise<GeneratedAuthorProject> {
    // fetch books
    const books =
        await getBooksByAuthor(authorName);

    // limit books
    const topBooks = books
        .filter((b) => b?.title)
        .slice(0, 5);

    const generatedBooks: GeneratedBook[] =
        [];

    for (const book of topBooks) {
        try {
            // detailed metadata
            const detailed =
                await getBookDetails(book);

            // safe summary generation
            const summary =
                await summarizeBook(
                    detailed.title,
                    undefined,
                    {
                        sourceDescription:
                            detailed.description,
                    },
                    authorName
                );

            generatedBooks.push({
                title:
                    detailed.title ||
                    "Unknown Title",

                author: authorName,

                year: detailed.year,

                description:
                    detailed.description ||
                    "No description available.",

                summary:
                    summary ||
                    `"${detailed.title}" is a notable literary work.`,

                coverUrl:
                    detailed.coverUrl,
            });
        } catch (err) {
            console.error(
                "Failed generating book",
                err
            );
        }
    }

    return {
        author: {
            name: authorName,

            bio: `${authorName} is a notable literary author.`,
        },

        books: generatedBooks,
    };
}