export interface StoredUserProfile {
  id: string;
  name: string;
  email?: string;
  password: string; // User's self-chosen password to protect their profile
  goal: string;
  dream: string;
  language: 'hinglish' | 'hindi' | 'simple-english';
  purpose: string[];
  createdAt: string;
  isPro?: boolean;
  proDuration?: string;
  proExpiresAtFormatted?: string;
}

const USERS_STORAGE_KEY = 'sg_registered_users_vault';
const CURRENT_USER_KEY = 'sg_active_user_session';

const DEFAULT_USERS: StoredUserProfile[] = [
  {
    id: 'USR-8901',
    name: 'Rohan Sharma',
    email: 'rohan.dev@gmail.com',
    password: 'rohan@2026',
    goal: 'Software Engineer / Web Developer बनना है (Job Ready)',
    dream: 'Google / Microsoft में SDE Role',
    language: 'hinglish',
    purpose: ['YouTube Video Courses', 'Flow AI Video Studio', 'Web Dev Studio'],
    createdAt: '2026-11-01T10:30:00.000Z',
    isPro: true,
    proDuration: '1 Year (365 Days)',
    proExpiresAtFormatted: '04 Nov 2027',
  },
  {
    id: 'USR-8902',
    name: 'Priya Verma',
    email: 'priya.v@outlook.com',
    password: 'priya#secure',
    goal: 'Python & AI Engineer (Machine Learning)',
    dream: 'AI Startup Co-Founder & Tech Lead',
    language: 'hinglish',
    purpose: ['ProofLoop™ Mastery', 'Grok AI Studio', 'Code Lab & Interactive IDE'],
    createdAt: '2026-11-03T14:15:00.000Z',
    isPro: false,
  },
  {
    id: 'USR-8903',
    name: 'Aman Gupta',
    email: 'aman.tech@gmail.com',
    password: 'amanPass99',
    goal: 'Full-Stack Developer (MERN / Next.js)',
    dream: 'Remote Developer in US Tech Unicorn',
    language: 'simple-english',
    purpose: ['Web Dev Studio', 'ChatGPT GPTs Ecosystem', 'YouTube Video Courses'],
    createdAt: '2026-11-04T02:00:00.000Z',
    isPro: true,
    proDuration: '1 Month (30 Days)',
    proExpiresAtFormatted: '04 Dec 2026',
  }
];

export function getRegisteredUsers(): StoredUserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_USERS;
  }
}

export function saveRegisteredUsers(users: StoredUserProfile[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event('user-profiles-updated'));
  } catch (e) {
    console.error('Failed to save registered users:', e);
  }
}

export function registerOrUpdateUser(profile: Omit<StoredUserProfile, 'id' | 'createdAt'> & { id?: string }): StoredUserProfile {
  const users = getRegisteredUsers();
  const existingIdx = users.findIndex(u => (profile.id && u.id === profile.id) || u.name.toLowerCase() === profile.name.toLowerCase());
  
  const finalProfile: StoredUserProfile = {
    id: profile.id || (existingIdx >= 0 ? users[existingIdx].id : `USR-${Math.floor(1000 + Math.random() * 9000)}`),
    name: profile.name.trim(),
    email: profile.email?.trim() || `${profile.name.toLowerCase().replace(/\s+/g, '')}@student.org`,
    password: profile.password.trim(),
    goal: profile.goal,
    dream: profile.dream,
    language: profile.language,
    purpose: profile.purpose,
    createdAt: existingIdx >= 0 ? users[existingIdx].createdAt : new Date().toISOString(),
    isPro: profile.isPro ?? (existingIdx >= 0 ? users[existingIdx].isPro : false),
    proDuration: profile.proDuration ?? (existingIdx >= 0 ? users[existingIdx].proDuration : undefined),
    proExpiresAtFormatted: profile.proExpiresAtFormatted ?? (existingIdx >= 0 ? users[existingIdx].proExpiresAtFormatted : undefined),
  };

  let updated: StoredUserProfile[];
  if (existingIdx >= 0) {
    updated = [...users];
    updated[existingIdx] = finalProfile;
  } else {
    updated = [finalProfile, ...users];
  }

  saveRegisteredUsers(updated);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(finalProfile));
  return finalProfile;
}

export function getActiveUserSession(): StoredUserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function switchActiveUser(userId: string): StoredUserProfile | null {
  const users = getRegisteredUsers();
  const target = users.find(u => u.id === userId);
  if (target) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(target));
    localStorage.setItem('sg_user_profile', JSON.stringify({
      name: target.name,
      email: target.email,
      password: target.password,
      language: target.language,
      goal: target.goal,
      dream: target.dream,
      purpose: target.purpose,
      completedAt: target.createdAt,
    }));
    window.dispatchEvent(new Event('user-profiles-updated'));
    return target;
  }
  return null;
}

export function logoutActiveUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem('sg_user_profile');
  window.dispatchEvent(new Event('user-profiles-updated'));
}

export function verifyUserPassword(name: string, passwordAttempt: string): boolean {
  const users = getRegisteredUsers();
  const user = users.find(u => u.name.toLowerCase() === name.trim().toLowerCase());
  if (!user) return false;
  return user.password === passwordAttempt.trim();
}
