// Функция поднимает <br> на верхний уровень
export function outdent(el) {
	const docSel = document.getSelection();
	const selection = docSel.getRangeAt(0);
	const nodes = el.childNodes;
	const rng = document.createRange();
	rng.setStart(el, 0);
	rng.setEnd(el, nodes.length);
	docSel.addRange(rng);
	document.execCommand("outdent");
	docSel.removeAllRanges();
	docSel.addRange(selection);
}

// Функция оборачивает выбранный фрагмент в Span, с указанным стилем
export function wrapNodeInSpan(attr, value) {
	const range = window.getSelection().getRangeAt(0);
	const nodes = range.extractContents().childNodes;
	const fragment = document.createDocumentFragment();
	nodes.forEach((cld) => {
		const prev = cld.previousSibling;
		if (cld.nodeType == 3) {
			const span = createSpan(cld);
			span.style[attr] = value;
			fragment.appendChild(span);
		} else if (cld.localName === "br") {
			const br = document.createElement("br");
			fragment.appendChild(br);
		} else if (cld.localName === "span" && cld.innerText) {
			if (prev && stylesIsEqual(cld.style, prev.style)) {
				prev.innerText += cld.innerText;
			} else {
				const span = createSpan(cld);
				span.style[attr] = value;
				fragment.appendChild(span);
			}
		}
	});
	range.insertNode(fragment);
	range.detach();
}

export function copyStyles(copyTo, copyFrom) {
	let st1 = copyTo.style,
		st2 = copyFrom.style;
	if (!st1 || !st2) return;

	if (st2.color) st1.color = st2.color;
	if (st2.backgroundColor) st1.backgroundColor = st2.backgroundColor;
	if (st2.fontSize) st1.fontSize = st2.fontSize;
}

export function createSpan(el) {
	const span = document.createElement("span");
	span.innerText = copyNodeText(el);
	copyStyles(span, el);
	return span;
}

export function copyNodeText(node) {
	if (node.innerText) return node.innerText;
	else if (node.data) return node.data;
}

export function stylesIsEqual(st1, st2) {
	if (!st1 || !st2) return false;
	return (
		st1.color === st2.color &&
		st1.backgroundColor === st2.backgroundColor &&
		st1.fontSize === st2.fontSize
	);
}

// Функция для устранения вложеностей в Span
export function normalize(el) {
	const children = el.children;

	if (children.length) {
		children.forEach((a) => {
			const nodes = a.childNodes;
			const fragment = document.createDocumentFragment();
			const last = fragment.lastChild;
			if (a.localName === "span" && nodes.length) {
				nodes.forEach((n) => {
					if (last && stylesIsEqual(n.style, last.style)) {
						last.innerText += copyNodeText(n);
					} else {
						let span = document.createElement("span");
						copyStyles(span, a);
						copyStyles(span, n);
						span.innerText = copyNodeText(n);
						fragment.appendChild(span);
					}
				});
				el.replaceChild(fragment, a);
			}
		});
	}
}

// Функция склеивает соседние спаны с одинаковыми стилями
export function joinSpans(el) {
	const nodes = el.childNodes;
	nodes.forEach((a) => {
		const prev = a.previousSibling;
		if (
			nodes.length &&
			a.localName === "span" &&
			prev.localName === "span" &&
			stylesIsEqual(prev.style, a.style)
		) {
			prev.innerText += a.innerText;
			a.remove();
		}
	});
}

export function elNodesToJson(el) {
	const nodes = el.childNodes;
	const obj = [];
	nodes.forEach((a) => {
		const st = a.style;
		const prev = obj[obj.length - 1];
		if (a.nodeType === 3) {
			if (prev && prev.color === undefined) prev.text += a.data;
			else
				obj.push({
					text: a.data,
				});
		} else if (a.localName !== "br") {
			if (prev && stylesIsEqual(st, prev)) prev.text += a.innerText;
			else
				obj.push({
					text: a.innerText,
					color: st.color,
					backgroundColor: st.backgroundColor,
					fontSize: st.fontSize,
				});
		}
	});
	return obj;
}
