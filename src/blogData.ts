// src/blogData.ts

interface BlogPost {
    id: string;
    title: string;
    date: string;
    content: string;
    tags: string[]
    imageUrl?: string;
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
  {
    id: '3',
    title: 'To blog, or not to blog',
    date: '2024-03-31',
    content: `I made this blog as an experiment to see how close I could match the old 90's web aesthetic, but now I'm thinking I might actually start using it.. 

I'll update it if I create any new projects or learn anything cool.  I worked non-stop through lunch with Kotlin/Jetpack Compose at work today so I don't have much energy to post anything interesting yet though.  I'm really happy with the result at least. 

Things change so much so this will age like spoiled milk, but I've been playing around with the new Gemini Pro 2.5 Experimental model on Google's AI Studio the last few days and really digging it. `,
    tags: ['personal']
  },
  {
    id: '4',
    title: 'Asciifyer',
    date: '2024-04-01',
    content: `Created an image to ASCII converter.  I think I will use it to generate some somewhat-unique visual content for the blog.  I call it Asciifyer and it's living here for now: https://technotastic.github.io/ascii-art-generator/`,
    tags: ['ascii'],
    imageUrl: 'images/post4.png'
  },
  {
    id: '5',
    title: 'KiraKira Kotoba',
    date: '2024-04-02',
    content: `Made site today for drilling Japanese onomatopoeia.  These have always been very difficult for me so this was a way to force a little bit of practice while testing.  https://technotastic.github.io/kirakirakotoba/`,
    tags: ['web dev'],
    imageUrl: 'images/post5.png'
  },
];