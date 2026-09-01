import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Profile } from '../data/profiles';
import { saveUserProfile, updateProfile } from '../data/profiles';

export default function ProfileCard({
  profile,
  onSwipe,
  onOpenProfile,
  isBackground = false,
  stackOffset = 0,
}: ProfileCardProps) {
  const position = useRef(new Animated.ValueXY()).current;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const backgroundPosition = {
    transform: [],
  };

  useEffect(() => {
    position.setValue({ x: 0, y: 0 });
    setCurrentPhotoIndex(0);
  }, [profile.id]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gesture) => {
        position.setValue({
          x: gesture.dx,
          y: gesture.dy,
        });
      },

      onPanResponderRelease: (_, gesture) => {
        const swipeThreshold = 120;

        if (gesture.dx > swipeThreshold) {
          // Swipe right = Like
          Animated.timing(position, {
            toValue: { x: 500, y: gesture.dy },
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            onSwipe();
          });
        } else if (gesture.dx < -swipeThreshold) {
            // Swipe left = Pass
            Animated.timing(position, {
              toValue: { x: -500, y: gesture.dy },
              duration: 250,
              useNativeDriver: true,
            }).start(() => {
              onSwipe();
            });
        } else {
          // Not far enough — return to center
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'extend',
  });

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.card,
        isBackground ? backgroundPosition : cardStyle,
      ]}
      {...(!isBackground ? panResponder.panHandlers : {})}
    >
      <View style={styles.photoPlaceholder}>
        {profile.photos.length > 0 ? (
          <Image
            source={{ uri: profile.photos[currentPhotoIndex] }}
            style={styles.profilePhoto}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.photoText}>PHOTO</Text>
        )}

        {!isBackground && profile.photos.length > 0 && (
          <View style={styles.photoIndicators}>
            {profile.photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.photoIndicator,
                  index === currentPhotoIndex && styles.photoIndicatorActive,
                ]}
              />
            ))}
          </View>
        )}

        {!isBackground && profile.photos.length > 1 && (
          <>
            <View
              style={styles.photoTapLeft}
              onTouchEnd={() => {
                setCurrentPhotoIndex((index) => Math.max(0, index - 1));
              }}
            />

            <View
              style={styles.photoTapRight}
              onTouchEnd={() => {
                setCurrentPhotoIndex((index) =>
                  Math.min(profile.photos.length - 1, index + 1)
                );
              }}
            />
          </>
        )}
      </View>

      {!isBackground && (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.swipeIndicator,
              styles.passIndicator,
              {
                opacity: position.x.interpolate({
                  inputRange: [-150, -20, 0],
                  outputRange: [1, 0.3, 0],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          >
            <Text style={styles.indicatorText}>×</Text>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[
              styles.swipeIndicator,
              styles.likeIndicator,
              {
                opacity: position.x.interpolate({
                  inputRange: [0, 20, 150],
                  outputRange: [0, 0.3, 1],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          >
            <Text style={styles.indicatorText}>♥</Text>
          </Animated.View>
        </>
      )}

      <Pressable
        style={styles.profileInfo}
        onPress={() => onOpenProfile(profile)}
      >
        <Text style={styles.name}>
          {profile.name}, {profile.age}
        </Text>

        <Text style={styles.distance}>
          {profile.distance} miles away
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({

  photoIndicators: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    gap: 4,
  },

  photoIndicator: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },

  photoIndicatorActive: {
    backgroundColor: '#ffffff',
  },

  photoTapLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '50%',
  },

  photoTapRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
  },

  card: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e5e5',
  },

  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profilePhoto: {
    width: '100%',
    height: '100%',
  },

  photoText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#999999',
  },

  profileInfo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  name: {
    fontSize: 29,
    fontWeight: '700',
    color: '#ffffff',
  },

  distance: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 5,
  },

  swipeIndicator: {
    position: 'absolute',
    top: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  passIndicator: {
    right: 55,
    transform: [{ rotate: '12deg' }],
  },

  likeIndicator: {
    left: 55,
    transform: [{ rotate: '-12deg' }],
  },

  indicatorText: {
    fontSize: 78,
    fontWeight: '900',
    color: '#cccccc',
    lineHeight: 84,
  },
});