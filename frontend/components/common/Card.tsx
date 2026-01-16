import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from "react-native";

interface CardProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  children?: ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

export default function Card({
  title,
  subtitle,
  onPress,
  children,
  containerStyle,
  titleStyle,
  subtitleStyle,
}: CardProps) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper style={[styles.card, containerStyle]} onPress={onPress}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
      {children && <View style={styles.content}>{children}</View>}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f3f3ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2c2c2cff",
  },
  subtitle: {
    fontSize: 14,
    color: "#2e2c2cff",
    marginBottom: 8,
  },
  content: {
    marginTop: 4,
  },
});
