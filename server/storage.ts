import { 
  type User, 
  type InsertUser,
  type WalletConnection,
  type InsertWalletConnection,
  type Notification,
  type InsertNotification
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(walletAddress: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Wallet connections
  saveWalletConnection(connection: InsertWalletConnection): Promise<WalletConnection>;
  getUserWalletConnections(userId: string): Promise<WalletConnection[]>;
  
  // Liquidity
  getLiquidity(): Promise<number>;
  updateLiquidity(amount: number): Promise<void>;
  
  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotifications(userId?: string): Promise<Notification[]>;
  markNotificationRead(notificationId: string): Promise<void>;
  
  // Admin functions
  getAllUsers(): Promise<User[]>;
  getTotalUsers(): Promise<number>;
  sendGlobalNotification(title: string, message: string): Promise<void>;
  logAdminAction(action: string, details: string, adminId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private walletConnections: Map<string, WalletConnection>;
  private notifications: Map<string, Notification>;
  private currentLiquidity = 42851404;

  constructor() {
    this.users = new Map();
    this.walletConnections = new Map();
    this.notifications = new Map();
  }

  async getUser(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      joinedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async saveWalletConnection(connectionData: InsertWalletConnection): Promise<WalletConnection> {
    const id = randomUUID();
    const connection: WalletConnection = {
      ...connectionData,
      id,
      connectedAt: new Date()
    };
    this.walletConnections.set(id, connection);
    return connection;
  }

  async getUserWalletConnections(userId: string): Promise<WalletConnection[]> {
    return Array.from(this.walletConnections.values()).filter(conn => conn.userId === userId);
  }

  async getLiquidity(): Promise<number> {
    return this.currentLiquidity;
  }

  async updateLiquidity(amount: number): Promise<void> {
    this.currentLiquidity = amount;
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...notificationData,
      id,
      createdAt: new Date(),
      readAt: null
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotifications(userId?: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notif => notif.isGlobal || notif.targetUserId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.readAt = new Date();
    }
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getTotalUsers(): Promise<number> {
    return this.users.size;
  }

  async sendGlobalNotification(title: string, message: string): Promise<void> {
    await this.createNotification({
      title,
      message,
      type: "info",
      isGlobal: true,
    });
  }

  async logAdminAction(action: string, details: string, adminId: string): Promise<void> {
    console.log(`Admin Action: ${action} by ${adminId} - ${details}`);
  }
}

export const storage = new MemStorage();
