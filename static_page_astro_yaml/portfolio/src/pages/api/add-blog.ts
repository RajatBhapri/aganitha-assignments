// import type { APIRoute } from 'astro';
// import fs from 'fs';
// import path from 'path';

// export const prerender = false;

// export const POST: APIRoute = async ({ request }) => {
//   try {
//     const body = await request.json();

//     const { slug, content } = body;

//     if (!slug || !content) {
//       return new Response(
//         JSON.stringify({ message: "Missing slug or content" }),
//         { status: 400 }
//       );
//     }

//     const dir = path.join(process.cwd(), 'src/content/portfolios', slug);

//     if (!fs.existsSync(dir)) {
//       return new Response(
//         JSON.stringify({ message: "User not found" }),
//         { status: 404 }
//       );
//     }

//     const filename = `blog-${Date.now()}.md`;
//     const filepath = path.join(dir, filename);

//     fs.writeFileSync(filepath, content);

//     return new Response(
//       JSON.stringify({ message: "✅ Blog added successfully" }),
//       { status: 200 }
//     );

//   } catch (err) {
//     console.error("🔥 ERROR:", err);

//     return new Response(
//       JSON.stringify({ message: "Server error" }),
//       { status: 500 }
//     );
//   }
// };