import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import theme from "../theme/theme";

interface FlashSaleSectionProps {
  config: {
    flashSaleConfig?: {
      endDate: string;
      title?: string;
      subtitle?: string;
      ctaText?: string;
    };
  };
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(endDate: string): TimeLeft {
  const difference = new Date(endDate).getTime() - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function padZero(num: number): string {
  return num.toString().padStart(2, "0");
}

export default function FlashSaleSection({ config }: FlashSaleSectionProps) {
  const flashConfig = config.flashSaleConfig || {
    endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    title: "Flash Sale",
    subtitle: "Limited time deals",
    ctaText: "Shop Deals",
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeft(flashConfig.endDate)
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft(flashConfig.endDate));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [flashConfig.endDate]);

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.textSection}>
          <Text style={styles.title}>{flashConfig.title || "Flash Sale"}</Text>
          {flashConfig.subtitle && (
            <Text style={styles.subtitle}>{flashConfig.subtitle}</Text>
          )}
        </View>
        <View style={styles.timerSection}>
          {isExpired ? (
            <Text style={styles.expiredText}>Sale Ended</Text>
          ) : (
            <View style={styles.timerRow}>
              <TimerBlock value={padZero(timeLeft.days)} label="Days" />
              <Text style={styles.separator}>:</Text>
              <TimerBlock value={padZero(timeLeft.hours)} label="Hrs" />
              <Text style={styles.separator}>:</Text>
              <TimerBlock value={padZero(timeLeft.minutes)} label="Min" />
              <Text style={styles.separator}>:</Text>
              <TimerBlock value={padZero(timeLeft.seconds)} label="Sec" />
            </View>
          )}
        </View>
        {flashConfig.ctaText && !isExpired && (
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaText}>{flashConfig.ctaText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function TimerBlock({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.timerBlock}>
      <Text style={styles.timerValue}>{value}</Text>
      <Text style={styles.timerLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.layout.spacing,
    marginBottom: theme.layout.spacing,
  },
  card: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.layout.borderRadius,
    padding: 20,
    alignItems: "center",
  },
  textSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: theme.colors.white,
    fontSize: 14,
    opacity: 0.8,
  },
  timerSection: {
    marginBottom: 16,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerBlock: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    minWidth: 52,
  },
  timerValue: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: "700",
  },
  timerLabel: {
    color: theme.colors.white,
    fontSize: 10,
    opacity: 0.7,
    marginTop: 2,
  },
  separator: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: "700",
    marginHorizontal: 4,
  },
  expiredText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "600",
    opacity: 0.7,
  },
  ctaButton: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: theme.layout.borderRadius,
  },
  ctaText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
