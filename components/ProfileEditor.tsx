import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image } from 'react-native';
import {
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

import {
  Profile,
  updateProfile,
  saveUserProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
} from '../data/profiles';

type ProfileEditorProps = {
  profileId: number | null;
  profiles: Profile[];
  userProfile: Profile | null;
  isUserProfile?: boolean;
  onProfilesChange: (profiles: Profile[]) => void;
  onUserProfileChange: (profile: Profile | null) => void;
  onBack: () => void;
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

export default function ProfileEditor({
  profileId,
  profiles,
  userProfile,
  isUserProfile = false,
  onProfilesChange,
  onUserProfileChange,
  onBack,
}: ProfileEditorProps) {

  const editingProfile = isUserProfile
    ? userProfile
    : profileId !== null
      ? profiles.find(
          (profile) => profile.id === profileId
        )
      : undefined;

  const isNewProfile =
    !isUserProfile && profileId === null;

  const initialProfile: Profile = editingProfile ?? {
    id: -1,
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
  };

  const [name, setName] = useState(initialProfile.name);
  const [age, setAge] = useState(String(initialProfile.age));
  const [bio, setBio] = useState(initialProfile.bio ?? '');
  const [job, setJob] = useState(initialProfile.job ?? '');
  const [school, setSchool] = useState(initialProfile.school ?? '');
  const [location, setLocation] = useState(
    initialProfile.location ?? ''
  );

  const [gender, setGender] = useState(
    initialProfile.gender ?? ''
  );

  const [lookingFor, setLookingFor] = useState(
    initialProfile.lookingFor ?? ''
  );

  const [minAge, setMinAge] = useState(
    Math.max(18, Math.min(100, initialProfile.minAge ?? 18))
  );

  const [maxAge, setMaxAge] = useState(
    Math.max(18, Math.min(100, initialProfile.maxAge ?? 35))
  );

  const [maxDistance, setMaxDistance] = useState(
    initialProfile.maxDistance ?? 25
  );

  const [interests, setInterests] = useState(
    initialProfile.interests ?? []
  );

  const [drinking, setDrinking] = useState(
    initialProfile.drinking ?? ''
  );

  const [smoking, setSmoking] = useState(
    initialProfile.smoking ?? ''
  );

  const [pets, setPets] = useState(
    initialProfile.pets ?? ''
  );

  const [photos, setPhotos] = useState<string[]>(
    initialProfile.photos ?? []
  );



  console.log(
    '🔥 PROFILE EDITOR IS OPEN',
    isUserProfile,
    profileId,
    initialProfile.photos,
    photos
  );

  const [showSaveButton, setShowSaveButton] =
    useState(false);

  const saveUpdatesImmediately = async (
    updates: Partial<Profile>
  ) => {
    try {
      if (isUserProfile) {
        const updatedProfile = await saveUserProfile(updates);

        onUserProfileChange(updatedProfile);
        return;
      }

      if (profileId !== null) {
        const updatedProfile = await updateProfile(
          profileId,
          updates
        );

        onProfilesChange(
          profiles.map((profile) =>
            profile.id === profileId
              ? updatedProfile
              : profile
          )
        );
      }
    } catch (error) {
      console.error(
        'FAILED TO SAVE PROFILE UPDATE:',
        error
      );
    }
  };

  const saveTextFields = async () => {
    const updates: Partial<Profile> = {
      name,
      age: Number(age) || 18,
      bio,
      job,
      school,
      location,
    };

    if (isUserProfile) {
      const updatedProfile =
        await saveUserProfile(updates);

      onUserProfileChange(updatedProfile);
    } else if (profileId !== null) {
      const updatedProfile =
        await updateProfile(
          profileId,
          updates
        );

      onProfilesChange(
        profiles.map((profile) =>
          profile.id === profileId
            ? updatedProfile
            : profile
        )
      );
    } else {
      const newProfile: Profile = {
        id:
          profiles.length > 0
            ? Math.max(
                ...profiles.map(
                  (profile) => profile.id
                )
              ) + 1
            : 1,

        name,
        age: Number(age) || 18,
        distance: 0,
        photos: [],

        bio,
        job,
        school,
        location,

        gender,
        lookingFor,

        minAge,
        maxAge,
        maxDistance,

        interests,

        drinking,
        smoking,
        pets,
      };

      profiles.push(newProfile);
    }

    setShowSaveButton(false);
  };

  const selectGender = (value: string) => {
    setGender(value);

    if (!isNewProfile) {
      saveUpdatesImmediately({
        gender: value,
      });
    }
  };

  const selectLookingFor = (value: string) => {
    setLookingFor(value);

    if (!isNewProfile) {
      saveUpdatesImmediately({
        lookingFor: value,
      });
    }
  };

  const selectDistance = (value: number) => {
    setMaxDistance(value);

    if (!isNewProfile) {
      saveUpdatesImmediately({
        maxDistance: value,
      });
    }
  };

  const selectDrinking = (value: string) => {
    setDrinking(value);

    if (!isNewProfile) {
      saveUpdatesImmediately({
        drinking: value,
      });
    }
  };

  const selectSmoking = (value: string) => {
    setSmoking(value);

    if (!isNewProfile) {
      saveUpdatesImmediately({
        smoking: value,
      });
    }
  };

  const selectPets = (value: string) => {
    setPets(value);

    if (!isNewProfile) {
      saveUpdatesImmediately({
        pets: value,
      });
    }
  };

  const toggleInterest = (interest: string) => {
    const newInterests = interests.includes(interest)
      ? interests.filter(
          (item) => item !== interest
        )
      : [...interests, interest];

    setInterests(newInterests);

    if (!isNewProfile) {
      saveUpdatesImmediately({
        interests: newInterests,
      });
    }
  };

    // ----------------------------------------
    // PHOTO FUNCTIONS
    // ----------------------------------------

    const savePhotos = async (
      newPhotos: string[]
    ) => {
      try {
        console.log('📸 SAVING PHOTOS:', newPhotos);

        if (isUserProfile) {
          const updatedProfile =
            await saveUserProfile({
              photos: newPhotos,
            });

          setPhotos(updatedProfile.photos);
          onUserProfileChange(updatedProfile);

          console.log(
            '📸 USER PHOTOS SAVED:',
            updatedProfile.photos
          );

          return;
        }

        if (profileId !== null) {
          const updatedProfile =
            await updateProfile(profileId, {
              photos: newPhotos,
            });

          setPhotos(updatedProfile.photos);

          onProfilesChange(
            profiles.map((profile) =>
              profile.id === profileId
                ? updatedProfile
                : profile
            )
          );

          console.log(
            '📸 DEVELOPER PHOTOS SAVED:',
            updatedProfile.photos
          );
        }
      } catch (error) {
        console.error(
          'FAILED TO SAVE PHOTOS:',
          error
        );

        throw error;
      }
    };

    const chooseFromCameraRoll = async () => {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Needed',
          'Please allow access to your photo library to choose a photo.'
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
        return result.assets[0].uri;
      }

      return null;
    };

    const takePhotoNow = async () => {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Needed',
          'Please allow camera access to take a photo.'
        );
        return null;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.9,
        });

      if (!result.canceled) {
        return result.assets[0].uri;
      }

      return null;
    };

    const addPhoto = async (index: number) => {
      Alert.alert(
        'Add Photo',
        'Choose how you want to add your photo.',
        [
          {
            text: 'Camera Roll',
            onPress: async () => {
              const uri = await chooseFromCameraRoll();

              if (!uri) {
                return;
              }

              try {
                console.log('📸 LOCAL URI:', uri);

                const currentProfileId = isUserProfile
                  ? userProfile?.id ?? 0
                  : profileId ?? 0;

                console.log(
                  '📸 UPLOADING FOR PROFILE:',
                  currentProfileId
                );

                const photoUrl =
                  await uploadProfilePhoto(
                    uri,
                    currentProfileId
                  );

                console.log(
                  '📸 SUPABASE PHOTO URL:',
                  photoUrl
                );

                const newPhotos = [...photos];

                newPhotos[index] = photoUrl;

                await savePhotos(
                  newPhotos.filter(
                    (photo) => photo !== ''
                  )
                );
              } catch (error) {
                console.error(
                  'FAILED TO SAVE PHOTO:',
                  error
                );

                Alert.alert(
                  'Error',
                  'Could not upload your photo.'
                );
              }
            },
          },

          {
            text: 'Take Photo Now',
            onPress: async () => {
              const uri = await takePhotoNow();

              if (!uri) {
                return;
              }

              try {
                console.log('📸 LOCAL CAMERA URI:', uri);

                const currentProfileId = isUserProfile
                  ? userProfile?.id ?? 0
                  : profileId ?? 0;

                console.log(
                  '📸 UPLOADING CAMERA PHOTO FOR PROFILE:',
                  currentProfileId
                );

                const photoUrl =
                  await uploadProfilePhoto(
                    uri,
                    currentProfileId
                  );

                console.log(
                  '📸 SUPABASE CAMERA PHOTO URL:',
                  photoUrl
                );

                const newPhotos = [...photos];

                newPhotos[index] = photoUrl;

                await savePhotos(
                  newPhotos.filter(
                    (photo) => photo !== ''
                  )
                );
              } catch (error) {
                console.error(
                  'FAILED TO SAVE PHOTO:',
                  error
                );

                Alert.alert(
                  'Error',
                  'Could not upload your photo.'
                );
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

    const removePhoto = (index: number) => {
      Alert.alert(
        'Remove Photo',
        'Remove this photo from your profile?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text: 'Remove',
            style: 'destructive',

            onPress: async () => {
              const photoToRemove = photos[index];

              if (!photoToRemove) {
                return;
              }

              try {
                await deleteProfilePhoto(
                  photoToRemove
                );

                const newPhotos = photos.filter(
                  (_, photoIndex) =>
                    photoIndex !== index
                );

                await savePhotos(newPhotos);
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
            },
          },
        ]
      );
    };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >

      <View style={styles.topBar}>

        <Pressable
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹
          </Text>

          <Text style={styles.backLabel}>
            Back
          </Text>
        </Pressable>

        <Text style={styles.title}>
          {isNewProfile
            ? 'Add Profile'
            : 'Edit Profile'}
        </Text>

        <View style={styles.topBarSpacer} />

      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          showSaveButton &&
            styles.contentWithSaveButton,
        ]}
        keyboardShouldPersistTaps="handled"
      >

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

                        const photo = photos[index];

                        return (
                          <Pressable
                            key={index}
                            style={styles.photoSlot}
                            onPress={() => {
                              if (photo) {
                                Alert.alert(
                                  'Photo',
                                  'What would you like to do?',
                                  [
                                    {
                                      text: 'Replace',
                                      onPress: () => {
                                        addPhoto(index);
                                      },
                                    },
                                    {
                                      text: 'Remove',
                                      style: 'destructive',
                                      onPress: () => {
                                        removePhoto(index);
                                      },
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
                              <View style={styles.emptyPhoto}>
                                <Text
                                  style={
                                    styles.plusText
                                  }
                                >
                                  +
                                </Text>

                                <Text
                                  style={
                                    styles.addPhotoText
                                  }
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

        {/* BASIC INFORMATION */}

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

        {/* ABOUT */}

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

        {/* WORK */}

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

        {/* SCHOOL */}

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

        {/* LOCATION */}

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

        {/* GENDER */}

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

        {/* LOOKING FOR */}

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

        {/* AGE RANGE */}

        <View style={styles.section}>

          <View style={styles.ageRangeHeader}>

            <Text style={styles.sectionTitle}>
              Age Range
            </Text>

            <Text style={styles.ageRangeValue}>
              {minAge} – {maxAge}
            </Text>

          </View>

          <View style={styles.sliderContainer}>

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
                const newValue = Math.round(value);

                if (newValue <= maxAge) {
                  setMinAge(newValue);

                  if (!isNewProfile) {
                    saveUpdatesImmediately({
                      minAge: newValue,
                    });
                  }
                }
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
                const newValue = Math.round(value);

                if (newValue >= minAge) {
                  setMaxAge(newValue);

                  if (!isNewProfile) {
                    saveUpdatesImmediately({
                      maxAge: newValue,
                    });
                  }
                }
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

        </View>

        {/* DISTANCE */}

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

        {/* INTERESTS */}

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

        {/* LIFESTYLE */}

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

        {showSaveButton && (
          <View style={styles.bottomSpacer} />
        )}

      </ScrollView>

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
    paddingBottom: 50,
  },

  contentWithSaveButton: {
    paddingBottom: 130,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
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

  sliderContainer: {
    marginTop: 2,
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
