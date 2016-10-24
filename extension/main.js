// Get stored options
chrome.storage.sync.get([
	'simple',
	'disabledSites'
], options => {
	const { simple, disabledSites } = options;

	// Debug mode if on localhost
	const debug = window.location.href.indexOf('localhost') > -1;
	if (debug) console.log('Debugging the Emojify-Everything extension!');

	// Define emoji library
	let obj;
	if (debug) {
		// Use reduced library for debugging
		obj = { "fire": "🔥", "train": "🚋", "+1": "💯", };
	} else if (simple) {
		// Use slightly reduced library if the options is checked
		obj = simpleEmojis;
	} else {
		// Use the real deal giant library
		obj = emojis;
	}

	// Set flag to run extension
	let runExt = false;

	// For each site listed in the disabledSites array
	for (let i = 0; i < disabledSites.length; i++) {
		// Check if the current URL contains the string
		if(window.location.href.indexOf(disabledSites[i]) > -1) {
			// Set the flag to true
			runExt = true;
			break;
		}
	}

	// Run unless the flag is false
	if (runExt) {
		walk(document.body);
	}

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
		// Quick ES6 Destructuring to capitalize the first letter of a string
		const capitalize = ([first,...rest]) => first.toUpperCase() + rest.join('');

		// Capture current textNode value
		let v = textNode.nodeValue;

		// Loop through every item in the emoji library
	  Object.keys(obj).map(itm => {
			// Escape any glyphs by placing \ in front of them
	    const str = itm.replace(/([+<>*()?])/g, '\\$1');

			// Regex to find the key
	    const re = new RegExp('\\b' + str + '\\b','g');
	    // Check if the string exists in the textNode
	    if(v.search(re) >= 0){
	      v = v.replace(re, obj[itm]);
	    }

			// Regex to find the title-case key
			const reCap = new RegExp('\\b' + capitalize(str) + '\\b','g');
			// Check if the capitalized string exists in the textNode
	    if(v.search(reCap) >= 0){
	      v = v.replace(reCap, obj[itm]);
	    }
	  });

		// Replace the textNode's value with the new one
		textNode.nodeValue = v;
	}
});
