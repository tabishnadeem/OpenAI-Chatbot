// import ExcelJS from "exceljs"
const ExcelJS = require("exceljs")

 async function storeEmbedding(sheetName, id, embedding) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('embeddings.xlsx');
    const sheet = workbook.getWorksheet(sheetName) || workbook.addWorksheet(sheetName);

    sheet.addRow([id, JSON.stringify(embedding)]);

    await workbook.xlsx.writeFile('embeddings.xlsx');
}

async function getEmbeddings(text){
    const response = await axios.post('https://api.openai.com/v1/embeddings', {
        input:text,
        model:"text-embedding-ada-002"
    }, {
        headers: {
            'Authorization': `Bearer API_KEY`,
            'Content-Type': 'application/json'
        }
    });

    return response.data;
}

async function processQueryAndGenerateResponse(queryId, queryEmbedding) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('embeddings.xlsx');
    const pdfSheet = workbook.getWorksheet('PDFEmbeddings');

    let mostRelevantPdfId;
    let highestSimilarity = 0;

    // Iterate over PDF embeddings and compare with query embedding
    pdfSheet.eachRow(row => {
        const pdfId = row.getCell(1).value;
        const pdfEmbedding = JSON.parse(row.getCell(2).value);

        const similarity = compareEmbeddings(pdfEmbedding, queryEmbedding);
        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            mostRelevantPdfId = pdfId;
        }
    });

    // Generate a response based on the most relevant PDF embedding
    return `Response based on PDF ${mostRelevantPdfId} with similarity ${highestSimilarity}`;
}

function dotProduct(vecA, vecB) {
    return vecA.reduce((acc, current, index) => acc + current * vecB[index], 0);
}

function magnitude(vec) {
    return Math.sqrt(vec.reduce((acc, current) => acc + Math.pow(current, 2), 0));
}

function cosineSimilarity(vecA, vecB) {
    return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
}

function compareEmbeddings(embedding1, embedding2) {
    // Ensure both embeddings are arrays of numbers
    if (!Array.isArray(embedding1) || !Array.isArray(embedding2)) {
        throw new Error("Invalid embeddings - must be arrays of numbers");
    }

    // Ensure embeddings have the same length
    if (embedding1.length !== embedding2.length) {
        throw new Error("Embeddings must be of the same length");
    }

    return cosineSimilarity(embedding1, embedding2);
}



exports.storeEmbedding = storeEmbedding;
exports.getEmbeddings = getEmbeddings;
exports.processQueryAndGenerateResponse = processQueryAndGenerateResponse;