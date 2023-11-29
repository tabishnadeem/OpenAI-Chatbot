const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const fs = require('fs');
const { storeEmbedding, getEmbeddings, processQueryAndGenerateResponse } = require('./helper');

const app = express();

app.get('/app',(req,res)=>{
    res.json({message:"Hello World"})
})

const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

// const upload = multer({ dest: 'uploads/' });
// Endpoint for uploading PDF files
app.post('/upload',upload.single('pdf'), async (req, res) => {
    try {
        // Extract text from PDF
        const pdfData = await pdfParse(req.file.buffer);
        const text = pdfData.text;
        
    
       

        // Process response from OpenAI
        const chatbotResponse = getEmbeddings(text);

        const embedding = chatbotResponse.embedding;

        await storeEmbedding('PDFEmbeddings', 'pdf_' + Date.now(), embedding);

        res.json({message: "PDF Processed"})


    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Error processing file');
    }
});

app.post('/chat', async (req, res) => {
    // const {userInput} = req.body;
    
    // const queryEmbedding = await getEmbeddings(userInput);
    // const queryId = 'query_' + Date.now();
    // await storeEmbedding('QueryEmbeddings', queryId, queryEmbedding);

    // Call function to process query and generate response
    // const response = await processQueryAndGenerateResponse(queryId, queryEmbedding);

    res.json({ message: req.body });
});



const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
