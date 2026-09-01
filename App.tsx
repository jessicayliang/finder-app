import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import {
  fetchProfiles,
  fetchUserProfile,
  Profile,
  createProfile,
} from './data/profiles';
import ProfileCard from './components/ProfileCard';
import ProfileScreen from './components/ProfileScreen';
import DeveloperScreen from './components/DeveloperScreen';
import ProfileEditor from './components/ProfileEditor';

type Screen =
  | 'swipe'
  | 'profile'
  | 'developer'
  | 'profileEditor';

export default function App() {

  const [userProfile, setUserProfile] =
    useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] =
    useState(0);

  const [screen, setScreen] =
    useState<Screen>('swipe');

  const [editingProfileId, setEditingProfileId] =
    useState<number | null>(null);

  const [editingUserProfile, setEditingUserProfile] =
    useState(false);

  const [loadingProfiles, setLoadingProfiles] =
    useState(true);

    useEffect(() => {
      const loadProfiles = async () => {
        try {
          const [data, user] = await Promise.all([
            fetchProfiles(),
            fetchUserProfile(),
          ]);

          console.log('LOADED PROFILES:', data);
          console.log('USER PROFILE:', user);

          setProfiles(data);
          setUserProfile(user);
        } catch (error) {
          console.error(
            'FAILED TO LOAD PROFILES:',
            error
          );
        } finally {
          setLoadingProfiles(false);
        }
      };

      loadProfiles();
    }, []);

  /*
   * Always keep the index inside the profiles array.
   */
  const safeProfileIndex =
    profiles.length > 0
      ? currentProfileIndex % profiles.length
      : 0;

  const currentProfile =
    profiles.length > 0
      ? profiles[safeProfileIndex]
      : undefined;

  const nextProfile =
    profiles.length > 1
      ? profiles[
          (safeProfileIndex + 1) % profiles.length
        ]
      : undefined;

  return (
    <View style={styles.container}>

      {/* SWIPE SCREEN */}

      {/* SWIPE SCREEN */}

      {screen === 'swipe' && (
        <>
          <View style={styles.header}>
            <Text style={styles.logo}>
              Finder
            </Text>
          </View>

          {loadingProfiles ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                Loading profiles...
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.cardStack}>

                {/* BACKGROUND CARD */}

                {nextProfile && (
                  <ProfileCard
                    key={`background-${nextProfile.id}`}
                    profile={nextProfile}
                    onSwipe={() => {}}
                    isBackground
                    stackOffset={8}
                  />
                )}

                {/* CURRENT CARD */}

                {currentProfile && (
                  <ProfileCard
                    key={`current-${currentProfile.id}`}
                    profile={currentProfile}
                    onSwipe={() => {
                      if (profiles.length > 0) {
                        setCurrentProfileIndex(
                          (currentIndex) =>
                            (currentIndex + 1) %
                            profiles.length
                        );
                      }
                    }}
                  />
                )}

              </View>

              <View style={styles.actions}>

                <View
                  style={[
                    styles.actionButton,
                    styles.rewindButton,
                  ]}
                >
                  <Text style={styles.rewindSymbol}>
                    ↻
                  </Text>
                </View>

                <View
                  style={[
                    styles.actionButton,
                    styles.passButton,
                  ]}
                >
                  <Text style={styles.passSymbol}>
                    ×
                  </Text>
                </View>

                <View
                  style={[
                    styles.actionButton,
                    styles.likeButton,
                  ]}
                >
                  <Text style={styles.likeSymbol}>
                    ✓
                  </Text>
                </View>

                <View
                  style={[
                    styles.actionButton,
                    styles.sendButton,
                  ]}
                >
                  <Text style={styles.sendSymbol}>
                    ⌯⌲
                  </Text>
                </View>

              </View>
            </>
          )}
        </>
      )}

      {/* IVY PROFILE */}

      {screen === 'profile' && (
        <ProfileScreen
          onOpenDeveloperMode={() =>
            setScreen('developer')
          }
        />
      )}

      {/* DEVELOPER MODE */}

      {screen === 'developer' && (
        <DeveloperScreen
          profiles={profiles}

          onBack={() => setScreen('profile')}

          onAddProfile={async () => {
            try {
              const newProfile = await createProfile({
                name: '',
                age: 18,
                distance: 0,
                photos: [],
                bio: '',
                job: '',
                school: '',
                location: '',
                gender: '',
                lookingFor: '',
                minAge: 18,
                maxAge: 35,
                maxDistance: 25,
                interests: [],
                drinking: '',
                smoking: '',
                pets: '',
              });

              console.log(
                '🟢 NEW PROFILE CREATED FROM APP:',
                newProfile
              );

              setProfiles((currentProfiles) => [
                ...currentProfiles,
                newProfile,
              ]);

              setEditingProfileId(newProfile.id);
              setScreen('profileEditor');

            } catch (error) {
              console.error(
                '🔴 FAILED TO CREATE NEW PROFILE:',
                error
              );
            }
          }}

          onEditProfile={(profileId) => {
            setEditingProfileId(profileId);
            setEditingUserProfile(false);
            setScreen('profileEditor');
          }}
        />
      )}

      {/* PROFILE EDITOR */}

      {screen === 'profileEditor' && (
        <ProfileEditor
          key={
            editingUserProfile
              ? 'user-profile'
              : `profile-${editingProfileId}`
          }
          profileId={editingProfileId}
          profiles={profiles}
          userProfile={userProfile}
          isUserProfile={editingUserProfile}
          onProfilesChange={setProfiles}
          onUserProfileChange={setUserProfile}
          onBack={() => {
            setScreen('developer');
          }}
        />
      )}

      {/* BOTTOM NAVIGATION */}

      {(screen === 'swipe' ||
        screen === 'profile') && (
        <View style={styles.navBar}>

          <Pressable
            style={styles.navItem}
            onPress={() => setScreen('swipe')}
          >
            <Text style={styles.navIcon}>
              ♥
            </Text>

            <Text
              style={
                screen === 'swipe'
                  ? styles.activeNavText
                  : styles.navText
              }
            >
              Swipe
            </Text>
          </Pressable>

          <View style={styles.navItem}>
            <Text style={styles.navIcon}>
              ⌕
            </Text>

            <Text style={styles.navText}>
              Explore
            </Text>
          </View>

          <View style={styles.navItem}>
            <Text style={styles.navIcon}>
              ✓
            </Text>

            <Text style={styles.navText}>
              Likes
            </Text>
          </View>

          <View style={styles.navItem}>
            <Text style={styles.navIcon}>
              ▢
            </Text>

            <Text style={styles.navText}>
              Chat
            </Text>
          </View>

          <Pressable
            style={styles.navItem}
            onPress={() => setScreen('profile')}
          >
            <Text style={styles.navIcon}>
              ○
            </Text>

            <Text
              style={
                screen === 'profile'
                  ? styles.activeNavText
                  : styles.navText
              }
            >
              Profile
            </Text>
          </Pressable>

        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  cardStack: {
    flex: 1,
    position: 'relative',
  },

  header: {
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    fontSize: 30,
    fontWeight: '700',
  },

  actions: {
    height: 82,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },

  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },

  rewindButton: {
    width: 46,
    height: 46,
  },

  passButton: {
    width: 56,
    height: 56,
  },

  likeButton: {
    width: 56,
    height: 56,
  },

  sendButton: {
    width: 46,
    height: 46,
  },

  rewindSymbol: {
    fontSize: 29,
    fontWeight: '500',
  },

  passSymbol: {
    fontSize: 37,
    fontWeight: '300',
  },

  likeSymbol: {
    fontSize: 29,
    fontWeight: '600',
  },

  sendSymbol: {
    fontSize: 22,
    fontWeight: '600',
  },

  navBar: {
    height: 82,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 12,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  navIcon: {
    fontSize: 21,
    color: '#777777',
  },

  navText: {
    fontSize: 11,
    color: '#777777',
    fontWeight: '500',
  },

  activeNavText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111111',
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    fontSize: 16,
    color: '#777777',
  },
});