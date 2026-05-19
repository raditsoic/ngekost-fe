const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export async function getValidAccessToken(): Promise<string | null> {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now() + 60_000) {
      const refreshed = await tryRefresh();
      return refreshed ? getAccessToken() : null;
    }
  } catch {
    // Not a JWT or can't decode — use as-is
  }

  return token;
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || body.detail || res.statusText);
  }

  return res.json();
}

async function authRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAccessToken()}`;
      res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || body.detail || res.statusText);
  }

  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const data = await request<TokenResponse>('/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refresh }),
    });
    setTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface User {
  id: string;
  email: string;
  display_name: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  provider: string;
  model: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  sequence_no: number;
  external_message_id: string;
  token_input: number;
  token_output: number;
}

export interface ConversationListResponse {
  data: Conversation[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface MessageListResponse {
  data: ChatMessage[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface ImageURL {
  url: string;
  mime_type: string;
}

export interface Property {
  id: string;
  title: string;
  gender: 'male' | 'female' | 'mixed';
  rating: number | null;
  availability: number | null;
  facilities: string[];
  description: string | null;
  rules: string[];
  building_images: ImageURL[];
  room_images: ImageURL[];
  bathroom_images: ImageURL[];
  shared_facility_images: ImageURL[];
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  monthly_rent_idr: number | null;
  type: string | null;
  our_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  per_page: number;
}

export const api = {
  login(email: string, password: string) {
    return request<TokenResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register(email: string, password: string, display_name: string) {
    return request<TokenResponse>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name }),
    });
  },

  logout() {
    const refresh = getRefreshToken();
    clearTokens();
    if (refresh) {
      return request<{ message: string }>('/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refresh }),
      }).catch(() => undefined);
    }
    return Promise.resolve(undefined);
  },

  getMe() {
    return authRequest<User>('/v1/auth/me');
  },

  listConversations(params?: { limit?: number; cursor?: string }) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.cursor) query.set('cursor', params.cursor);
    const qs = query.toString();
    return authRequest<ConversationListResponse | Conversation[]>(`/v1/chat/${qs ? `?${qs}` : ''}`);
  },

  getConversation(id: string) {
    return authRequest<Conversation>(`/v1/chat/${id}`);
  },

  listMessages(conversationId: string, params?: { limit?: number; cursor?: string }) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.cursor) query.set('cursor', params.cursor);
    const qs = query.toString();
    return authRequest<MessageListResponse>(`/v1/chat/${conversationId}/messages${qs ? `?${qs}` : ''}`);
  },

  listProperties(params?: { page?: number; per_page?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.per_page) query.set('per_page', String(params.per_page));
    const qs = query.toString();
    return request<PropertyListResponse>(`/v1/properties/${qs ? `?${qs}` : ''}`);
  },

  getProperty(id: string) {
    return request<Property>(`/v1/properties/${id}`);
  },
};
