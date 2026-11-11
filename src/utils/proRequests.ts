export type ProDuration = '1month' | '3month' | '1year' | 'lifetime';

export interface ProAccessRequest {
  id: string;
  userName: string;
  userEmail: string;
  upiOrCard: string;
  paymentMethod: 'upi' | 'card' | 'qr';
  amount: number;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewTime?: string;
  isCurrentUser?: boolean;
  duration?: ProDuration;
  expiresAt?: number;
  expiresAtFormatted?: string;
}

const STORAGE_KEY = 'sg_pro_requests';
const CURRENT_USER_REQ_KEY = 'sg_current_user_request_id';

const INITIAL_REQUESTS: ProAccessRequest[] = [
  {
    id: 'SG-99-4081',
    userName: 'Rohan Sharma',
    userEmail: 'rohan.dev@gmail.com',
    upiOrCard: 'rohan@oksbi',
    paymentMethod: 'upi',
    amount: 99,
    timestamp: 'Just now',
    status: 'pending',
  },
  {
    id: 'SG-99-3892',
    userName: 'Priya Verma',
    userEmail: 'priya.v@outlook.com',
    upiOrCard: 'Scan QR • PhonePe',
    paymentMethod: 'qr',
    amount: 99,
    timestamp: '12 mins ago',
    status: 'pending',
  },
  {
    id: 'SG-99-2910',
    userName: 'Aman Gupta',
    userEmail: 'aman.tech@gmail.com',
    upiOrCard: 'aman@paytm',
    paymentMethod: 'upi',
    amount: 99,
    timestamp: '1 hour ago',
    status: 'approved',
    reviewedBy: 'CEO Control Desk',
    reviewTime: '45 mins ago',
  }
];

export function getProRequests(): ProAccessRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_REQUESTS;
  }
}

export function saveProRequests(requests: ProAccessRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new Event('pro-request-updated'));
  } catch (e) {
    console.error('Failed to save pro requests:', e);
  }
}

export function submitProRequest(data: {
  userName: string;
  userEmail: string;
  upiOrCard: string;
  paymentMethod: 'upi' | 'card' | 'qr';
}): ProAccessRequest {
  const current = getProRequests();
  const id = `SG-99-${Math.floor(1000 + Math.random() * 9000)}`;
  const newReq: ProAccessRequest = {
    id,
    userName: data.userName.trim() || 'Student Learner',
    userEmail: data.userEmail.trim() || 'student@skillgraph.in',
    upiOrCard: data.upiOrCard.trim() || 'UPI / QR',
    paymentMethod: data.paymentMethod,
    amount: 99,
    timestamp: 'Just now',
    status: 'pending',
    isCurrentUser: true,
  };

  const updated = [newReq, ...current];
  saveProRequests(updated);
  localStorage.setItem(CURRENT_USER_REQ_KEY, id);
  return newReq;
}

export function getCurrentUserRequestId(): string | null {
  try {
    return localStorage.getItem(CURRENT_USER_REQ_KEY);
  } catch (e) {
    return null;
  }
}

export function getCurrentUserRequest(): ProAccessRequest | null {
  const id = getCurrentUserRequestId();
  if (!id) return null;
  const requests = getProRequests();
  return requests.find(r => r.id === id) || null;
}

export function calculateExpiry(duration: ProDuration = '1month'): {
  duration: ProDuration;
  expiresAt: number;
  expiresAtFormatted: string;
} {
  const now = Date.now();
  let durationMs = 30 * 24 * 60 * 60 * 1000; // 30 days
  if (duration === '1month') {
    durationMs = 30 * 24 * 60 * 60 * 1000;
  } else if (duration === '3month') {
    durationMs = 90 * 24 * 60 * 60 * 1000;
  } else if (duration === '1year') {
    durationMs = 365 * 24 * 60 * 60 * 1000;
  } else if (duration === 'lifetime') {
    durationMs = 100 * 365 * 24 * 60 * 60 * 1000;
  }

  const expiresAt = now + durationMs;
  const date = new Date(expiresAt);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  const expiresAtFormatted = duration === 'lifetime' ? 'Lifetime Permanent' : date.toLocaleDateString('en-IN', options);

  return { duration, expiresAt, expiresAtFormatted };
}

export function getProDurationLabel(duration?: ProDuration): string {
  if (duration === '1month') return '1 Month (30 Days)';
  if (duration === '3month') return '3 Months (90 Days)';
  if (duration === '1year') return '1 Year (365 Days)';
  if (duration === 'lifetime') return 'Lifetime Pass';
  return '1 Month (30 Days)';
}

export function approveProRequest(id: string, duration: ProDuration = '1month'): {
  duration: ProDuration;
  expiresAt: number;
  expiresAtFormatted: string;
} {
  const expiry = calculateExpiry(duration);
  const requests = getProRequests();
  const updated = requests.map(req => {
    if (req.id === id) {
      return {
        ...req,
        status: 'approved' as const,
        reviewedBy: 'CEO Control Desk',
        reviewTime: 'Just now',
        duration: expiry.duration,
        expiresAt: expiry.expiresAt,
        expiresAtFormatted: expiry.expiresAtFormatted,
      };
    }
    return req;
  });
  saveProRequests(updated);
  return expiry;
}

export function rejectProRequest(id: string): void {
  const requests = getProRequests();
  const updated = requests.map(req => {
    if (req.id === id) {
      return {
        ...req,
        status: 'rejected' as const,
        reviewedBy: 'CEO Control Desk',
        reviewTime: 'Just now',
      };
    }
    return req;
  });
  saveProRequests(updated);
}

export function approveAllPendingRequests(duration: ProDuration = '1month'): {
  duration: ProDuration;
  expiresAt: number;
  expiresAtFormatted: string;
} {
  const expiry = calculateExpiry(duration);
  const requests = getProRequests();
  const updated = requests.map(req => {
    if (req.status === 'pending') {
      return {
        ...req,
        status: 'approved' as const,
        reviewedBy: 'CEO Control Desk',
        reviewTime: 'Just now',
        duration: expiry.duration,
        expiresAt: expiry.expiresAt,
        expiresAtFormatted: expiry.expiresAtFormatted,
      };
    }
    return req;
  });
  saveProRequests(updated);
  return expiry;
}

export function isProAccessGranted(): boolean {
  // Check if current user's request is approved, or if master CEO has granted
  const currentReq = getCurrentUserRequest();
  if (currentReq && currentReq.status === 'approved') {
    if (currentReq.expiresAt && currentReq.expiresAt < Date.now()) {
      return false; // Access expired
    }
    return true;
  }
  // If no request was submitted yet by this user, it's not granted
  return false;
}
