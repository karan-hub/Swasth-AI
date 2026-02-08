import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BottomNavigation = ({ activeTab, onTabPress }) => {
  const tabs = [
    { name: 'Home', icon: '🏠' },
    { name: 'About', icon: 'ℹ️' },
    { name: 'Chat', icon: '💬' },
    { name: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => onTabPress(tab.name)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              activeTab === tab.name && styles.activeIconContainer,
            ]}
          >
            <Text
              style={[
                styles.icon,
                activeTab === tab.name && styles.activeIcon,
              ]}
            >
              {tab.icon}
            </Text>
          </View>
          <Text
            style={[
              styles.label,
              activeTab === tab.name && styles.activeLabel,
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 48,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  activeIconContainer: {
    backgroundColor: '#E8F5E9',
  },
  icon: {
    fontSize: 24,
    opacity: 0.6,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#10B981',
    fontWeight: '600',
  },
});

export default BottomNavigation;