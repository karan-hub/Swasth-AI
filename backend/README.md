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

## API Endpoints

### `POST /profile`
Create or update a user profile.
- **Body**: JSON object containing `personalInformation` (including `firstName`, `lastName`), `prakriti`, `vikriti`, etc.

### `POST /chat`
Send a message to the AI.
- **Body**:
    ```json
    {
      "message": "I have a fever and body ache.",
      "userId": 1,
      "sessionId": 123
    }
    ```
- **Response**: JSON object with the AI's reply (`understanding`, `possible_reasons`, `actions`, `notes`).

## Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## License

This project is licensed under the ISC License.
