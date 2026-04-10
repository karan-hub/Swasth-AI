import { Ionicons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import UserProfileSetup from './src/Profile/PersonalInformation';
import ChatScreen from './src/screens/ChatScreen';

import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// 👉 Dummy Home screen
function HomeScreen() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Home</Text>
    </View>
  );
}


// 👉 Bottom Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10B981',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={UserProfileSetup} />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* First open profile setup */}
        <Stack.Screen name="ProfileSetup" component={UserProfileSetup} />

        {/* After save → open tabs */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
