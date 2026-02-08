import fs from 'fs';

// --- Text Splitter ---
export class SimpleTextSplitter {
    constructor({ chunkSize = 1000, chunkOverlap = 200 } = {}) {
        this.chunkSize = chunkSize;
        this.chunkOverlap = chunkOverlap;
    }

    splitText(text) {
        const chunks = [];
        let start = 0;

        while (start < text.length) {
            const end = Math.min(start + this.chunkSize, text.length);
            const chunk = text.slice(start, end);
            chunks.push(chunk);

            // Move start forward by chunkSize - overlap
            start += this.chunkSize - this.chunkOverlap;
        }
        return chunks;
    }

    async splitDocuments(documents) {
        const splitDocs = [];
        for (const doc of documents) {
            const chunks = this.splitText(doc.pageContent);
            for (const chunk of chunks) {
                splitDocs.push({
                    pageContent: chunk,
                    metadata: doc.metadata || {}
                });
            }
        }
        return splitDocs;
    }
}

// --- Vector Store ---
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export class SimpleVectorStore {
    constructor(embeddings) {
        this.embeddings = embeddings;
        this.vectors = []; // Array of { content, embedding, metadata }
    }

    async addDocuments(documents) {
        const texts = documents.map(d => d.pageContent);
        // Batch embedding to avoid overwhelming Ollama
        const batchSize = 5;
        for (let i = 0; i < texts.length; i += batchSize) {
            const batch = texts.slice(i, i + batchSize);
            const embeddings = await this.embeddings.embedDocuments(batch);

            for (let j = 0; j < batch.length; j++) {
                this.vectors.push({
                    content: documents[i + j].pageContent,
                    embedding: embeddings[j],
                    metadata: documents[i + j].metadata
                });
            }
            if (i % 20 === 0) console.log(`  Embedded ${i} / ${texts.length} chunks...`);
        }
    }

    async similaritySearch(query, k = 4) {
        const queryEmbedding = await this.embeddings.embedQuery(query);

        const scored = this.vectors.map(vec => ({
            content: vec.content,
            metadata: vec.metadata,
            score: cosineSimilarity(queryEmbedding, vec.embedding)
        }));

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, k).map(item => ({
            pageContent: item.content,
            metadata: item.metadata
        })); // Return structure similar to LangChain Document
    }

    save(path) {
        fs.writeFileSync(path, JSON.stringify(this.vectors));
    }

    static load(path, embeddings) {
        const store = new SimpleVectorStore(embeddings);
        if (fs.existsSync(path)) {
            const data = JSON.parse(fs.readFileSync(path, 'utf8'));
            store.vectors = data;
        }
        return store;
    }
}
