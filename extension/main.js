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

function handleText(textNode)  {
	let v = textNode.nodeValue;

  const testEmojis = {
    "fire": "🔥",
    "+1": "💯",
    "train": "🚋",
  }

  const obj = debug ? { "fire": "🔥", "train": "🚋" } : emojis;

  Object.keys(obj).map(itm => {
    const str = itm.replace(/([+<>*()?])/g, "\\$1");
    const re = new RegExp("\\b" + str + "\\b",'g');

    // Check if the string exists in the textNode
    if(v.search(re) >= 0){
      v = v.replace(re, obj[itm]);
    }
  });

	textNode.nodeValue = v;
}
