import { supabase } from '../lib/supabase';

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

  isUser?: boolean;
};

export type SupabaseProfile = {
  id: number;

  name: string;
  age: number;
  distance: number;
  photos: string[];

  bio: string | null;
  job: string | null;
  school: string | null;
  location: string | null;

  gender: string | null;
  looking_for: string | null;

  min_age: number;
  max_age: number;
  max_distance: number;

  interests: string[];

  drinking: string | null;
  smoking: string | null;
  pets: string | null;

  is_user: boolean;

  created_at: string;
  updated_at: string;
};

export const supabaseToProfile = (
  profile: SupabaseProfile
): Profile => {
  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    distance: profile.distance ?? 0,
    photos: profile.photos ?? [],

    bio: profile.bio ?? '',
    job: profile.job ?? '',
    school: profile.school ?? '',
    location: profile.location ?? '',

    gender: profile.gender ?? '',
    lookingFor: profile.looking_for ?? '',

    minAge: profile.min_age ?? 18,
    maxAge: profile.max_age ?? 35,
    maxDistance: profile.max_distance ?? 25,

    interests: profile.interests ?? [],

    drinking: profile.drinking ?? '',
    smoking: profile.smoking ?? '',
    pets: profile.pets ?? '',

    isUser: profile.is_user ?? false,
  };
};

export const profileToSupabase = (
  profile: Partial<Profile>
) => {
  const result: Record<string, any> = {};

  if (profile.id !== undefined) {
    result.id = profile.id;
  }

  if (profile.name !== undefined) {
    result.name = profile.name;
  }

  if (profile.age !== undefined) {
    result.age = profile.age;
  }

  if (profile.distance !== undefined) {
    result.distance = profile.distance;
  }

  if (profile.photos !== undefined) {
    result.photos = profile.photos;
  }

  if (profile.bio !== undefined) {
    result.bio = profile.bio;
  }

  if (profile.job !== undefined) {
    result.job = profile.job;
  }

  if (profile.school !== undefined) {
    result.school = profile.school;
  }

  if (profile.location !== undefined) {
    result.location = profile.location;
  }

  if (profile.gender !== undefined) {
    result.gender = profile.gender;
  }

  if (profile.lookingFor !== undefined) {
    result.looking_for = profile.lookingFor;
  }

  if (profile.minAge !== undefined) {
    result.min_age = profile.minAge;
  }

  if (profile.maxAge !== undefined) {
    result.max_age = profile.maxAge;
  }

  if (profile.maxDistance !== undefined) {
    result.max_distance = profile.maxDistance;
  }

  if (profile.interests !== undefined) {
    result.interests = profile.interests;
  }

  if (profile.drinking !== undefined) {
    result.drinking = profile.drinking;
  }

  if (profile.smoking !== undefined) {
    result.smoking = profile.smoking;
  }

  if (profile.pets !== undefined) {
    result.pets = profile.pets;
  }

  if (profile.isUser !== undefined) {
    result.is_user = profile.isUser;
  }

  return result;
};


// ----------------------------------------
// FETCH ALL OTHER PROFILES
// ----------------------------------------

export const fetchProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_user', false)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }

  return (data ?? []).map(supabaseToProfile);
};


// ----------------------------------------
// FETCH ONE PROFILE
// ----------------------------------------

export const fetchProfile = async (
  profileId: number
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  if (!data) {
    return null;
  }

  return supabaseToProfile(data);
};


// ----------------------------------------
// FETCH USER / IVY
// ----------------------------------------

export const fetchUserProfile = async (): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_user', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }

  if (!data) {
    return null;
  }

  return supabaseToProfile(data);
};


// ----------------------------------------
// UPDATE USER PROFILE
// ----------------------------------------

export const saveUserProfile = async (
  updates: Partial<Profile>
): Promise<Profile> => {
  const supabaseUpdates = profileToSupabase(updates);

  const { data, error } = await supabase
    .from('profiles')
    .update(supabaseUpdates)
    .eq('is_user', true)
    .select()
    .single();

  if (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }

  return supabaseToProfile(data);
};


// ----------------------------------------
// UPDATE ANY DEVELOPER PROFILE
// ----------------------------------------

export const updateProfile = async (
  profileId: number,
  updates: Partial<Profile>
): Promise<Profile> => {
  const supabaseUpdates = profileToSupabase(updates);

  console.log('UPDATING PROFILE:', profileId);
  console.log('UPDATES:', updates);
  console.log('SUPABASE UPDATES:', supabaseUpdates);

  const { data, error } = await supabase
    .from('profiles')
    .update(supabaseUpdates)
    .eq('id', profileId)
    .eq('is_user', false)
    .select()
    .single();

  console.log('SUPABASE UPDATE RESULT:', data);
  console.log('SUPABASE UPDATE ERROR:', error);

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return supabaseToProfile(data);
};


// ----------------------------------------
// CREATE DEVELOPER PROFILE
// ----------------------------------------

export const createProfile = async (
  profile: Partial<Profile>
): Promise<Profile> => {
  const supabaseProfile = profileToSupabase({
    ...profile,
    isUser: false,
  });

  const { data, error } = await supabase
    .from('profiles')
    .insert(supabaseProfile)
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }

  return supabaseToProfile(data);
};
