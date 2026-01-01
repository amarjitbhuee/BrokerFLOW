
export type UserRole = 'AGENT' | 'TEAM_LEADER' | 'BROKER' | 'ADMIN' | 'READ_ONLY';
export type ListingStatus = 'ACTIVE' | 'PENDING' | 'ARCHIVED';
export type ListingType = 'SALE' | 'LEASE';
export type DealStatus = 'OPEN' | 'CLOSED' | 'CANCELLED';
export type DealType = 'BUYER' | 'SELLER';

export type ExpenseCategory = 'Marketing' | 'Staging' | 'Photography' | 'Software' | 'Lead Gen' | 'Travel' | 'Other';

export interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
}

export interface Contingency {
  id: string;
  name: string;
  due_date: string;
  status: 'PENDING' | 'MET' | 'WAIVED';
}

export interface Profile {
  id: string;
  org_id: string;
  team_id: string | null;
  full_name: string;
  role: UserRole;
}

export interface Listing {
  id: string;
  agent_id: string;
  address: string;
  property_type: string;
  status: ListingStatus;
  listing_type: ListingType;
  price?: number;
  listing_date?: string;
  expiration_date?: string;
  seller_name?: string;
  seller_contact?: string;
  image_url?: string;
  created_at: string;
}

export interface Escrow {
  id: string;
  agent_id: string;
  listing_id?: string;
  address: string;
  deal_type: DealType;
  status: DealStatus;
  close_date?: string;
  created_at: string;
  
  // New Contract Tracking Fields
  escrow_officer?: ContactInfo;
  buyer_info?: ContactInfo;
  seller_info?: ContactInfo;
  representing: 'BUYER' | 'SELLER' | 'BOTH';
  deposit_amount?: number;
  deposit_received: boolean;
  contingencies: Contingency[];
}

export interface Commission {
  id: string;
  escrow_id: string;
  gross_commission: number;
  broker_split: number;
  team_split: number;
  admin_fees: number;
  net_commission: number;
  is_confirmed: boolean;
  stub_url?: string;
}

export interface Expense {
  id: string;
  escrow_id?: string; // Optional if it's a general business expense
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

export interface Budget {
  year: number;
  incomeTarget: number;
  expenseCap: number;
}

export interface DashboardStats {
  ytdGross: number;
  ytdNet: number;
  dealsClosed: number;
  totalExpenses: number;
}
