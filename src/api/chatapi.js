// const BASE_URL = "http://10.121.49.25:3000";
const BASE_URL = "http://10.92.53.25:3000";

export const sendMessageToChat = async (message, userId, sessionId) => {
  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        userId,
        sessionId,
      }),
    });

    const data = await res.json();
    return data;

  } catch (error) {
    console.log("❌ API Error:", error);
    return { message: "Server not reachable 😢" };
  }
};
