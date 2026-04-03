import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import theme from "../theme/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface VideoSectionProps {
  config: {
    videoConfig?: {
      thumbnailUrl?: string;
      title?: string;
      duration?: string;
      height?: number;
    };
    thumbnailUrl?: string;
    title?: string;
    duration?: string;
    height?: number;
  };
}

export default function VideoSection({ config }: VideoSectionProps) {
  const videoConfig = config.videoConfig || config;
  const thumbnailUrl =
    videoConfig.thumbnailUrl ||
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800";
  const title = videoConfig.title || "Watch Our Latest Collection";
  const duration = videoConfig.duration || "2:30";
  const height = videoConfig.height || 220;

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} style={[styles.videoWrapper, { height }]}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.playButton}>
            <View style={styles.playTriangle} />
          </View>
          <View style={styles.bottomBar}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{duration}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.layout.spacing,
    marginBottom: theme.layout.spacing,
  },
  videoWrapper: {
    borderRadius: theme.layout.borderRadius,
    overflow: "hidden",
    backgroundColor: theme.colors.lightGray,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: theme.colors.primary,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    marginLeft: 4,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  title: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginRight: 12,
  },
  durationBadge: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: "500",
  },
});
