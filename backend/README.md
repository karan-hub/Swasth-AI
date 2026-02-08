# Swasthya AI - Backend

Swasthya AI is an intelligent Ayurvedic health assistant designed to provide personalized, soothing, and culturally relevant health advice. Acting as a wise family elder, it combines traditional Ayurvedic knowledge (Prakriti, Vikriti) with modern AI capabilities to offer rigorous yet comforting guidance.

## Features

- **Personalized Profiling**: Captures detailed user data including Prakriti (Constitution), Vikriti (Imbalance), Agni (Digestive Fire), and lifestyle habits.
- **Empathetic AI Chat**: Utilizing LangChain and Ollama (running locally), the AI responds with a "reassuring" tone, avoiding clinical jargon in favor of simple, actionable advice.
- **Context-Aware RAG**: dynamically retrieves relevant information from a local vector store based on user queries (e.g., specific herbs for fever vs. general diet advice).
- **Hindi Greeting**: Custom welcome message reflecting the persona: *"im swasth AI apki help me hajir " apko madat karne ke liye apaha haal kaisa hai"*.
- **Database Integration**: Stores user profiles, chat sessions, and message history in a MySQL database.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (with `mysql2` driver)
- **AI/ML**: LangChain, Ollama (local LLM inference)
- **Vector Store**: Simple local JSON-based vector store (for RAG)

## Setup & Installation

### Prerequisites

1.  **Node.js**: v18+ installed.
2.  **MySQL**: Running instance.
3.  **Ollama**: Installed and running locally (default port 11434).
    - Recommended model: `mistral`
    - Embedding model: `nomic-embed-text`

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/karan-hub/Swasth-AI.git
    cd Swasth-AI/backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the `backend` directory:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=swasth-ai
    PORT=3000
    OLLAMA_BASE_URL=http://localhost:11434
    OLLAMA_MODEL=mistral
    OLLAMA_EMBED_MODEL=nomic-embed-text
    ```

4.  Initialize Database:
    The application will automatically create tables on start if they don't exist, but you can also run the schema manually:
    ```bash
    mysql -u root -p swasth-ai < schema.sql
    ```

5.  (Optional) Ingest Knowledge Base:
    If you have PDF documents for RAG context:
    ```bash
    node ingest.js
    ```

### Running the Application

```bash
node server.js
```

The server will start on `http://localhost:3000`.

### Remote Access
To access the server from another device on the same network:
1.  Ensure your computer and the device are connected to the same Wi-Fi/Network.
2.  Use the IP address `10.121.49.25` instead of `localhost`.
3.  Example URL: `http://10.121.49.25:3000` (or `http://10.121.49.25:3000/chat` for API).
4.  If you cannot connect, check your firewall settings to allow traffic on port 3000.

## API Endpoints

### 1. Create/Update Profile (`POST /profile`)
Creates a user profile to personalize the AI's advice.

**Request Body (JSON):**
```json
{
  "personalInformation": {
    "firstName": "String (Required)",
    "lastName": "String (Required)",
    "age": "Number",
    "gender": "String",
    "height_cm": "Number",
    "weight_kg": "Number"
  },
  "prakriti": {
    "dominantPrakriti": "String (e.g., 'Vata-Pitta')",
    "...": "Other fields stored as JSON"
  },
  "vikriti": { "...": "Stored as JSON" },
  "agni": { "...": "Stored as JSON" },
  "ahara": { "...": "Stored as JSON" },
  "dinacharya": { "...": "Stored as JSON" },
  "lifestyleAndStress": { "...": "Stored as JSON" },
  "medicalSafety": { "...": "Stored as JSON" }
}
```

**Response (JSON):**
```json
{
  "message": "Profile saved successfully.",
  "userId": 123
}
```

### 2. Chat with AI (`POST /chat`)
Send a message to Swasthya AI.

**Request Body (JSON):**
```json
{
  "message": "String (Required) - e.g., 'I have a headache'",
  "userId": "Number (Optional) - returned from /profile",
  "sessionId": "Number (Optional) - to continue conversation"
}
```

**Response (JSON):**
```json
{
  "agent": "Swasthya AI",
  "tone": "reassuring",
  "understanding": {
    "message": "Empathetic acknowledgment of the user's issue."
  },
  "possible_reasons": ["List of potential Ayurvedic causes..."],
  "questions_to_ask": ["Follow-up questions..."],
  "actions": {
    "do_actions": ["List of recommended actions/remedies..."],
    "dont_actions": ["List of things to avoid..."]
  },
  "notes": ["Closing reassuring note..."],
  "sessionId": 456
}
```

## Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## License

This project is licensed under the ISC License.
