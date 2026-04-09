import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createProfile } from "../api/personalinfoapi";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";

const UserProfileSetup = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  // Personal Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Prakriti
  const [bodyFrame, setBodyFrame] = useState("");
  const [skinType, setSkinType] = useState("");
  const [appetiteNature, setAppetiteNature] = useState("");
  const [temperatureTolerance, setTemperatureTolerance] = useState("");
  const [stressHandling, setStressHandling] = useState("");

  // Vikriti
  const [currentSymptoms, setCurrentSymptoms] = useState([]);
  const [symptomDuration, setSymptomDuration] = useState("");
  const [severityLevel, setSeverityLevel] = useState("");
  const [aggravationTime, setAggravationTime] = useState("");

  // Agni
  const [hungerRegularity, setHungerRegularity] = useState("");
  const [bloating, setBloating] = useState("");
  const [acidity, setAcidity] = useState("");
  const [stoolType, setStoolType] = useState("");

  // Ahara
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [mealTimingConsistency, setMealTimingConsistency] = useState("");
  const [dominantFoodTypes, setDominantFoodTypes] = useState([]);
  const [junkFoodFrequency, setJunkFoodFrequency] = useState("");

  // Dinacharya
  const [wakeUpTime, setWakeUpTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [activityType, setActivityType] = useState("");
  const [activityDuration, setActivityDuration] = useState("");

  // Lifestyle and Stress
  const [stressLevel, setStressLevel] = useState("");
  const [workNature, setWorkNature] = useState("");
  const [lateNightHabit, setLateNightHabit] = useState("");

  // Medical Safety
  const [existingConditions, setExistingConditions] = useState([]);
  const [currentMedications, setCurrentMedications] = useState("");
  const [allergies, setAllergies] = useState("");

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // handleSaveProfile(); // save first
       navigation.replace("MainTabs", { screen: "Chat" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const [loading, setLoading] = useState(false);
  const handleSaveProfile = async () => {
    setLoading(true);

    const profileData = {
      personalInformation: {
        firstName,
        lastName,
        age: Number(age),
        gender,
        height_cm: Number(height),
        weight_kg: Number(weight),
      },

      prakriti: {
        bodyFrame,
        skinType,
        appetiteNature,
        heatOrColdTolerance, // Not temperatureTolerance
        stressHandlingCapacity, // Not stressHandling
        dominantPrakriti,
      },

      vikriti: {
        currentSymptoms,
        duration, // Not symptomDuration
        severityLevel,
        timeOfAggravation, // Not aggravationTime
      },

      agni: {
        hungerRegularity,
        bloatingAfterMeals: bloating,
        acidityOrBurning: acidity,
        stoolType,
      },

      ahara: {
        mealsPerDay,
        mealTimingConsistency,
        dominantFoodTypes,
        junkOrOutsideFoodFrequency: junkFoodFrequency,
      },

      dinacharya: {
        wakeUpTime,
        sleepTime,
        sleepQuality,
        physicalActivityType: activityType,
        physicalActivityDuration: activityDuration,
      },

      lifestyleAndStress: {
        dailyStressLevel: stressLevel,
        workNature,
        lateNightHabit,
      },

      medicalSafety: {
        existingDiagnosedConditions: existingConditions, // Variable name ok, property name fixed
        currentMedications,
        foodOrHerbAllergies: allergies, // Variable name ok, property name fixed
      },

      // Optional: Add meta if needed
      // meta: {
      //   profileCompleted: true,
      //   profileCreatedAt: new Date().toISOString(),
      //   note: "This information is used to personalize all future conversations."
      // }
    };

    try {
      console.log("Saving profile...");

      const data = await createProfile(profileData);

      const userId = String(data.userId);

      await AsyncStorage.setItem("USER_ID", userId);

      console.log("✅ Saved user:", userId);

      navigation.replace("MainTabs", { screen: "Chat" });
    } catch (err) {
      console.log(err);
      alert("Failed to save profile 😢");
    } finally {
      setLoading(false);
    }
  };

  const toggleArraySelection = (array, setArray, value) => {
    if (array.includes(value)) {
      setArray(array.filter((item) => item !== value));
    } else {
      setArray([...array, value]);
    }
  };

  const RadioButton = ({ selected, onPress, label }) => (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
      <View style={styles.radioOuter}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const MultiSelectButton = ({ selected, onPress, label }) => (
    <TouchableOpacity
      style={[
        styles.multiSelectButton,
        selected && styles.multiSelectButtonActive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.multiSelectText,
          selected && styles.multiSelectTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Text style={styles.description}>
              To personalize your Ayurvedic health journey, please provide us
              with some basic personal details. This information helps us
              understand your unique constitution.
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Basic Details</Text>

              {/* Add First Name Field */}
              <Text style={styles.label}>First Name</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your first name"
                  placeholderTextColor="#999"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>

              {/* Add Last Name Field */}
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your last name"
                  placeholderTextColor="#999"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>

              <Text style={styles.label}>Age</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your age"
                  placeholderTextColor="#999"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
                <Text style={styles.unit}>years</Text>
              </View>

              <Text style={styles.label}>Gender</Text>
              <RadioButton
                selected={gender === "Male"}
                onPress={() => setGender("Male")}
                label="Male"
              />
              <RadioButton
                selected={gender === "Female"}
                onPress={() => setGender("Female")}
                label="Female"
              />
              <RadioButton
                selected={gender === "Other"}
                onPress={() => setGender("Other")}
                label="Other"
              />
              <RadioButton
                selected={gender === "Prefer not to say"}
                onPress={() => setGender("Prefer not to say")}
                label="Prefer not to say"
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Physical Attributes</Text>

              <Text style={styles.label}>Height</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your height"
                  placeholderTextColor="#999"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
                <Text style={styles.unit}>cm</Text>
              </View>

              <Text style={styles.label}>Weight</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your weight"
                  placeholderTextColor="#999"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Prakriti Assessment</Text>
            <Text style={styles.description}>
              This section identifies your inborn physical and mental nature.
              Prakriti remains mostly constant throughout life and acts as the
              baseline for all recommendations.
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Body Constitution</Text>

              <Text style={styles.label}>Body Frame</Text>
              <RadioButton
                selected={bodyFrame === "Lean"}
                onPress={() => setBodyFrame("Lean")}
                label="Lean"
              />
              <RadioButton
                selected={bodyFrame === "Medium"}
                onPress={() => setBodyFrame("Medium")}
                label="Medium"
              />
              <RadioButton
                selected={bodyFrame === "Heavy"}
                onPress={() => setBodyFrame("Heavy")}
                label="Heavy"
              />

              <Text style={styles.label}>Skin Type</Text>
              <RadioButton
                selected={skinType === "Dry"}
                onPress={() => setSkinType("Dry")}
                label="Dry"
              />
              <RadioButton
                selected={skinType === "Oily"}
                onPress={() => setSkinType("Oily")}
                label="Oily"
              />
              <RadioButton
                selected={skinType === "Normal"}
                onPress={() => setSkinType("Normal")}
                label="Normal"
              />

              <Text style={styles.label}>Appetite Nature</Text>
              <RadioButton
                selected={appetiteNature === "Irregular"}
                onPress={() => setAppetiteNature("Irregular")}
                label="Irregular"
              />
              <RadioButton
                selected={appetiteNature === "Strong"}
                onPress={() => setAppetiteNature("Strong")}
                label="Strong"
              />
              <RadioButton
                selected={appetiteNature === "Slow"}
                onPress={() => setAppetiteNature("Slow")}
                label="Slow"
              />

              <Text style={styles.label}>Temperature Tolerance</Text>
              <RadioButton
                selected={temperatureTolerance === "Prefer warmth"}
                onPress={() => setTemperatureTolerance("Prefer warmth")}
                label="Prefer warmth (feel cold easily)"
              />
              <RadioButton
                selected={temperatureTolerance === "Prefer cool"}
                onPress={() => setTemperatureTolerance("Prefer cool")}
                label="Prefer cool (feel hot easily)"
              />
              <RadioButton
                selected={temperatureTolerance === "Balanced"}
                onPress={() => setTemperatureTolerance("Balanced")}
                label="Balanced tolerance"
              />

              <Text style={styles.label}>Stress Handling Capacity</Text>
              <RadioButton
                selected={stressHandling === "Get anxious easily"}
                onPress={() => setStressHandling("Get anxious easily")}
                label="Get anxious easily"
              />
              <RadioButton
                selected={stressHandling === "Get irritated easily"}
                onPress={() => setStressHandling("Get irritated easily")}
                label="Get irritated easily"
              />
              <RadioButton
                selected={stressHandling === "Stay calm"}
                onPress={() => setStressHandling("Stay calm")}
                label="Stay calm and composed"
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Vikriti Assessment</Text>
            <Text style={styles.description}>
              This section captures your present health issues or imbalances.
              Vikriti can change over time and is evaluated along with Prakriti
              to personalize guidance.
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Current Health Status</Text>

              <Text style={styles.label}>
                Current Symptoms (select all that apply)
              </Text>
              <View style={styles.multiSelectContainer}>
                {[
                  "Fatigue",
                  "Headache",
                  "Body pain",
                  "Indigestion",
                  "Constipation",
                  "Acidity",
                  "Anxiety",
                  "Insomnia",
                  "Joint pain",
                  "Skin issues",
                  "Respiratory issues",
                  "None",
                ].map((symptom) => (
                  <MultiSelectButton
                    key={symptom}
                    selected={currentSymptoms.includes(symptom)}
                    onPress={() =>
                      toggleArraySelection(
                        currentSymptoms,
                        setCurrentSymptoms,
                        symptom,
                      )
                    }
                    label={symptom}
                  />
                ))}
              </View>

              <Text style={styles.label}>Duration of Symptoms</Text>
              <RadioButton
                selected={symptomDuration === "Recent (few days)"}
                onPress={() => setSymptomDuration("Recent (few days)")}
                label="Recent (few days)"
              />
              <RadioButton
                selected={symptomDuration === "Few weeks"}
                onPress={() => setSymptomDuration("Few weeks")}
                label="Few weeks"
              />
              <RadioButton
                selected={symptomDuration === "Few months"}
                onPress={() => setSymptomDuration("Few months")}
                label="Few months"
              />
              <RadioButton
                selected={symptomDuration === "Years"}
                onPress={() => setSymptomDuration("Years")}
                label="Years"
              />

              <Text style={styles.label}>Severity Level</Text>
              <RadioButton
                selected={severityLevel === "Mild"}
                onPress={() => setSeverityLevel("Mild")}
                label="Mild"
              />
              <RadioButton
                selected={severityLevel === "Moderate"}
                onPress={() => setSeverityLevel("Moderate")}
                label="Moderate"
              />
              <RadioButton
                selected={severityLevel === "Severe"}
                onPress={() => setSeverityLevel("Severe")}
                label="Severe"
              />

              <Text style={styles.label}>When do symptoms worsen?</Text>
              <RadioButton
                selected={aggravationTime === "Morning"}
                onPress={() => setAggravationTime("Morning")}
                label="Morning"
              />
              <RadioButton
                selected={aggravationTime === "Afternoon"}
                onPress={() => setAggravationTime("Afternoon")}
                label="Afternoon"
              />
              <RadioButton
                selected={aggravationTime === "Evening"}
                onPress={() => setAggravationTime("Evening")}
                label="Evening"
              />
              <RadioButton
                selected={aggravationTime === "Night"}
                onPress={() => setAggravationTime("Night")}
                label="Night"
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Agni Assessment</Text>
            <Text style={styles.description}>
              This section assesses your digestive capacity, which is central to
              Ayurvedic decision-making. Weak or disturbed digestion directly
              affects the type of advice we can provide.
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Digestive Strength</Text>

              <Text style={styles.label}>Hunger Regularity</Text>
              <RadioButton
                selected={hungerRegularity === "Very regular"}
                onPress={() => setHungerRegularity("Very regular")}
                label="Very regular (same time daily)"
              />
              <RadioButton
                selected={hungerRegularity === "Somewhat regular"}
                onPress={() => setHungerRegularity("Somewhat regular")}
                label="Somewhat regular"
              />
              <RadioButton
                selected={hungerRegularity === "Irregular"}
                onPress={() => setHungerRegularity("Irregular")}
                label="Irregular or unpredictable"
              />

              <Text style={styles.label}>Bloating After Meals</Text>
              <RadioButton
                selected={bloating === "Never"}
                onPress={() => setBloating("Never")}
                label="Never"
              />
              <RadioButton
                selected={bloating === "Sometimes"}
                onPress={() => setBloating("Sometimes")}
                label="Sometimes"
              />
              <RadioButton
                selected={bloating === "Often"}
                onPress={() => setBloating("Often")}
                label="Often"
              />
              <RadioButton
                selected={bloating === "Always"}
                onPress={() => setBloating("Always")}
                label="Always"
              />

              <Text style={styles.label}>Acidity or Burning Sensation</Text>
              <RadioButton
                selected={acidity === "Never"}
                onPress={() => setAcidity("Never")}
                label="Never"
              />
              <RadioButton
                selected={acidity === "Rarely"}
                onPress={() => setAcidity("Rarely")}
                label="Rarely"
              />
              <RadioButton
                selected={acidity === "Frequently"}
                onPress={() => setAcidity("Frequently")}
                label="Frequently"
              />

              <Text style={styles.label}>Stool Type</Text>
              <RadioButton
                selected={stoolType === "Regular and formed"}
                onPress={() => setStoolType("Regular and formed")}
                label="Regular and formed"
              />
              <RadioButton
                selected={stoolType === "Hard/constipated"}
                onPress={() => setStoolType("Hard/constipated")}
                label="Hard/constipated"
              />
              <RadioButton
                selected={stoolType === "Loose/frequent"}
                onPress={() => setStoolType("Loose/frequent")}
                label="Loose/frequent"
              />
              <RadioButton
                selected={stoolType === "Irregular"}
                onPress={() => setStoolType("Irregular")}
                label="Irregular"
              />
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Ahara Assessment</Text>
            <Text style={styles.description}>
              This section records your food habits and eating behavior.
              Diet-related recommendations are derived mainly from this data.
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Dietary Pattern</Text>

              <Text style={styles.label}>Number of Meals Per Day</Text>
              <RadioButton
                selected={mealsPerDay === "2"}
                onPress={() => setMealsPerDay("2")}
                label="2 meals"
              />
              <RadioButton
                selected={mealsPerDay === "3"}
                onPress={() => setMealsPerDay("3")}
                label="3 meals"
              />
              <RadioButton
                selected={mealsPerDay === "4+"}
                onPress={() => setMealsPerDay("4+")}
                label="4 or more meals"
              />

              <Text style={styles.label}>Meal Timing Consistency</Text>
              <RadioButton
                selected={mealTimingConsistency === "Very consistent"}
                onPress={() => setMealTimingConsistency("Very consistent")}
                label="Very consistent (same time daily)"
              />
              <RadioButton
                selected={mealTimingConsistency === "Somewhat consistent"}
                onPress={() => setMealTimingConsistency("Somewhat consistent")}
                label="Somewhat consistent"
              />
              <RadioButton
                selected={mealTimingConsistency === "Irregular"}
                onPress={() => setMealTimingConsistency("Irregular")}
                label="Irregular"
              />

              <Text style={styles.label}>
                Dominant Food Types (select all that apply)
              </Text>
              <View style={styles.multiSelectContainer}>
                {[
                  "Spicy",
                  "Oily/Fried",
                  "Cold/Raw",
                  "Sweet",
                  "Sour",
                  "Salty",
                  "Bitter",
                ].map((type) => (
                  <MultiSelectButton
                    key={type}
                    selected={dominantFoodTypes.includes(type)}
                    onPress={() =>
                      toggleArraySelection(
                        dominantFoodTypes,
                        setDominantFoodTypes,
                        type,
                      )
                    }
                    label={type}
                  />
                ))}
              </View>

              <Text style={styles.label}>Junk or Outside Food Frequency</Text>
              <RadioButton
                selected={junkFoodFrequency === "Rarely"}
                onPress={() => setJunkFoodFrequency("Rarely")}
                label="Rarely (once a month or less)"
              />
              <RadioButton
                selected={junkFoodFrequency === "Sometimes"}
                onPress={() => setJunkFoodFrequency("Sometimes")}
                label="Sometimes (1-2 times per week)"
              />
              <RadioButton
                selected={junkFoodFrequency === "Often"}
                onPress={() => setJunkFoodFrequency("Often")}
                label="Often (3+ times per week)"
              />
              <RadioButton
                selected={junkFoodFrequency === "Daily"}
                onPress={() => setJunkFoodFrequency("Daily")}
                label="Daily"
              />
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Dinacharya Assessment</Text>
            <Text style={styles.description}>
              This section captures your daily routine and biological rhythm.
              Irregular routines are a common root cause of many health issues.
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Daily Routine</Text>

              <Text style={styles.label}>Wake-up Time</Text>
              <RadioButton
                selected={wakeUpTime === "Before 6 AM"}
                onPress={() => setWakeUpTime("Before 6 AM")}
                label="Before 6 AM"
              />
              <RadioButton
                selected={wakeUpTime === "6-7 AM"}
                onPress={() => setWakeUpTime("6-7 AM")}
                label="6-7 AM"
              />
              <RadioButton
                selected={wakeUpTime === "7-9 AM"}
                onPress={() => setWakeUpTime("7-9 AM")}
                label="7-9 AM"
              />
              <RadioButton
                selected={wakeUpTime === "After 9 AM"}
                onPress={() => setWakeUpTime("After 9 AM")}
                label="After 9 AM"
              />

              <Text style={styles.label}>Sleep Time</Text>
              <RadioButton
                selected={sleepTime === "Before 10 PM"}
                onPress={() => setSleepTime("Before 10 PM")}
                label="Before 10 PM"
              />
              <RadioButton
                selected={sleepTime === "10-11 PM"}
                onPress={() => setSleepTime("10-11 PM")}
                label="10-11 PM"
              />
              <RadioButton
                selected={sleepTime === "11 PM-12 AM"}
                onPress={() => setSleepTime("11 PM-12 AM")}
                label="11 PM-12 AM"
              />
              <RadioButton
                selected={sleepTime === "After 12 AM"}
                onPress={() => setSleepTime("After 12 AM")}
                label="After 12 AM"
              />

              <Text style={styles.label}>Sleep Quality</Text>
              <RadioButton
                selected={sleepQuality === "Deep and restful"}
                onPress={() => setSleepQuality("Deep and restful")}
                label="Deep and restful"
              />
              <RadioButton
                selected={sleepQuality === "Light but adequate"}
                onPress={() => setSleepQuality("Light but adequate")}
                label="Light but adequate"
              />
              <RadioButton
                selected={sleepQuality === "Disturbed/restless"}
                onPress={() => setSleepQuality("Disturbed/restless")}
                label="Disturbed/restless"
              />
              <RadioButton
                selected={sleepQuality === "Insomnia"}
                onPress={() => setSleepQuality("Insomnia")}
                label="Insomnia"
              />

              <Text style={styles.label}>Physical Activity Type</Text>
              <RadioButton
                selected={activityType === "None"}
                onPress={() => setActivityType("None")}
                label="None"
              />
              <RadioButton
                selected={activityType === "Light (walking)"}
                onPress={() => setActivityType("Light (walking)")}
                label="Light (walking)"
              />
              <RadioButton
                selected={activityType === "Moderate (yoga, cycling)"}
                onPress={() => setActivityType("Moderate (yoga, cycling)")}
                label="Moderate (yoga, cycling)"
              />
              <RadioButton
                selected={activityType === "Intense (gym, sports)"}
                onPress={() => setActivityType("Intense (gym, sports)")}
                label="Intense (gym, sports)"
              />

              <Text style={styles.label}>Physical Activity Duration</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter duration"
                  placeholderTextColor="#999"
                  value={activityDuration}
                  onChangeText={setActivityDuration}
                  keyboardType="numeric"
                />
                <Text style={styles.unit}>minutes/day</Text>
              </View>
            </View>
          </View>
        );

      case 7:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Lifestyle and Stress</Text>
            <Text style={styles.description}>
              This section evaluates mental load and behavioral factors that
              influence long-term health.
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Mental & Lifestyle Factors</Text>

              <Text style={styles.label}>Daily Stress Level</Text>
              <RadioButton
                selected={stressLevel === "Low"}
                onPress={() => setStressLevel("Low")}
                label="Low (rarely stressed)"
              />
              <RadioButton
                selected={stressLevel === "Moderate"}
                onPress={() => setStressLevel("Moderate")}
                label="Moderate (sometimes stressed)"
              />
              <RadioButton
                selected={stressLevel === "High"}
                onPress={() => setStressLevel("High")}
                label="High (often stressed)"
              />
              <RadioButton
                selected={stressLevel === "Very high"}
                onPress={() => setStressLevel("Very high")}
                label="Very high (constantly stressed)"
              />

              <Text style={styles.label}>Work Nature</Text>
              <RadioButton
                selected={workNature === "Desk-based/Sedentary"}
                onPress={() => setWorkNature("Desk-based/Sedentary")}
                label="Desk-based/Sedentary"
              />
              <RadioButton
                selected={workNature === "Physical/Active"}
                onPress={() => setWorkNature("Physical/Active")}
                label="Physical/Active"
              />
              <RadioButton
                selected={workNature === "Mixed"}
                onPress={() => setWorkNature("Mixed")}
                label="Mixed"
              />

              <Text style={styles.label}>Late-night Habit</Text>
              <RadioButton
                selected={lateNightHabit === "Never"}
                onPress={() => setLateNightHabit("Never")}
                label="Never stay up late"
              />
              <RadioButton
                selected={lateNightHabit === "Sometimes"}
                onPress={() => setLateNightHabit("Sometimes")}
                label="Sometimes (1-2 times/week)"
              />
              <RadioButton
                selected={lateNightHabit === "Often"}
                onPress={() => setLateNightHabit("Often")}
                label="Often (3+ times/week)"
              />
              <RadioButton
                selected={lateNightHabit === "Daily"}
                onPress={() => setLateNightHabit("Daily")}
                label="Daily"
              />
            </View>
          </View>
        );

      case 8:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Medical Safety</Text>
            <Text style={styles.description}>
              This section ensures that all guidance provided remains safe and
              non-harmful.
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Health Safety Information</Text>

              <Text style={styles.label}>
                Existing Diagnosed Conditions (select all that apply)
              </Text>
              <View style={styles.multiSelectContainer}>
                {[
                  "Diabetes",
                  "Hypertension",
                  "Thyroid disorders",
                  "Heart disease",
                  "Kidney disease",
                  "Liver disease",
                  "Asthma",
                  "PCOD/PCOS",
                  "Arthritis",
                  "None",
                ].map((condition) => (
                  <MultiSelectButton
                    key={condition}
                    selected={existingConditions.includes(condition)}
                    onPress={() =>
                      toggleArraySelection(
                        existingConditions,
                        setExistingConditions,
                        condition,
                      )
                    }
                    label={condition}
                  />
                ))}
              </View>

              <Text style={styles.label}>Current Medications</Text>
              <TextInput
                style={styles.textArea}
                placeholder="List any medications you're currently taking"
                placeholderTextColor="#999"
                value={currentMedications}
                onChangeText={setCurrentMedications}
                multiline
                numberOfLines={4}
              />

              <Text style={styles.label}>Food or Herb Allergies</Text>
              <TextInput
                style={styles.textArea}
                placeholder="List any known allergies to foods or herbs"
                placeholderTextColor="#999"
                value={allergies}
                onChangeText={setAllergies}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                The information you provide here will be used to personalize all
                future conversations and ensure your safety.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <Text style={styles.stepIndicator}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View> */}

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.nextButton,
            currentStep === 1 && styles.nextButtonFull,
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {loading
              ? "Saving..."
              : currentStep === totalSteps
                ? "Save Profile"
                : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  stepIndicator: {
    fontSize: 14,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
    marginTop: 44,
  },
  description: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
    marginBottom: 20,
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D3748",
    marginBottom: 12,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
  },
  unit: {
    fontSize: 14,
    color: "#718096",
    marginLeft: 8,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
  },
  radioLabel: {
    fontSize: 14,
    color: "#2D3748",
  },
  multiSelectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  multiSelectButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CBD5E0",
    backgroundColor: "#fff",
  },
  multiSelectButtonActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  multiSelectText: {
    fontSize: 14,
    color: "#4A5568",
  },
  multiSelectTextActive: {
    color: "#fff",
  },
  textArea: {
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    fontSize: 14,
    color: "#1A1A1A",
    textAlignVertical: "top",
    minHeight: 100,
  },
  noteContainer: {
    backgroundColor: "#EBF8FF",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  noteText: {
    fontSize: 13,
    color: "#2C5282",
    lineHeight: 20,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    gap: 12,
  },
  backButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A5568",
  },
  nextButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default UserProfileSetup;
