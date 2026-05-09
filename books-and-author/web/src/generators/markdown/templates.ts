import type {
    GeneratedAuthorProject,
    GeneratedBook,
} from "../shared/types";

export function generateBookMarkdown(
    book: GeneratedBook
) {
    return `
# ${book.title}

## Author
${book.author}

## Year
${book.year || "Unknown"}

## Summary
${book.summary || "No summary available."}

${book.description
            ? `## Description

${book.description}`
            : ""
        }
`;
}

export function generateAuthorMarkdown(
    data: GeneratedAuthorProject
) {
    return `
# ${data.author}

## Biography

${data.biography || "Biography unavailable."}

## Books

${data.books
            .map(
                (book) => `
- ${book.title} (${book.year || "Unknown"})
`
            )
            .join("")}
`;
}