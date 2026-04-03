import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import theme from "../theme/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface MarqueeItem {
  text: string;
}

interface MarqueeSectionProps {
  config: {
    marqueeConfig?: {
      items: MarqueeItem[];
      speed?: number;
      direction?: "left" | "right";
      backgroundColor?: string;
      textColor?: string;
    };
  };
}

export default function MarqueeSection({ config }: MarqueeSectionProps) {
  const marqueeConfig = config.marqueeConfig || {
    items: [{ text: "Welcome to our store" }],
    speed: 5,
    direction: "left",
  };

  const items = marqueeConfig.items;
  const speed = marqueeConfig.speed || 5;
  const direction = marqueeConfig.direction || "left";
  const bgColor = marqueeConfig.backgroundColor || theme.colors.primary;
  const textColor = marqueeConfig.textColor || theme.colors.white;

  const fullText = items.map((item) => item.text).join("     \u2022     ");
  const doubledText = fullText + "     \u2022     " + fullText;

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const contentWidth = doubledText.length * 7;
    const halfWidth = contentWidth / 2;
    const duration = (halfWidth / speed) * 100;

    const startValue = direction === "left" ? 0 : -halfWidth;
    const endValue = direction === "left" ? -halfWidth : 0;

    translateX.setValue(startValue);

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: endValue,
        duration,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [doubledText, speed, direction, translateX]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Animated.View
        style={[
          styles.textWrapper,
          { transform: [{ translateX }] },
        ]}
      >
        <Text style={[styles.marqueeText, { color: textColor }]}>
          {doubledText}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    overflow: "hidden",
    justifyContent: "center",
    marginBottom: theme.layout.spacing,
  },
  textWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: SCREEN_WIDTH * 10,
  },
  marqueeText: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});
