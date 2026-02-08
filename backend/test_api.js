
const BASE_URL = 'http://localhost:3000';

const profileData = {
    "personalInformation": {
        "age": 28,
        "gender": "male",
        "height_cm": 170,
        "weight_kg": 68
    },
    "prakriti": {
        "bodyFrame": "medium",
        "skinType": "oily",
        "appetiteNature": "strong",
        "heatOrColdTolerance": "heat_sensitive",
        "stressHandlingCapacity": "moderate",
        "dominantPrakriti": "pitta"
    },
    "vikriti": {
        "currentSymptoms": ["headache", "bloating", "acidity"],
        "duration": "2 weeks",
        "severityLevel": "moderate",
        "timeOfAggravation": "evening"
    },
    "agni": {
        "hungerRegularity": "irregular",
        "bloatingAfterMeals": true,
        "acidityOrBurning": true,
        "stoolType": "soft"
    },
    "ahara": {
        "mealsPerDay": 3,
        "mealTimingConsistency": "inconsistent",
        "dominantFoodTypes": ["spicy", "oily"],
        "junkOrOutsideFoodFrequency": "3-4 times per week"
    },
    "dinacharya": {
        "wakeUpTime": "07:30",
        "sleepTime": "00:30",
        "sleepQuality": "disturbed",
        "physicalActivityType": "light walking",
        "physicalActivityDuration": "20 minutes"
    },
    "lifestyleAndStress": {
        "dailyStressLevel": "high",
        "workNature": "desk_based",
        "lateNightHabit": true
    },
    "medicalSafety": {
        "existingDiagnosedConditions": ["gastritis"],
        "currentMedications": [],
        "foodOrHerbAllergies": ["milk"]
    }
};

async function testFlow() {
    console.log("1. Creating Profile...");
    try {
        const res = await fetch(`${BASE_URL}/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Profile creation failed: ${res.status} - ${txt}`);
        }

        const data = await res.json();
        console.log("   Success! User ID:", data.userId);
        const userId = data.userId;

        console.log("\n2. Chatting with User ID context...");
        const chatRes = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: "I have a severe headache and feel hot.",
                userId: userId
            })
        });

        if (!chatRes.ok) {
            const txt = await chatRes.text();
            throw new Error(`Chat failed: ${chatRes.status} - ${txt}`);
        }

        const chatData = await chatRes.json();
        console.log("   Success! Agent Response:", chatData.understanding.message);
        console.log("   Session ID:", chatData.sessionId);

        if (!chatData.sessionId) throw new Error("No Session ID returned!");

        console.log("\n3. Testing Follow-up (Chat History)...");

        const followUpRes = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: "What did I just say my symptom was?",
                userId: userId,
                sessionId: chatData.sessionId
            })
        });

        const followUpData = await followUpRes.json();
        console.log("   Follow-up Response:", followUpData.understanding.message);

    } catch (err) {
        console.error("TEST FAILED:", err);
    }
}

testFlow();
