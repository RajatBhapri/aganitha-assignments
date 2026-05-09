import path from "node:path";

import PptxGenJS from "pptxgenjs";

import type {
  GeneratedAuthorProject,
} from "../shared/types";

export async function generatePpt(
  data: GeneratedAuthorProject
) {
  const ppt = new PptxGenJS();

  // title slide
  const intro = ppt.addSlide();

  intro.addText(data.author, {
    x: 1,
    y: 1,
    w: 8,
    h: 1,
    fontSize: 28,
    bold: true,
  });

  // book slides
  for (const book of data.books) {
    const slide = ppt.addSlide();

    slide.addText(book.title, {
      x: 0.5,
      y: 0.5,
      w: 8,
      h: 0.6,
      fontSize: 22,
      bold: true,
    });

    slide.addText(
      book.summary ||
        "No summary available.",
      {
        x: 0.5,
        y: 1.5,
        w: 8,
        h: 3,
        fontSize: 14,
      }
    );
  }

  const outputPath = path.join(
    process.cwd(),
    "output/ppt",
    `${data.author}.pptx`
  );

  await ppt.writeFile({
    fileName: outputPath,
  });

  return outputPath;
}