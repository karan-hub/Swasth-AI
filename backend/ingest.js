import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { OllamaEmbeddings } from "@langchain/ollama";
import { SimpleVectorStore, SimpleTextSplitter } from './utils.js';

const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');

// Robustly find the pdf function
let pdf = pdfModule;
if (typeof pdf !== 'function' && typeof pdf.default === 'function') {
    pdf = pdf.default;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const VECTOR_STORE_PATH = path.join(__dirname, 'vector_store.json');

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral";
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

async function ingestDocs() {
    const files = fs.readdirSync(DATA_DIR).filter(file => file.endsWith('.pdf'));

    if (files.length === 0) {
        console.log("No PDF files found in backend/data/");
        return;
    }

    console.log(`Found ${files.length} PDFs.`);

    if (typeof pdf !== 'function') {
        console.error("CRITICAL: pdf-parse import failed. It is:", pdfModule);
        return;
    }

    let allDocs = [];

    for (const file of files) {
        console.log(`Processing ${file}...`);
        try {
            const dataBuffer = fs.readFileSync(path.join(DATA_DIR, file));
            const data = await pdf(dataBuffer);

            // Cleanup text
            const cleanText = data.text.replace(/\n\s*\n/g, '\n\n');

            const docs = [{
                pageContent: cleanText,
                metadata: { source: file }
            }];

            const splitter = new SimpleTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
            });

            const splitDocs = await splitter.splitDocuments(docs);
            allDocs.push(...splitDocs);
            console.log(`  - ${file}: ${splitDocs.length} chunks`);
        } catch (err) {
            console.error(`  ! Error processing ${file}: ${err.message}`);
        }
    }

    if (allDocs.length === 0) {
        console.log("No documents processed. Exiting.");
        return;
    }

    console.log(`Embedding ${allDocs.length} chunks with ${OLLAMA_EMBED_MODEL}... (This will be faster)`);

    const embeddings = new OllamaEmbeddings({
        model: OLLAMA_EMBED_MODEL,
        baseUrl: OLLAMA_BASE_URL,
    });

    try {
        let vectorStore;
        if (fs.existsSync(VECTOR_STORE_PATH)) {
            console.log("Found existing vector store. Checking for resume...");
            vectorStore = SimpleVectorStore.load(VECTOR_STORE_PATH, embeddings);
            console.log(`Loaded ${vectorStore.vectors.length} existing vectors.`);
        } else {
            vectorStore = new SimpleVectorStore(embeddings);
        }

        const startIndex = vectorStore.vectors.length;
        if (startIndex >= allDocs.length) {
            console.log("Vector store is already complete with all documents!");
            return;
        }

        console.log(`Resuming ingestion from chunk ${startIndex} / ${allDocs.length}...`);

        // Add documents in chunks and save incrementally
        const CHUNK_SIZE = 20;
        for (let i = startIndex; i < allDocs.length; i += CHUNK_SIZE) {
            const chunk = allDocs.slice(i, i + CHUNK_SIZE);
            await vectorStore.addDocuments(chunk);
            vectorStore.save(VECTOR_STORE_PATH); // Save after each chunk
            console.log(`  Saved progress: ${Math.min(i + CHUNK_SIZE, allDocs.length)} / ${allDocs.length}`);
        }

        console.log(`Ingestion Complete! Vector store saved to ${VECTOR_STORE_PATH}`);
    } catch (e) {
        console.error("Error creating/saving vector store:", e);
        if (e.message && e.message.includes("fetch failed")) {
            console.error("CRITICAL: Could not connect to Ollama. Make sure 'ollama serve' is running!");
        }
        process.exit(1);
    }
}

ingestDocs();
