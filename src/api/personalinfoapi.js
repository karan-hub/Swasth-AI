const BASE_URL = "http://10.121.49.25:3000";

export const createProfile = async (profileData) => {
  try {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    if (!res.ok) throw new Error("Profile creation failed");

    return await res.json();

  } catch (err) {
    console.log("❌ Profile API error:", err);
    throw err;
  }
};
