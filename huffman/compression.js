// Node class for Huffman Tree
class Node {
    constructor(symbol, frequency) {
        this.symbol = symbol;
        this.frequency = frequency;
        this.left = null;
        this.right = null;
    }
}

// Function to build Huffman Tree
function buildHuffmanTree(frequencies) {
    let nodes = frequencies.map(([symbol, frequency]) => new Node(symbol, frequency));

    while (nodes.length > 1) {
        nodes.sort((a, b) => a.frequency - b.frequency);

        let left = nodes.shift();
        let right = nodes.shift();

        let parent = new Node(null, left.frequency + right.frequency);
        parent.left = left;
        parent.right = right;

        nodes.push(parent);
    }

    return nodes[0];
}

// Function to generate Huffman codes
function generateHuffmanCodes(node, code = '', codes = {}) {
    if (node.symbol !== null) {
        codes[node.symbol] = code;
    } else {
        generateHuffmanCodes(node.left, code + '0', codes);
        generateHuffmanCodes(node.right, code + '1', codes);
    }
    return codes;
}

// Huffman Encoding
function huffmanEncode(text) {
    if (!text) return '';

    const frequencies = {};
    for (let char of text) {
        frequencies[char] = (frequencies[char] || 0) + 1;
    }
    const tree = buildHuffmanTree(Object.entries(frequencies));
    const huffmanCodes = generateHuffmanCodes(tree);

    return text.split('').map(char => huffmanCodes[char]).join('');
}

// LZW Encoding
function lzwEncode(text) {
    const dictionary = {};
    let current = '';
    const result = [];
    let dictSize = 256;

    // Initialize the dictionary with all single characters
    for (let i = 0; i < 256; i++) {
        dictionary[String.fromCharCode(i)] = i;
    }

    for (let char of text) {
        const combined = current + char;
        if (dictionary.hasOwnProperty(combined)) {
            current = combined;
        } else {
            result.push(dictionary[current]);
            dictionary[combined] = dictSize++;
            current = char;
        }
    }

    if (current !== '') {
        result.push(dictionary[current]);
    }

    return result.join(',');
}

// Run-Length Encoding (RLE)
function rleEncode(text) {
    if (!text) return '';

    let encoded = '';
    let count = 1;

    for (let i = 1; i <= text.length; i++) {
        if (text[i] === text[i - 1]) {
            count++;
        } else {
            encoded += text[i - 1] + count;
            count = 1;
        }
    }

    return encoded;
}

// Function to handle encoding based on the selected algorithm
function encodeText() {
    const inputText = document.getElementById('inputText').value;
    const algorithm = document.getElementById('algorithmSelect').value;
    let encodedText = '';

    switch (algorithm) {
        case 'huffman':
            encodedText = huffmanEncode(inputText);
            break;
        case 'lzw':
            encodedText = lzwEncode(inputText);
            break;
        case 'rle':
            encodedText = rleEncode(inputText);
            break;
        default:
            encodedText = 'Invalid algorithm selected';
    }

    document.getElementById('encodedText').value = encodedText;
}
