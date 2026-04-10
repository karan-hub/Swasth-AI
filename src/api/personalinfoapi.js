// const BASE_URL = "http://10.121.49.25:3000";
const BASE_URL = "http://10.92.53.25:3000";

export const createProfile = async (profileData) => {
  try {
    console.log(`Sending request to: ${BASE_URL}/profile`);
    const res = await fetch(`${BASE_URL}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    console.log("Response status:", res.status);
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const text = await res.text();
      console.log("❌ Received HTML instead of JSON. This is likely the Localtunnel warning page.");
      console.log("HTML Preview:", text.substring(0, 100)); // Log first 100 chars
      throw new Error("Tunnel Warning Page - Please open the URL in your browser first");
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Request failed with status ${res.status}: ${errorText}`);
    }

    return await res.json();

  } catch (err) {
    console.error("❌ Profile API error:", err);
    throw err;
  }
};
