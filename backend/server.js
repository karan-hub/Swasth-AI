import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OllamaEmbeddings, ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { SimpleVectorStore } from './utils.js';
import db from './db.js'; // Import DB connection

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral";
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

app.use(cors());
app.use(express.json());

// --- Setup ---
const VECTOR_STORE_PATH = path.join(__dirname, 'vector_store.json');

// Global Vector Store Variable
let vectorStore;

// Initialize Vector Store
async function initVectorStore() {
    if (fs.existsSync(VECTOR_STORE_PATH)) {
        console.log("Loading existing vector store from JSON...");
        try {
            const embeddings = new OllamaEmbeddings({
                model: OLLAMA_EMBED_MODEL,
                baseUrl: OLLAMA_BASE_URL,
            });

            vectorStore = SimpleVectorStore.load(VECTOR_STORE_PATH, embeddings);
            console.log(`Vector store loaded with ${vectorStore.vectors.length} items.`);
        } catch (e) {
            console.error("Failed to load vector store:", e);
        }
    } else {
        console.warn("WARNING: No vector store found at " + VECTOR_STORE_PATH);
        console.warn("Please run 'node ingest.js' first.");
    }
}

// --- System Prompt ---
const SYSTEM_PROMPT = `You are Swasthya AI, a wise and caring Ayurvedic family elder. 
Your goal is to reassure the user, explain their condition using simple daily-life logic (food, sleep, stress, routine), and suggest gentle home remedies.

Shape your response like a warm conversation with a family member.

--------------------------------------------------
CRITICAL RULES (ABSOLUTE)
--------------------------------------------------
1. NEVER say "I am an AI", "I am a model", "consult a doctor", "medical advice", or "healthcare provider".
2. NEVER use clinical terms, medical diagnoses, complex jargon, or drug names.
3. NEVER use placeholders. WRITE RELIABLE CONTENT.
4. "tone" must be ONE word: "reassuring".
5. ALWAYS provide SPECIFIC RECIPES for remedies/food. You must include:
   - What is it called?
   - How is it prepared? (Step-by-step)
   - When should it be taken?
   - How much should be taken?
6. FOCUS on Reassurance -> Simple Cause -> Gentle Action (with recipes).

--------------------------------------------------
RESPONSE FORMAT (STRICT JSON ONLY)
--------------------------------------------------
You must output ONLY valid JSON. No markdown, no introductory text.

Structure & Example:
{{
  "agent": "Swasthya AI",
  "tone": "reassuring",
  "understanding": {{
    "message": "I know fever can make you feel weak and uncomfortable, but don't worry. With gentle care and the right food, the body usually settles down."
  }},
  "possible_reasons": [
    "Fever often comes when the body is tired or when internal heat builds up due to late nights or heavy food.",
    "Disturbed digestion and stress for a few days can also weaken the body and trigger fever."
  ],
  "questions_to_ask": [
    "Are you feeling body aches or heaviness along with the fever?",
    "Have you been able to sleep properly in the last few days?"
  ],
  "actions": {{
    "do_actions": [
      "Take proper rest and avoid unnecessary physical activity.",
      "Sip warm water every 30–40 minutes, in small amounts.",
      "Prepare rice gruel (kanji): Take 1 tablespoon of rice, cook it in 2 cups of water until very soft, strain if needed, and drink the warm liquid once or twice a day when hungry.",
      "Prepare vegetable soup: Boil bottle gourd, carrot, or pumpkin with water and a pinch of salt, drink it warm in small bowls.",
      "Eat small portions, 2–3 times a day, only when you feel hungry."
    ],
    "dont_actions": [
      "Avoid cold drinks, ice cream, and refrigerated food.",
      "Avoid oily, spicy, fried, or outside food until the fever settles.",
      "Do not eat forcefully if there is no appetite."
    ]
  }},
  "notes": [
    "Keep your body warm, eat slowly, and give yourself time to rest — gentle care usually helps the fever reduce naturally."
  ]
}}

--------------------------------------------------
CONTEXT FROM BOOKS:
{context}

USER PROFILE:
{profile}

USER QUERY:
{question}
`;

