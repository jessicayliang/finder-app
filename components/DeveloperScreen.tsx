import { Pressable, StyleSheet, Text, View } from 'react-native';

import { profiles } from '../data/profiles';

type DeveloperScreenProps = {
  onBack: () => void;
  onAddProfile: () => void;
  onEditProfile: (profileId: number) => void;
};

export default function DeveloperScreen({
  onBack,
  onAddProfile,
  onEditProfile,
}: DeveloperScreenProps) {
  return (
    <View style={styles.container}>

      <Pressable
        style={styles.backButton}
        onPress={onBack}
        hitSlop={10}
      >
        <Text style={styles.backText}>‹</Text>
        <Text style={styles.backLabel}>Back</Text>
      </Pressable>

      <Text style={styles.title}>
        Developer Mode
      </Text>

      <Text style={styles.subtitle}>
        Manage profiles
      </Text>

      <View style={styles.profileList}>

        {profiles.map((profile) => (
          <Pressable
            key={profile.id}
            style={styles.profileRow}
            onPress={() => onEditProfile(profile.id)}
          >
            <View>
              <Text style={styles.profileName}>
                {profile.name}
              </Text>

              <Text style={styles.profileDetails}>
                {profile.age} · {profile.distance} miles away
              </Text>
            </View>

            <Text style={styles.chevron}>
              ›
            </Text>
          </Pressable>
        ))}

      </View>

      <Pressable
        style={styles.button}
        onPress={onAddProfile}
      >
        <Text style={styles.buttonText}>
          + Add Profile
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },

  backButton: {
    position: 'absolute',
    top: 65,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 12,
  },

  backText: {
    fontSize: 34,
    fontWeight: '300',
    lineHeight: 34,
  },

  backLabel: {
    fontSize: 16,
    marginLeft: 3,
    fontWeight: '500',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 125,
  },

  subtitle: {
    fontSize: 15,
    color: '#777777',
    marginTop: 6,
    marginBottom: 20,
  },

  profileList: {
    marginBottom: 20,
  },

  profileRow: {
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  profileName: {
    fontSize: 17,
    fontWeight: '600',
  },

  profileDetails: {
    fontSize: 13,
    color: '#777777',
    marginTop: 4,
  },

  chevron: {
    fontSize: 28,
    color: '#999999',
  },

  button: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
