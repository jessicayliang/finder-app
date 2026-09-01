import { useState } from 'react';

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Profile } from '../data/profiles';

type ProfileDetailsScreenProps = {
  profile: Profile;
  onBack: () => void;
};

export default function ProfileDetailsScreen({
  profile,
  onBack,
}: ProfileDetailsScreenProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  return (
    <View style={styles.container}>

      {/* TOP BAR */}

      <View style={styles.topBar}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>

          <Text style={styles.backLabel}>
            Back
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Profile
        </Text>

        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* {/* PHOTOS */}

        {profile.photos.length > 0 && (
          <View style={styles.photoSection}>

            <Image
              source={{
                uri: profile.photos[currentPhotoIndex],
              }}
              style={styles.photo}
              resizeMode="cover"
            />

            {/* PHOTO INDICATORS */}

            {profile.photos.length > 1 && (
              <View style={styles.photoIndicators}>
                {profile.photos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.photoIndicator,
                      index === currentPhotoIndex &&
                        styles.photoIndicatorActive,
                    ]}
                  />
                ))}
              </View>
            )}

            {/* TAP LEFT */}

            {profile.photos.length > 1 && (
              <Pressable
                style={styles.photoTapLeft}
                onPress={() => {
                  setCurrentPhotoIndex((index) =>
                    Math.max(0, index - 1)
                  );
                }}
              />
            )}

            {/* TAP RIGHT */}

            {profile.photos.length > 1 && (
              <Pressable
                style={styles.photoTapRight}
                onPress={() => {
                  setCurrentPhotoIndex((index) =>
                    Math.min(
                      profile.photos.length - 1,
                      index + 1
                    )
                  );
                }}
              />
            )}

          </View>
        )}

        {/* NAME */}

        <View style={styles.section}>
          <Text style={styles.name}>
            {profile.name}, {profile.age}
          </Text>

          <Text style={styles.distance}>
            {profile.distance} miles away
          </Text>
        </View>

        {/* ABOUT */}

        {profile.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              About
            </Text>

            <Text style={styles.bodyText}>
              {profile.bio}
            </Text>
          </View>
        )}

        {/* WORK */}

        {profile.job && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Work
            </Text>

            <Text style={styles.bodyText}>
              {profile.job}
            </Text>
          </View>
        )}

        {/* SCHOOL */}

        {profile.school && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              School
            </Text>

            <Text style={styles.bodyText}>
              {profile.school}
            </Text>
          </View>
        )}

        {/* LOCATION */}

        {profile.location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Location
            </Text>

            <Text style={styles.bodyText}>
              {profile.location}
            </Text>
          </View>
        )}

        {/* GENDER */}

        {profile.gender && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Gender
            </Text>

            <Text style={styles.bodyText}>
              {profile.gender}
            </Text>
          </View>
        )}

        {/* LOOKING FOR */}

        {profile.lookingFor && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Looking For
            </Text>

            <Text style={styles.bodyText}>
              {profile.lookingFor}
            </Text>
          </View>
        )}

        {/* AGE RANGE */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Age Range
          </Text>

          <Text style={styles.bodyText}>
            {profile.minAge} – {profile.maxAge}
          </Text>
        </View>

        {/* MAX DISTANCE */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Maximum Distance
          </Text>

          <Text style={styles.bodyText}>
            {profile.maxDistance} miles
          </Text>
        </View>

        {/* INTERESTS */}

        {profile.interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Interests
            </Text>

            <View style={styles.interests}>
              {profile.interests.map((interest) => (
                <View
                  key={interest}
                  style={styles.interest}
                >
                  <Text style={styles.interestText}>
                    {interest}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* LIFESTYLE */}

        {(profile.drinking ||
          profile.smoking ||
          profile.pets) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Lifestyle
            </Text>

            {profile.drinking && (
              <View style={styles.lifestyleRow}>
                <Text style={styles.lifestyleLabel}>
                  Drinking
                </Text>

                <Text style={styles.bodyText}>
                  {profile.drinking}
                </Text>
              </View>
            )}

            {profile.smoking && (
              <View style={styles.lifestyleRow}>
                <Text style={styles.lifestyleLabel}>
                  Smoking
                </Text>

                <Text style={styles.bodyText}>
                  {profile.smoking}
                </Text>
              </View>
            )}

            {profile.pets && (
              <View style={styles.lifestyleRow}>
                <Text style={styles.lifestyleLabel}>
                  Pets
                </Text>

                <Text style={styles.bodyText}>
                  {profile.pets}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.bottomSpacer} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  topBar: {
    height: 100,
    paddingTop: 45,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
  },

  backText: {
    fontSize: 38,
    lineHeight: 38,
    color: '#111111',
  },

  backLabel: {
    fontSize: 16,
    color: '#111111',
    marginLeft: 3,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },

  topBarSpacer: {
    width: 90,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  photoSection: {
    width: '100%',
    aspectRatio: 0.75,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 24,
    backgroundColor: '#e5e5e5',
  },

  photo: {
    width: '100%',
    height: '100%',
  },

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

  section: {
    marginBottom: 28,
  },

  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 5,
  },

  distance: {
    fontSize: 15,
    color: '#777777',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 10,
  },

  bodyText: {
    fontSize: 16,
    lineHeight: 23,
    color: '#333333',
  },

  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  interest: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },

  interestText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },

  lifestyleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },

  lifestyleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555555',
  },

  bottomSpacer: {
    height: 40,
  },
});
