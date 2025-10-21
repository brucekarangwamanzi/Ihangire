// A simple, mock authentication service using localStorage.
// In a real application, this would be replaced with API calls to a secure backend.

import type { User } from '../types';

const USERS_KEY = 'ihangire_users';
const SESSION_KEY = 'ihangire_session';

// Helper to get all stored users
const getStoredUsers = (): Record<string, string> => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch {
    return {};
  }
};

// Sign up a new user
export const signUp = (email: string, password: string): { success: boolean; message: string; user: User | null } => {
  if (!email || !password) {
    return { success: false, message: 'Email and password are required.', user: null };
  }
  
  const users = getStoredUsers();

  if (users[email]) {
    return { success: false, message: 'An account with this email already exists.', user: null };
  }

  // In a real app, hash the password before storing.
  users[email] = password;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const newUser = { email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));

  return { success: true, message: 'Account created successfully!', user: newUser };
};

// Log in an existing user
export const login = (email: string, password: string): { success: boolean; message: string; user: User | null } => {
  const users = getStoredUsers();
  
  if (!users[email]) {
    return { success: false, message: 'No account found with this email.', user: null };
  }

  // In a real app, compare hashed passwords.
  if (users[email] !== password) {
    return { success: false, message: 'Incorrect password.', user: null };
  }

  const user = { email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

  return { success: true, message: 'Logged in successfully!', user };
};

// --- Mock Social Logins ---
const socialSignIn = (email: string): { success: boolean; user: User } => {
    const user = { email };
    // In a real app, you might receive a token and user info from the provider.
    // Here we just create the session directly.
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return { success: true, user };
};

export const signInWithGoogle = (): { success: boolean; user: User } => {
    // This is a mock. A real implementation would involve a popup/redirect to Google's OAuth flow.
    return socialSignIn('user@google.com');
};

export const signInWithGitHub = (): { success: boolean; user: User } => {
    // This is a mock. A real implementation would involve a popup/redirect to GitHub's OAuth flow.
    return socialSignIn('user@github.com');
};
// -------------------------

// Log out the current user
export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

// Get the currently logged-in user from the session
export const getCurrentUser = (): User | null => {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};