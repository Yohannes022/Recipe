
/**
 * Delivery map component for tracking order delivery
 * Shows restaurant location, delivery person location, and user location
 * Displays route and estimated delivery time
 * Provides a web-compatible fallback when running on web platform
 */

import typography from "@/constants/typography";
import { Location } from "@/types/restaurant";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Only import map components when not on web platform
let MapView: any;
let Marker: any;
let Polyline: any;
let PROVIDER_GOOGLE: any;

try {
  if (Platform.OS !== "web") {
    const MapComponents = require("react-native-maps");
    MapView = MapComponents.default;
    Marker = MapComponents.Marker;
    Polyline = MapComponents.Polyline;
    PROVIDER_GOOGLE = MapComponents.PROVIDER_GOOGLE;
  }
} catch (error) {
  console.warn("Maps module not available");
}

// Import icons that work on all platforms
import { Home, MapPin, Navigation } from "lucide-react-native";

interface DeliveryMapProps {
  restaurantLocation: Location;
  deliveryPersonLocation?: Location;
  userLocation: Location;
  estimatedTime?: number;
}

const { width } = Dimensions.get("window");

export default function DeliveryMap({
  restaurantLocation,
  deliveryPersonLocation,
  userLocation,
  estimatedTime,
}: DeliveryMapProps) {
  const [region, setRegion] = useState({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  // Update map region to fit all markers when locations change
  useEffect(() => {
    if (Platform.OS !== "web" && deliveryPersonLocation) {
      // Calculate the center point between all locations
      const latitudes = [
        restaurantLocation.latitude,
        deliveryPersonLocation.latitude,
        userLocation.latitude,
      ];
      const longitudes = [
        restaurantLocation.longitude,
        deliveryPersonLocation.longitude,
        userLocation.longitude,
      ];

      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      // Calculate appropriate deltas to fit all markers
      const latDelta = (maxLat - minLat) * 1.5;
      const lngDelta = (maxLng - minLng) * 1.5;

      setRegion({
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: Math.max(0.02, latDelta),
        longitudeDelta: Math.max(0.02, lngDelta),
      });
    }
  }, [restaurantLocation, deliveryPersonLocation, userLocation]);

  // For web platform, show a placeholder instead of the map
  if (Platform.OS === "web" || !MapView) {
    return (
      <View style={styles.webPlaceholder}>
        <Text style={styles.webPlaceholderText}>
          Delivery tracking map
        </Text>
        {estimatedTime && (
          <Text style={styles.webPlaceholderSubtext}>
            Estimated delivery time: {estimatedTime} minutes
          </Text>
        )}
        {deliveryPersonLocation && (
          <Text style={styles.webPlaceholderSubtext}>
            Your delivery person is on the way!
          </Text>
        )}
        <View style={styles.webMapLegend}>
          <View style={styles.webMapLegendItem}>
            <View style={[styles.markerContainer, styles.restaurantMarker]}>
              <MapPin size={16} color={"#FFFFFF"} />
            </View>
            <Text style={styles.webMapLegendText}>Restaurant</Text>
          </View>
          {deliveryPersonLocation && (
            <View style={styles.webMapLegendItem}>
              <View style={[styles.markerContainer, styles.deliveryMarker]}>
                <Navigation size={16} color={"#FFFFFF"} />
              </View>
              <Text style={styles.webMapLegendText}>Delivery Person</Text>
            </View>
          )}
          <View style={styles.webMapLegendItem}>
            <View style={[styles.markerContainer, styles.userMarker]}>
              <Home size={16} color={"#FFFFFF"} />
            </View>
            <Text style={styles.webMapLegendText}>Your Location</Text>
          </View>
        </View>
      </View>
    );
  }

  // For native platforms, render the actual map
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        provider={PROVIDER_GOOGLE}
      >
        {/* Restaurant marker */}
        <Marker
          coordinate={{
            latitude: restaurantLocation.latitude,
            longitude: restaurantLocation.longitude,
          }}
        >
          <View style={[styles.markerContainer, styles.restaurantMarker]}>
            <MapPin size={20} color={"#FFFFFF"} />
          </View>
        </Marker>

        {/* Delivery person marker */}
        {deliveryPersonLocation && (
          <Marker
            coordinate={{
              latitude: deliveryPersonLocation.latitude,
              longitude: deliveryPersonLocation.longitude,
            }}
          >
            <View style={[styles.markerContainer, styles.deliveryMarker]}>
              <Navigation size={20} color={"#FFFFFF"} />
            </View>
          </Marker>
        )}

        {/* User location marker */}
        <Marker
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
        >
          <View style={[styles.markerContainer, styles.userMarker]}>
            <Home size={20} color={"#FFFFFF"} />
          </View>
        </Marker>

        {/* Route line from restaurant to delivery person */}
        {deliveryPersonLocation && (
          <Polyline
            coordinates={[
              {
                latitude: restaurantLocation.latitude,
                longitude: restaurantLocation.longitude,
              },
              {
                latitude: deliveryPersonLocation.latitude,
                longitude: deliveryPersonLocation.longitude,
              },
            ]}
            strokeColor={"#0095F6"}
            strokeWidth={3}
            lineDashPattern={[1, 3]}
          />
        )}

        {/* Route line from delivery person to user */}
        {deliveryPersonLocation && (
          <Polyline
            coordinates={[
              {
                latitude: deliveryPersonLocation.latitude,
                longitude: deliveryPersonLocation.longitude,
              },
              {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              },
            ]}
            strokeColor={"#0095F6"}
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* Estimated delivery time overlay */}
      {estimatedTime && (
        <View style={styles.estimatedTimeContainer}>
          <Text style={styles.estimatedTimeText}>
            Estimated delivery: {estimatedTime} min
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  restaurantMarker: {
    backgroundColor: "#8E8E8E",
  },
  deliveryMarker: {
    backgroundColor: "#0095F6",
  },
  userMarker: {
    backgroundColor: "#FBAD50",
  },
  estimatedTimeContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },
  estimatedTimeText: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  webPlaceholder: {
    height: 250,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
  },
  webPlaceholderText: {
    ...typography.heading4,
    marginBottom: 8,
  },
  webPlaceholderSubtext: {
    ...typography.bodySmall,
    color: "#8E8E8E",
    marginBottom: 16,
  },
  webMapLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  webMapLegendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  webMapLegendText: {
    ...typography.caption,
    marginLeft: 4,
  },
});
