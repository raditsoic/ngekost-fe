const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

// Tokens may live in either localStorage (persistent, "remember me") or
// sessionStorage (cleared when the browser tab closes). Check both on read.
export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) ?? sessionStorage.getItem(REFRESH_KEY);
}

function isPersistent() {
  return localStorage.getItem(REFRESH_KEY) !== null;
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

export function setTokens(access: string, refresh: string, persistent = true) {
  const store = persistent ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, access);
  store.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
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
  const isMultipart = options.body instanceof FormData;
  const passedHeaders = options.headers as Record<string, string> | undefined;
  const headers: Record<string, string> = {
    ...(isMultipart ? {} : { 'Content-Type': 'application/json' }),
    ...passedHeaders,
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
    setTokens(data.access_token, data.refresh_token, isPersistent());
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
  onboarding_completed: boolean;
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

export interface BudgetPlanCard {
  plan_id: string;
  label: string;
  total_monthly_cost_idr?: number;
  net_monthly_savings_idr?: number;
  rent_to_income_ratio?: number;
  status: 'draft' | 'active' | 'archived';
}

export type BudgetCategorySource = 'ai_generated' | 'poi_average' | 'user_override' | 'invoice_derived';

export type BudgetCategoryKey = 'rent' | 'food' | 'transportation' | 'utilities' | 'laundry' | 'internet';

export interface BudgetCategoryItem {
  category: BudgetCategoryKey;
  monthly_amount_idr: number;
  daily_amount_idr: number;
  source: BudgetCategorySource;
}

export interface BudgetPlanDetail {
  id: string;
  property_id: string;
  property_title: string;
  property_address: string;
  label: string;
  total_monthly_cost_idr: number;
  total_daily_allowance_idr: number;
  rent_to_income_ratio: number;
  net_monthly_savings_idr: number;
  status: 'draft' | 'active' | 'archived';
  categories: BudgetCategoryItem[];
  created_at: string;
}

export interface BudgetPlanListItem {
  id: string;
  label: string;
  property_title: string;
  property_address: string;
  total_monthly_cost_idr: number;
  rent_to_income_ratio: number;
  net_monthly_savings_idr: number;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
}

export interface BudgetPlanListResponse {
  data: BudgetPlanListItem[];
}

export interface Route {
  travel_mode: 'DRIVE' | 'TWO_WHEELER' | 'TRANSIT' | 'WALK';
  distance_km: number;
  duration_min?: number | null;
  duration_no_traffic_min?: number | null;
  origin: { label?: string | null; latitude: number; longitude: number };
  destination: { label?: string | null; latitude: number; longitude: number };
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
  tool_name?: string | null;
  tool_params?: unknown;
  tool_result?: unknown;
  message_type?: 'location_pin' | 'budget_plan' | 'route' | null;
  metadata?: {
    pins?: Array<{
      id: string;
      title: string;
      address: string;
      latitude: number;
      longitude: number;
    }>;
    card?: BudgetPlanCard;
    routes?: Route[];
    images?: string[];
  } | null;
  images?: ImageURL[];
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

export type VehicleType = 'none' | 'motorcycle' | 'car' | 'both' | 'bicycle' | 'walking' | 'public_transport';

export interface UpsertFinancialsRequest {
  monthly_income_idr: number;
  monthly_expenses_idr?: number;
  vehicle_type: VehicleType;
}

export interface FinancialsResponse {
  monthly_income_idr: number;
  vehicle_type: VehicleType;
  created_at: string;
  updated_at: string;
}

export interface ActiveLeaseProperty {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
}

export interface ActiveLeaseRentDetails {
  amount: number;
  period: string;
  nextDueDate: string;
}

export interface ActiveLease {
  id: string;
  property: ActiveLeaseProperty;
  rentDetails: ActiveLeaseRentDetails;
}

export interface MonthlyAggregation {
  month: string;
  expected: number;
  actual: number;
}

export interface FinancialOverviewResponse {
  income: number;
  activeLease: ActiveLease | null;
  monthlyAggregation: MonthlyAggregation[];
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: 'Konsumsi' | 'Utilitas' | 'Lainnya' | 'Transportasi' | 'Sewa';
  date: string;
  receiptUrl: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: Pagination;
}

export interface UploadResponse {
  file_id: string;
  file_type: string;
  size: number;
}

export interface CreateTransactionRequest {
  amount: number;
  category: string;
  date: string;
  title?: string;
}

export interface UpdateIncomeRequest {
  income: number;
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

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return authRequest<UploadResponse>('/v1/upload/image', {
      method: 'POST',
      body: formData,
    });
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

  upsertFinancials(data: UpsertFinancialsRequest) {
    return authRequest<FinancialsResponse>('/v1/users/me/financials', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getFinancials() {
    return authRequest<FinancialsResponse>('/v1/users/me/financials');
  },

  getFinancialOverview(params?: { period?: 'daily' | 'weekly' | 'monthly' }) {
    const query = new URLSearchParams();
    if (params?.period) query.set('period', params.period);
    const qs = query.toString();
    return authRequest<{ status: string; data: FinancialOverviewResponse }>(`/v1/users/me/financials/overview${qs ? `?${qs}` : ''}`);
  },

  listTransactions(params?: { limit?: number; month?: string }) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.month) query.set('month', params.month);
    const qs = query.toString();
    return authRequest<{ status: string; data: TransactionsResponse }>(`/v1/users/me/financials/transactions${qs ? `?${qs}` : ''}`);
  },

  createTransaction(data: CreateTransactionRequest) {
    return authRequest<{ status: string; message: string; data: Transaction }>('/v1/users/me/financials/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateIncome(data: UpdateIncomeRequest) {
    return authRequest<{ status: string; message: string; data: { income: number } }>('/v1/users/me/financials/income', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  listBudgetPlans(params?: { page?: number; per_page?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.per_page) query.set('per_page', String(params.per_page));
    const qs = query.toString();
    return authRequest<BudgetPlanListResponse>(`/v1/users/me/budget-plans/${qs ? `?${qs}` : ''}`);
  },

  getBudgetPlan(id: string) {
    return authRequest<BudgetPlanDetail | { status: string; data: BudgetPlanDetail }>(`/v1/users/me/budget-plans/${id}`)
      .then(res => {
        if ('data' in res && res.data && typeof res.data === 'object') return res.data;
        return res as BudgetPlanDetail;
      });
  },

  deleteBudgetPlan(id: string) {
    return authRequest<void>(`/v1/users/me/budget-plans/${id}`, { method: 'DELETE' });
  },

  updateBudgetPlanCategories(id: string, categories: Array<{ category: BudgetCategoryKey; monthly_amount_idr: number }>) {
    return authRequest<BudgetPlanDetail>(`/v1/users/me/budget-plans/${id}/categories`, {
      method: 'PATCH',
      body: JSON.stringify({ categories }),
    });
  },

  activateBudgetPlan(id: string) {
    return authRequest<BudgetPlanDetail>(`/v1/users/me/budget-plans/${id}/activate`, {
      method: 'POST',
    });
  },

  archiveBudgetPlan(id: string) {
    return authRequest<BudgetPlanDetail>(`/v1/users/me/budget-plans/${id}/archive`, {
      method: 'POST',
    });
  },
};