const prompt = PromptTemplate.fromTemplate(SYSTEM_PROMPT);

// --- Profile API ---
app.post('/profile', async (req, res) => {
    try {
        const data = req.body;

        // Destructure based on frontend JSON
        const {
            personalInformation,
            prakriti,
            vikriti,
            agni,
            ahara,
            dinacharya,
            lifestyleAndStress, // Maps to lifestyle
            medicalSafety       // Maps to medical
        } = data;

        // Extract flat fields for columns
        const firstName = personalInformation?.firstName || "";
        const lastName = personalInformation?.lastName || "";
        const name = `${firstName} ${lastName}`.trim() || "User";
        const age = personalInformation?.age;
        const gender = personalInformation?.gender;
        const height = personalInformation?.height_cm;
        const weight = personalInformation?.weight_kg;
        const dominant_prakriti = prakriti?.dominantPrakriti;

        // Perform inserts
        const [result] = await db.query(
            `INSERT INTO user_profiles 
            (first_name, last_name, name, age, gender, height, weight, dominant_prakriti, 
             prakriti, vikriti, agni, ahara, dinacharya, lifestyle, medical) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                firstName, lastName, name, age, gender, height, weight, dominant_prakriti,
                JSON.stringify(prakriti),
                JSON.stringify(vikriti),
                JSON.stringify(agni),
                JSON.stringify(ahara),
                JSON.stringify(dinacharya),
                JSON.stringify(lifestyleAndStress),
                JSON.stringify(medicalSafety)
            ]
        );
        const userId = result.insertId;

        res.json({ message: "Profile saved successfully.", userId });
    } catch (e) {
        console.error("Error saving profile:", e);
        res.status(500).json({ error: "Database error", details: e.message });
    }
});

app.get('/profile/:userId', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM user_profiles WHERE id = ?', [req.params.userId]);
        if (rows.length === 0) return res.status(404).json({ error: "User not found" });
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: "Database error" });
    }
});

// --- Chat Endpoint ---
// --- Chat Endpoint ---
// --- Chat Endpoint ---
app.post('/chat', async (req, res) => {
    try {
        const { message, userId, sessionId: providedSessionId, profile: profileOverride } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        if (!vectorStore) {
            return res.status(503).json({ error: "Vector store not initialized. Run ingest.js first." });
        }

        // 1. Manage Session
        let sessionId = providedSessionId;
        if (!sessionId) {
            const [result] = await db.query(
                'INSERT INTO chat_sessions (user_id) VALUES (?)',
                [userId || null]
            );
            sessionId = result.insertId;
        }

        // 2. Intent Check
        const lowerMsg = message.toLowerCase().trim();
        const GREETINGS = ["hi", "hello", "hey", "namaste", "hola"];
        const SIMPLE_INTENTS = [...GREETINGS, "ok", "okay", "thanks", "thank you", "hmm", "bye"];
        const isSimpleIntent = SIMPLE_INTENTS.some(intent => lowerMsg.includes(intent));

        // IMMEDIATE GREETING RESPONSE
        if (GREETINGS.some(g => lowerMsg === g || lowerMsg.startsWith(g + " "))) {
            const greetingResponse = {
                "agent": "Swasthya AI",
                "tone": "reassuring",
                "understanding": {
                    "message": "im swasth AI apki help me hajir \" apko madat karne ke liye apaha haal kaisa hai"
                },
                "possible_reasons": [],
                "questions_to_ask": ["How can I help you today?", "Are you facing any health issues?"],
                "actions": {
                    "do_actions": [],
                    "dont_actions": []
                },
                "notes": []
            };

            // Save assistant message
            await db.query(
                'INSERT INTO chat_messages (session_id, role, message) VALUES (?, ?, ?)',
                [sessionId, 'assistant', greetingResponse.understanding.message]
            );

            return res.json({ ...greetingResponse, sessionId });
        }

        let contextText = "";

        if (!isSimpleIntent) {
            // 3. Dynamic RAG (Symptom-based Chunk Filtering)
            const k = (lowerMsg.includes("fever") || lowerMsg.includes("cold") || lowerMsg.includes("pain") || lowerMsg.includes("headache")) ? 2 : 3;
            try {
                const contextDocs = await vectorStore.similaritySearch(message, k);
                contextText = contextDocs.map(doc => doc.pageContent).join("\n\n");
            } catch (err) {
                console.warn("RAG failed, proceeding without context:", err);
            }
        } else {
            console.log("Simple intent detected, skipping RAG.");
        }

        // 4. Fetch History
        let historyContext = "";
        try {
            const [rows] = await db.query(
                'SELECT role, message FROM chat_messages WHERE session_id = ? ORDER BY created_at DESC LIMIT 10',
                [sessionId]
            );
            const messages = rows.reverse();
            // Simple History formatting (keep last 10 messages)
            historyContext = messages.map(msg => `${msg.role === 'user' ? 'USER' : 'AGENT'}: ${msg.message}`).join("\n");
        } catch (err) {
            console.error("Error fetching history:", err);
        }

        let userProfile = profileOverride || {};
        if (userId && !profileOverride) {
            try {
                const [rows] = await db.query('SELECT * FROM user_profiles WHERE id = ?', [userId]);
                if (rows.length > 0) userProfile = rows[0];
            } catch (err) { console.error("Error fetching profile:", err); }
        }

        // 5. Save User Message
        await db.query(
            'INSERT INTO chat_messages (session_id, role, message) VALUES (?, ?, ?)',
            [sessionId, 'user', message]
        );

        // 6. Generate Response
        const model = new ChatOllama({
            baseUrl: OLLAMA_BASE_URL,
            model: OLLAMA_MODEL,
            temperature: 0.3,
            format: "json",
        });

        const chain = RunnableSequence.from([
            prompt,
            model,
            new StringOutputParser()
        ]);

        const finalContext = `
RECENT CHAT HISTORY:
${historyContext}

RETRIEVED KNOWLEDGE:
${contextText}
`;

        const responseString = await chain.invoke({
            context: finalContext,
            profile: JSON.stringify(userProfile),
            question: message
        });

        // 7. Parse and Validate Response
        let cleanJson = responseString.trim();
        if (cleanJson.includes("```json")) {
            cleanJson = cleanJson.split("```json")[1].split("```")[0].trim();
        } else if (cleanJson.includes("```")) {
            cleanJson = cleanJson.split("```")[1].split("```")[0].trim();
        }

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(cleanJson);

            // Quality Gate
            if (!jsonResponse.tone || jsonResponse.tone !== "reassuring") {
                console.warn("Quality Gate: Invalid tone detected. Enforcing 'reassuring'.");
                jsonResponse.tone = "reassuring";
            }

            // Placeholder Check (Basic) - If detected, could trigger regeneration (omitted for speed, relying on prompt)
            if (JSON.stringify(jsonResponse).includes("Simple explanation") || JSON.stringify(jsonResponse).includes("Clear step")) {
                console.error("Quality Gate: Placeholders detected!");
                // potentially retry or fallback here
            }

        } catch (e) {
            console.error("JSON Parsing Error:", e);
            jsonResponse = {
                agent: "Swasthya AI",
                tone: "reassuring",
                understanding: { message: "I apologize, I had a momentary lapse. Let's try that again." },
                possible_reasons: ["Internal processing issue"],
                questions_to_ask: [],
                actions: { do_actions: [], dont_actions: [] },
                notes: ["Please repeat your query."]
            };
        }

        const summaryText = JSON.stringify(jsonResponse.possible_reasons || []) + " " + JSON.stringify(jsonResponse.actions || {});

        await db.query(
            'INSERT INTO chat_messages (session_id, role, message) VALUES (?, ?, ?)',
            [sessionId, 'assistant', summaryText]
        );

        res.json({ ...jsonResponse, sessionId });

    } catch (error) {
        console.error("Error in /chat:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.listen(PORT, async () => {
    await initVectorStore();
    console.log(`Swasthya AI Backend running on port ${PORT}`);
    console.log(`Using Ollama at ${OLLAMA_BASE_URL} with model ${OLLAMA_MODEL}`);
});
