const BASE_URL = "http://10.88.149.25:8080";

export const sendMessageToChat = async (userSymptoms) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/remedies/ask?symptoms=${encodeURIComponent(userSymptoms)}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Swasthya AI Response:", data);
        return data;
    } catch (error) {
        console.error("There was an error fetching the remedy:", error);
        throw error;   // propagate to the caller
    }
};