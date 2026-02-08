
async function testOllama() {
    try {
        const { OllamaEmbeddings } = await import("@langchain/ollama");
        console.log("Success: @langchain/ollama");
    } catch (e) {
        console.log("Failed: @langchain/ollama");
        console.error(e);
    }
}

testOllama();
