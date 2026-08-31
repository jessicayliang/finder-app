export type Profile = {
  id: number;
  name: string;
  age: number;
  distance: number;
  photos: string[];

  bio?: string;
  job?: string;
  school?: string;
  location?: string;

  gender?: string;
  lookingFor?: string;
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;

  interests?: string[];

  drinking?: string;
  smoking?: string;
  pets?: string;
};

// Profiles shown in the swipe deck
export let profiles: Profile[] = [
  {
    id: 1,
    name: 'Jake',
    age: 28,
    distance: 4,
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800',
    ],
  },
  {
    id: 2,
    name: 'Michael',
    age: 31,
    distance: 7,
    photos: [],
  },
  {
    id: 3,
    name: 'Alex',
    age: 26,
    distance: 3,
    photos: [],
  },
  {
    id: 4,
    name: 'Daniel',
    age: 29,
    distance: 6,
    photos: [],
  },
  {
    id: 5,
    name: 'Ryan',
    age: 27,
    distance: 2,
    photos: [],
  },
];

export const addProfile = (profile: Profile) => {
  profiles = [...profiles, profile];
};

export const updateProfile = (
  id: number,
  updates: Partial<Profile>
) => {
  profiles = profiles.map((profile) =>
    profile.id === id
      ? { ...profile, ...updates }
      : profile
  );
};

export const deleteProfile = (id: number) => {
  profiles = profiles.filter(
    (profile) => profile.id !== id
  );
};

// Logged-in user's profile
export type UserProfile = {
  id: number;

  name: string;
  age: number;
  bio: string;

  job: string;
  school: string;
  location: string;

  photos: string[];

  gender: string;
  lookingFor: string;

  ageRange: {
    min: number;
    max: number;
  };

  distance: number;

  interests: string[];

  drinking: string;
  smoking: string;
  pets: string;
};

export let userProfile: Profile = {
  id: 0,
  name: 'Ivy',
  age: 22,
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

export const updateUserProfile = (
  updates: Partial<Profile>
) => {
  userProfile = {
    ...userProfile,
    ...updates,
  };
};
