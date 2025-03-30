// src/blogData.ts

interface BlogPost {
    id: string;
    title: string;
    date: string;
    content: string;
    tags: string[];
}

// Use backticks (`) for the content string
// Sorted by id 
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'My First Webpage! WOW!',
    date: '2025-03-28',
    content: `Welcome to my corner of the World Wide Web!

This is pretty basic right now, but I'm learning. It's amazing what you can do with just text files and these '<tag>' things!

More to come soon! Gotta find some cool background images and maybe a MIDI file...

(Imagine a dancing banana here!)`,
    tags: ['first post', 'web dev']
  },
  {
    id: '2',
    title: 'Client-Side Image Steganography with Rust & WebAssembly',
    date: '2024-03-29',
    content: `I had a sudden, random urge lately to start learning Rust and WASM. I created several apps (with AI coding doing the heavy lifting) to play around.

Now I can copy huge ebooks from Project Gutenberg and easily encode the entire content perfectly into image files, all using WASM in milliseconds. How practical!

It uses a method called "Least Significant Bit" (LSB) steganography. Each tiny pixel in your image has color values (Red, Green, Blue). This tool slightly tweaks the very last bit of those color values to store the bits of your message. These changes are usually so small that they're invisible to the naked eye.

I learned quickly that the hidden message is fragile! You must save the image with the hidden message as a PNG file. Saving it as a JPEG or editing the image in almost any way will likely erase the hidden text.

Live Demo Here (Link: https://technotastic.github.io/pixel-embed-wasm/ )
`,
    tags: ['rust', 'sternography', 'wasm']
  },
];