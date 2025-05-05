import Button from "@/components/Button";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
// 
import typography from "@/constants/typography";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?q=80&w=1000",
        }}
        style={styles.backgroundImage}
      />
      
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Ethiopian Recipe Share</Text>
          <Text style={styles.subtitle}>
            Discover, create and share authentic Ethiopian recipes
          </Text>
        </View>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>🍲</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Authentic Recipes</Text>
              <Text style={styles.featureDescription}>
                Explore traditional Ethiopian dishes from all regions
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>👨‍🍳</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Share Your Creations</Text>
              <Text style={styles.featureDescription}>
                Upload and share your own recipes with the community
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>💬</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Connect</Text>
              <Text style={styles.featureDescription}>
                Join a community of Ethiopian food enthusiasts
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    ...typography.heading1,
    color: "white",
    fontSize: 32,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    ...typography.body,
    color: "white",
    textAlign: "center",
    opacity: 0.9,
  },
  features: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.heading4,
    color: "white",
    marginBottom: 4,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: "white",
    opacity: 0.8,
  },
  footer: {
    marginBottom: 24,
  },
});