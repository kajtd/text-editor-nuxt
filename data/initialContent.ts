export const initialContent = `
<h1>Welcome to the Tiptap Editor Example</h1>

<p>This is a demonstration of various elements and features you can use in the Tiptap editor. Feel free to edit this content and explore the functionality!</p>

<h2>Text Formatting</h2>

<p>You can make text <strong>bold</strong>, <em>italic</em>, or <u>underlined</u>. You can also use <code>inline code</code> for technical terms.</p>

<p>Highlight any piece of text to bring up the toolbar for quick formatting options!</p>

<h2>Slash Commands</h2>

<p>Type '/' anywhere to bring up the slash commands menu. This allows you to quickly insert various types of content such as:</p>

<ul>
  <li>Headings</li>
  <li>Lists (bullet and numbered)</li>
  <li>Code blocks</li>
  <li>Images</li>
  <li>Quotes</li>
  <li>And more!</li>
</ul>

<h2>Lists</h2>

<p>Unordered list:</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<p>Ordered list:</p>
<ol>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ol>

<h2>Blockquote</h2>

<blockquote>
  <p>This is a blockquote. It's great for emphasizing important information or quoting sources.</p>
</blockquote>

<h2>Code Block</h2>

<pre><code class="language-javascript">function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('Hello world 🎈');</code></pre>

<h2>Image</h2>

<p>Here's an example of an image:</p>
<image-upload src="https://picsum.photos/800/400" alt="Random image from Unsplash" caption="Image from picsum.photos"></image-upload>

<h2>Horizontal Rule</h2>

<hr>

<h2>Exporting Your Content</h2>

<p>You can easily export your content in Markdown format:</p>

<ul>
  <li>Easy readability and editing</li>
  <li>Compatibility with various platforms and tools</li>
  <li>Converting to other formats (e.g., HTML, PDF) if needed</li>
</ul>

<p>Markdown export ensures your content remains portable and accessible across different environments.</p>

<h2>Final Notes</h2>

<p>That's it! Feel free to modify this content, try out the slash commands, use the toolbar for text formatting, and explore all the features of the Tiptap editor. Happy editing!</p>
`;
