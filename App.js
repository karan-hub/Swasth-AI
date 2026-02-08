import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LaunchScreen from './src/screens/LaunchScreen';   // ⭐ ADDED
import UserProfileSetup from './src/Profile/PersonalInformation';
import ChatScreen from './src/screens/ChatScreen';
import UserProfile from './src/screens/UserProfile';
import Home from './src/screens/Home';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


/* =========================
   Bottom Tabs (Footer)
========================= */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: 'gray',

        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
        },

        tabBarIcon: ({ color, size }) => {
          let icon;

          if (route.name === 'Home') icon = 'home';
          else if (route.name === 'Chat') icon = 'chatbubble-ellipses';
          else if (route.name === 'Profile') icon = 'person';

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
}


/* =========================
   Main App Navigator
========================= */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* ⭐ FIRST SCREEN (Splash) */}
        <Stack.Screen name="Launch" component={LaunchScreen} />

        {/* Profile Setup */}
        <Stack.Screen name="ProfileSetup" component={UserProfileSetup} />

        {/* Tabs with footer icons */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
