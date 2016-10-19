// Debug mode if on localhost
const debug = location.href === 'localhost:8000';
if (debug) console.log('Debugging the Emojify-Everything extension!');

walk(document.body);

function walk(node) {
	// This function comes from:
	// http://is.gd/mwZp7E
	let child, next;

	switch (node.nodeType) {
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while (child) {
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;
		case 3: // Text node
			handleText(node);
			break;
	}
}

// Quick ES6 Destructuring to capitalize the first letter of a string
const capitalize = ([first,...rest]) => first.toUpperCase() + rest.join('');

function handleText(textNode)  {
	let v = textNode.nodeValue;

	// Use a reduced library for testing
  const obj = debug ? { "fire": "🔥", "train": "🚋", "+1": "💯", } : emojis;

	// Loop through every item in the emoji library
  Object.keys(obj).map(itm => {
		// Escape any glyphs by placing \ in front of them
    const str = itm.replace(/([+<>*()?])/g, "\\$1");
		// Regex to find the key
    const re = new RegExp("\\b" + str + "\\b",'g');
		// Regex to find the title-case key
    const reCap = new RegExp("\\b" + capitalize(str) + "\\b",'g');

    // Check if the string exists in the textNode
    if(v.search(re) >= 0){
      v = v.replace(re, obj[itm]);
    }
		// Check if the capitalized string exists in the textNode
    if(v.search(reCap) >= 0){
      v = v.replace(reCap, obj[itm]);
    }
  });

	// Replace the textNode's value with the new one
	textNode.nodeValue = v;
}
