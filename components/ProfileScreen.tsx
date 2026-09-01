import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';

import {
  Profile,
  fetchUserProfile,
  saveUserProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
} from '../data/profiles';

type ProfileScreenProps = {
  onOpenDeveloperMode: () => void;
};

const genderOptions = [
  'Woman',
  'Man',
  'Non-binary',
];

const lookingForOptions = [
  'Men',
  'Women',
  'Everyone',
];

const drinkingOptions = [
  'Never',
  'Sometimes',
  'Often',
];

const smokingOptions = [
  'Never',
  'Sometimes',
  'Often',
];

const petsOptions = [
  'No pets',
  'Have pets',
  'Want pets',
];

const distanceOptions = [
  5,
  10,
  15,
  25,
  50,
  100,
];

const interestOptions = [
  'Running',
  'Travel',
  'Music',
  'Movies',
  'Cooking',
  'Fitness',
  'Art',
  'Reading',
  'Hiking',
  'Photography',
  'Coffee',
  'Dancing',
];

export default function ProfileScreen({
  onOpenDeveloperMode,
}: ProfileScreenProps) {

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfile();

        console.log('USER PROFILE FROM SUPABASE:', data);

        if (!data) {
          console.error(
            'No user profile found in Supabase.'
          );
          return;
        }

        setProfile(data);

        setName(data.name);
        setAge(String(data.age));
        setBio(data.bio ?? '');
        setJob(data.job ?? '');
        setSchool(data.school ?? '');
        setLocation(data.location ?? '');

        setGender(data.gender ?? '');
        setLookingFor(data.lookingFor ?? '');

        setMinAge(data.minAge ?? 18);
        setMaxAge(data.maxAge ?? 35);
        setMaxDistance(data.maxDistance ?? 25);

        setInterests(data.interests ?? []);

        setDrinking(data.drinking ?? '');
        setSmoking(data.smoking ?? '');
        setPets(data.pets ?? '');
      } catch (error) {
        console.error(
          'FAILED TO LOAD USER PROFILE:',
          error
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, []);

  // ----------------------------------------
  // IVY'S PROFILE
  // ----------------------------------------

  const [profile, setProfile] = useState<Profile | null>(
    null
  );

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [job, setJob] = useState('');
  const [school, setSchool] = useState('');
  const [location, setLocation] = useState('');

  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');

  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [maxDistance, setMaxDistance] = useState(25);

  const [interests, setInterests] = useState<string[]>([]);

  const [drinking, setDrinking] = useState('');
  const [smoking, setSmoking] = useState('');
  const [pets, setPets] = useState('');

  const [photoVersion, setPhotoVersion] = useState(0);

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  // Save button only appears when a text field is focused.
  const [showSaveButton, setShowSaveButton] =
    useState(false);

  // ----------------------------------------
  // SAVE TEXT FIELDS
  // ----------------------------------------

  const saveTextFields = async () => {
    try {
      const updates: Partial<Profile> = {
        name,
        age: Number(age) || 18,
        bio,
        job,
        school,
        location,
      };

      const updatedProfile =
        await saveUserProfile(updates);

      setProfile(updatedProfile);

      setShowSaveButton(false);

      Alert.alert(
        'Profile Saved',
        'Your profile has been saved.'
      );
    } catch (error) {
      console.error(
        'FAILED TO SAVE PROFILE:',
        error
      );

      Alert.alert(
        'Error',
        'Could not save your profile.'
      );
    }
  };

  // ----------------------------------------
  // SELECTION HANDLERS
  // ----------------------------------------

  const selectGender = async (value: string) => {
    setGender(value);

    try {
      await saveUserProfile({
        gender: value,
      });
    } catch (error) {
      console.error(
        'Failed to save gender:',
        error
      );
    }
  };

  const selectLookingFor = async (value: string) => {
    setLookingFor(value);

    try {
      await saveUserProfile({
        lookingFor: value,
      });
    } catch (error) {
      console.error(
        'Failed to save looking for:',
        error
      );
    }
  };

  const selectMinAge = async (value: number) => {
    const newValue = Math.min(
      Math.round(value),
      maxAge
    );

    setMinAge(newValue);

    try {
      await saveUserProfile({
        minAge: newValue,
      });
    } catch (error) {
      console.error(
        'Failed to save minimum age:',
        error
      );
    }
  };

  const selectMaxAge = async (value: number) => {
    const newValue = Math.max(
      Math.round(value),
      minAge
    );

    setMaxAge(newValue);

    try {
      await saveUserProfile({
        maxAge: newValue,
      });
    } catch (error) {
      console.error(
        'Failed to save maximum age:',
        error
      );
    }
  };

  const selectDistance = async (value: number) => {
    setMaxDistance(value);

    try {
      await saveUserProfile({
        maxDistance: value,
      });
    } catch (error) {
      console.error(
        'Failed to save distance:',
        error
      );
    }
  };

  const selectDrinking = async (value: string) => {
    setDrinking(value);

    try {
      await saveUserProfile({
        drinking: value,
      });
    } catch (error) {
      console.error(
        'Failed to save drinking:',
        error
      );
    }
  };

  const selectSmoking = async (value: string) => {
    setSmoking(value);

    try {
      await saveUserProfile({
        smoking: value,
      });
    } catch (error) {
      console.error(
        'Failed to save smoking:',
        error
      );
    }
  };

  const selectPets = async (value: string) => {
    setPets(value);

    try {
      await saveUserProfile({
        pets: value,
      });
    } catch (error) {
      console.error(
        'Failed to save pets:',
        error
      );
    }
  };

  const toggleInterest = async (interest: string) => {
    const newInterests = interests.includes(interest)
      ? interests.filter(
          (item) => item !== interest
        )
      : [...interests, interest];

    setInterests(newInterests);

    try {
      await saveUserProfile({
        interests: newInterests,
      });
    } catch (error) {
      console.error(
        'Failed to save interests:',
        error
      );
    }
  };

    const addPhoto = async (index: number) => {
      Alert.alert(
        'Add Photo',
        'Choose how you want to add your photo.',
        [
          {
            text: 'Camera Roll',
            onPress: async () => {
              const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

              if (!permission.granted) {
                Alert.alert(
                  'Permission Needed',
                  'Please allow access to your photo library.'
                );
                return;
              }

              const result =
                await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ['images'],
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.9,
                });

              if (!result.canceled) {
                const localUri = result.assets[0].uri;

                try {
                  const currentPhotos = profile?.photos ?? [];

                  const photoUrl = await uploadProfilePhoto(
                    localUri,
                    profile?.id ?? 0
                  );

                  const newPhotos = [...currentPhotos];

                  newPhotos[index] = photoUrl;

                  const updatedProfile =
                    await saveUserProfile({
                      photos: newPhotos,
                    });

                  setProfile(updatedProfile);

                  setPhotoVersion(
                    (version) => version + 1
                  );
                } catch (error) {
                  console.error(
                    'FAILED TO SAVE PHOTO:',
                    error
                  );

                  Alert.alert(
                    'Error',
                    'Could not save your photo.'
                  );
                }
              }
            },
          },
          {
            text: 'Take Photo Now',
            onPress: async () => {
              const permission =
                await ImagePicker.requestCameraPermissionsAsync();

              if (!permission.granted) {
                Alert.alert(
                  'Permission Needed',
                  'Please allow camera access.'
                );
                return;
              }

              const result =
                await ImagePicker.launchCameraAsync({
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.9,
                });

              if (!result.canceled) {
                const localUri = result.assets[0].uri;

                try {
                  const currentPhotos = profile?.photos ?? [];

                  const photoUrl = await uploadProfilePhoto(
                    localUri,
                    profile?.id ?? 0
                  );

                  const newPhotos = [...currentPhotos];

                  newPhotos[index] = photoUrl;

                  const updatedProfile =
                    await saveUserProfile({
                      photos: newPhotos,
                    });

                  setProfile(updatedProfile);

                  setPhotoVersion(
                    (version) => version + 1
                  );
                } catch (error) {
                  console.error(
                    'FAILED TO SAVE PHOTO:',
                    error
                  );

                  Alert.alert(
                    'Error',
                    'Could not save your photo.'
                  );
                }
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    };

    const removePhoto = async (index: number) => {
      const currentPhotos = profile?.photos ?? [];
      const photoUrl = currentPhotos[index];

      if (!photoUrl) {
        return;
      }

      const newPhotos = [...currentPhotos];

      // Remove this photo and shift later photos forward.
      newPhotos.splice(index, 1);

      try {
        // Delete the actual file from Supabase Storage.
        if (
          photoUrl.includes(
            '/storage/v1/object/public/profile-photos/'
          )
        ) {
          await deleteProfilePhoto(photoUrl);
        }

        // Remove the URL from the profile record.
        const updatedProfile = await saveUserProfile({
          photos: newPhotos,
        });

        setProfile(updatedProfile);

        setPhotoVersion((version) => version + 1);
      } catch (error) {
        console.error(
          'FAILED TO REMOVE PHOTO:',
          error
        );

        Alert.alert(
          'Error',
          'Could not remove your photo.'
        );
      }
    };

  // ----------------------------------------
  // SCREEN
  // ----------------------------------------

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >

      <ScrollView
        contentContainerStyle={[
          styles.content,
          showSaveButton &&
            styles.contentWithSaveButton,
        ]}
        keyboardShouldPersistTaps="handled"
      >

        {/* ---------------------------------------- */}
        {/* PROFILE HEADER */}
        {/* ---------------------------------------- */}

        <View style={styles.header}>

          <View style={styles.photo}>
            {(profile?.photos ?? []).length > 0 ? (
              <Image
                source={{
                  uri: profile?.photos[0],
                }}
                style={styles.profilePhoto}
              />
            ) : (
              <Text style={styles.photoText}>
                PHOTO
              </Text>
            )}
          </View>

          <Text style={styles.namePreview}>
            {name || 'Your name'}, {age || '18'}
          </Text>

          {location !== '' && (
            <Text style={styles.locationPreview}>
              {location}
            </Text>
          )}

        </View>

        {/* ---------------------------------------- */}
        {/* PHOTOS */}
        {/* ---------------------------------------- */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Photos
          </Text>

          <Text style={styles.photoHelperText}>
            Add up to 9 photos. The first photo is your
            main profile photo.
          </Text>

          <View style={styles.photoGrid}>

            {Array.from({ length: 9 }).map(
              (_, index) => {
                const photo =
                  profile?.photos[index];

                return (
                  <Pressable
                    key={`${index}-${photoVersion}`}
                    style={styles.photoSlot}
                    onPress={() => {
                      if (photo) {
                        Alert.alert(
                          'Photo',
                          'What would you like to do?',
                          [
                            {
                              text: 'Change Photo',
                              onPress: () => addPhoto(index),
                            },
                            {
                              text: 'Remove Photo',
                              style: 'destructive',
                              onPress: () => removePhoto(index),
                            },
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                          ]
                        );
                      } else {
                        addPhoto(index);
                      }
                    }}
                  >
                    {photo ? (
                      <Image
                        source={{ uri: photo }}
                        style={styles.photoImage}
                      />
                    ) : (
                      <View
                        style={styles.emptyPhoto}
                      >
                        <Text
                          style={styles.plusText}
                        >
                          +
                        </Text>

                        <Text
                          style={styles.addPhotoText}
                        >
                          Add
                        </Text>
                      </View>
                    )}

                    {index === 0 && (
                      <View
                        style={
                          styles.mainPhotoLabel
                        }
                      >
                        <Text
                          style={
                            styles.mainPhotoLabelText
                          }
                        >
                          Main
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              }
            )}

          </View>

        </View>

        {/* ---------------------------------------- */}
        {/* BASIC INFORMATION */}
        {/* ---------------------------------------- */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Basic Information
          </Text>

          <Text style={styles.label}>
            Name
          </Text>

          <TextInput
            style={styles.input}
            value={name}
            onFocus={() => {
              setShowSaveButton(true);
            }}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#999999"
          />

          <Text style={styles.label}>
            Age
          </Text>

          <TextInput
            style={styles.input}
            value={age}
            onFocus={() => {
              setShowSaveButton(true);
            }}
            onChangeText={setAge}
            keyboardType="number-pad"
            placeholder="Age"
            placeholderTextColor="#999999"
          />

        </View>

        {/* ---------------------------------------- */}
        {/* ABOUT */}
        {/* ---------------------------------------- */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            About
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
            ]}
            value={bio}
            onFocus={() => {
              setShowSaveButton(true);
            }}
            onChangeText={setBio}
            placeholder="Tell people about yourself"
            placeholderTextColor="#999999"
            multiline
          />

        </View>

        {/* ---------------------------------------- */}
        {/* WORK */}
        {/* ---------------------------------------- */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Work
          </Text>

          <TextInput
            style={styles.input}
            value={job}
            onFocus={() => {
              setShowSaveButton(true);
            }}
            onChangeText={setJob}
            placeholder="Job"
            placeholderTextColor="#999999"
          />

        </View>

        {/* ---------------------------------------- */}
        {/* SCHOOL */}
        {/* ---------------------------------------- */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            School
          </Text>

          <TextInput
            style={styles.input}
            value={school}
            onFocus={() => {
              setShowSaveButton(true);
            }}
            onChangeText={setSchool}
            placeholder="School"
            placeholderTextColor="#999999"
          />

        </View>

        {/* ---------------------------------------- */}
        {/* LOCATION */}
        {/* ---------------------------------------- */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Location
          </Text>

          <TextInput
            style={styles.input}
            value={location}
            onFocus={() => {
              setShowSaveButton(true);
            }}
            onChangeText={setLocation}
            placeholder="Location"
            placeholderTextColor="#999999"
          />

        </View>

        {/* ---------------------------------------- */}
        {/* GENDER */}
        {/* ---------------------------------------- */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Gender
          </Text>

          <View style={styles.optionsContainer}>

            {genderOptions.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.option,
                  gender === option &&
                    styles.selectedOption,
                ]}
                onPress={() => {
                  selectGender(option);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    gender === option &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}

          </View>

        </View>

        {/* ---------------------------------------- */}
        {/* LOOKING FOR */}
        {/* ---------------------------------------- */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Looking For
          </Text>

          <View style={styles.optionsContainer}>

            {lookingForOptions.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.option,
                  lookingFor === option &&
                    styles.selectedOption,
                ]}
                onPress={() => {
                  selectLookingFor(option);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    lookingFor === option &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}

          </View>

        </View>

        {/* ---------------------------------------- */}
        {/* AGE RANGE */}
        {/* ---------------------------------------- */}

        <View style={styles.section}>

          <View style={styles.ageRangeHeader}>

            <Text style={styles.sectionTitle}>
              Age Range
            </Text>

            <Text style={styles.ageRangeValue}>
              {minAge} – {maxAge}
            </Text>

          </View>

          <Text style={styles.sliderLabel}>
            Minimum age
          </Text>

          <Slider
            style={styles.slider}
            minimumValue={18}
            maximumValue={100}
            step={1}
            value={minAge}
            minimumTrackTintColor="#111111"
            maximumTrackTintColor="#dddddd"
            thumbTintColor="#111111"
            onValueChange={(value) => {
              selectMinAge(value);
            }}
          />

          <View style={styles.sliderEndpoints}>
            <Text style={styles.endpointText}>
              18
            </Text>

            <Text style={styles.endpointText}>
              100
            </Text>
          </View>

          <Text style={styles.sliderLabel}>
            Maximum age
          </Text>

          <Slider
            style={styles.slider}
            minimumValue={18}
            maximumValue={100}
            step={1}
            value={maxAge}
            minimumTrackTintColor="#111111"
            maximumTrackTintColor="#dddddd"
            thumbTintColor="#111111"
            onValueChange={(value) => {
              selectMaxAge(value);
            }}
          />

          <View style={styles.sliderEndpoints}>
            <Text style={styles.endpointText}>
              18
            </Text>

            <Text style={styles.endpointText}>
              100
            </Text>
          </View>

        </View>

        {/* ---------------------------------------- */}
        {/* DISTANCE */}
        {/* ---------------------------------------- */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Maximum Distance
          </Text>

          <View style={styles.optionsContainer}>

            {distanceOptions.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.option,
                  maxDistance === option &&
                    styles.selectedOption,
                ]}
                onPress={() => {
                  selectDistance(option);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    maxDistance === option &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option} miles
                </Text>
              </Pressable>
            ))}

          </View>

        </View>

        {/* ---------------------------------------- */}
        {/* INTERESTS */}
        {/* ---------------------------------------- */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Interests
          </Text>

          <Text style={styles.helperText}>
            Select all that apply.
          </Text>

          <View style={styles.interests}>

            {interestOptions.map((interest) => (
              <Pressable
                key={interest}
                style={[
                  styles.interest,
                  interests.includes(interest) &&
                    styles.selectedInterest,
                ]}
                onPress={() => {
                  toggleInterest(interest);
                }}
              >
                <Text
                  style={[
                    styles.interestText,
                    interests.includes(interest) &&
                      styles.selectedInterestText,
                  ]}
                >
                  {interest}
                </Text>
              </Pressable>
            ))}

          </View>

        </View>

        {/* ---------------------------------------- */}
        {/* LIFESTYLE */}
        {/* ---------------------------------------- */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Lifestyle
          </Text>

          <Text style={styles.label}>
            Drinking
          </Text>

          <View style={styles.optionsContainer}>

            {drinkingOptions.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.option,
                  drinking === option &&
                    styles.selectedOption,
                ]}
                onPress={() => {
                  selectDrinking(option);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    drinking === option &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}

          </View>

          <Text style={styles.label}>
            Smoking
          </Text>

          <View style={styles.optionsContainer}>

            {smokingOptions.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.option,
                  smoking === option &&
                    styles.selectedOption,
                ]}
                onPress={() => {
                  selectSmoking(option);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    smoking === option &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}

          </View>

          <Text style={styles.label}>
            Pets
          </Text>

          <View style={styles.optionsContainer}>

            {petsOptions.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.option,
                  pets === option &&
                    styles.selectedOption,
                ]}
                onPress={() => {
                  selectPets(option);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    pets === option &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}

          </View>

        </View>

        {/* ---------------------------------------- */}
        {/* SETTINGS */}
        {/* ---------------------------------------- */}

        <View style={styles.settingsSection}>

          <Text style={styles.settingsTitle}>
            Settings
          </Text>

          <Pressable
            style={styles.settingsButton}
            onPress={onOpenDeveloperMode}
          >
            <Text style={styles.settingsButtonText}>
              Developer Mode
            </Text>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>

        </View>

        {showSaveButton && (
          <View style={styles.bottomSpacer} />
        )}

      </ScrollView>

      {/* ---------------------------------------- */}
      {/* SAVE BUTTON */}
      {/* ---------------------------------------- */}

      {showSaveButton && (
        <View style={styles.saveContainer}>

          <Pressable
            style={styles.saveButton}
            onPress={saveTextFields}
          >
            <Text style={styles.saveText}>
              Save Profile
            </Text>
          </Pressable>

        </View>
      )}

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 50,
  },

  contentWithSaveButton: {
    paddingBottom: 130,
  },

  header: {
    alignItems: 'center',
    marginBottom: 35,
  },

  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  profilePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },

  photoText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '600',
  },

  namePreview: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
  },

  locationPreview: {
    fontSize: 15,
    color: '#777777',
    marginTop: 5,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111111',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111111',
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },

  multilineInput: {
    height: 110,
    paddingTop: 14,
    textAlignVertical: 'top',
  },

  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  option: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#dddddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },

  selectedOption: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },

  optionText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },

  selectedOptionText: {
    color: '#ffffff',
    fontWeight: '700',
  },

  ageRangeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  ageRangeValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
  },

  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 2,
  },

  slider: {
    width: '100%',
    height: 40,
  },

  sliderEndpoints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -5,
    marginBottom: 10,
  },

  endpointText: {
    fontSize: 12,
    color: '#888888',
  },

  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },

  interest: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  selectedInterest: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },

  interestText: {
    fontSize: 14,
    color: '#333333',
  },

  selectedInterestText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  helperText: {
    fontSize: 12,
    color: '#888888',
  },

  settingsSection: {
    marginTop: 10,
    marginBottom: 20,
  },

  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 10,
  },

  settingsButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  settingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },

  arrow: {
    fontSize: 28,
    color: '#777777',
    marginTop: -2,
  },

  bottomSpacer: {
    height: 100,
  },

  saveContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },

  saveButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  photoHelperText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 12,
  },

  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  photoSlot: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
    position: 'relative',
  },

  photoImage: {
    width: '100%',
    height: '100%',
  },

  emptyPhoto: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 12,
    borderStyle: 'dashed',
  },

  plusText: {
    fontSize: 30,
    lineHeight: 32,
    color: '#777777',
    fontWeight: '300',
  },

  addPhotoText: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
  },

  mainPhotoLabel: {
    position: 'absolute',
    left: 7,
    bottom: 7,
    backgroundColor: '#111111',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },

  mainPhotoLabelText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});