// src/blogData.ts

// You can define the interface here or import it if it's defined elsewhere
interface BlogPost {
    id: string;
    title: string;
    date: string;
    content: string;
    tags: string[];
}

// Export the array directly
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'My First Webpage! WOW!',
    date: '1993-02-15',
    // Use backticks (`) for the content string
    content: `Welcome to my corner of the World Wide Web!

This is pretty basic right now, but I'm learning HTML. It's amazing what you can do with just text files and these '<tag>' things.

Look, I can make lists:
*   Thing one
*   Thing two
*   Another thing!

And tables!

| Header 1 | Header 2 |
|----------|----------|
| Data A   | Data B   |
| Data C   | Data D   |

More to come soon! Gotta find some cool background images and maybe a MIDI file...

(Imagine a dancing banana here!)`,
    tags: ['first post', 'html', 'web development', 'geocities']
  },
  {
    id: '2',
    title: 'The Wonders of the Web - Search Engines!',
    date: '1993-03-01',
    content: `I can't believe how much stuff is out there! People are putting up pages about everything.

How do you find anything? Search engines! I've been using Yahoo! mostly. It's like a giant directory.

It's fun to just click around and see what you discover. Found a site with cool ASCII art yesterday.

Here's a little table of cool sites (well, the ones I remember):

| Name         | Age | Favorite Thing |
|--------------|-----|----------------|
| Me           | ??  | This Blog! :)  |
| Friend       | ??  | Hamster Dance? |
| Another Site | ??? | ???            |

Okay, the table needs work. Still learning!

What are your favorite search engines or cool sites? Leave a comment (if I figure out how to add comments...).`,
    tags: ['web', 'internet', 'search', 'yahoo', 'cool sites', 'discovery']
  },
  {
    id: '3',
    title: 'Learning JavaScript - Making things MOVE!',
    date: '1995-12-04',
    content: `Okay, this new thing called JavaScript just came out with Netscape Navigator 2.0. It's supposed to let you make web pages interactive!

It seems... complicated. But also really cool. You can make things happen when people click buttons, or even change images.

Here's my first attempt at a script:

// My first script!
function showAlert() {
  alert("You clicked the button! Wow!");
}

// Need to figure out how to add a button in HTML to call this...
// <button onclick="showAlert()">Click Me!</button> ??

Maybe I can make that dancing banana *actually* dance...

Or maybe just change the background color when you move the mouse? So many possibilities!

... gotta test that. This could crash the browser! Wish me luck.`,
    tags: ['javascript', 'netscape', 'programming', 'newbie', 'interactive']
  }
];