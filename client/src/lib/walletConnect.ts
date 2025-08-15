import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';

const projectId = 'f2bbe5b3cc56c3a3c75a5abfb4792944';

// Buffer polyfill for browser compatibility
const Buffer = globalThis.Buffer || (() => {
  throw new Error('Buffer is not available in this environment');
});

class WalletConnectService {
  private web3wallet: any = null;
  private core: any = null;

  async initialize() {
    if (this.web3wallet) return this.web3wallet;

    try {
      this.core = new Core({
        projectId,
      });

      this.web3wallet = await Web3Wallet.init({
        core: this.core,
        metadata: {
          name: 'BitNest',
          description: 'BitNest - Cryptocurrency Banking Smart Contract on Blockchain',
          url: window.location.origin,
          icons: [`${window.location.origin}/favicon.ico`],
        },
      });

      this.setupEventListeners();
      return this.web3wallet;
    } catch (error) {
      console.error('Failed to initialize WalletConnect:', error);
      throw error;
    }
  }

  private setupEventListeners() {
    if (!this.web3wallet) return;

    this.web3wallet.on('session_proposal', this.onSessionProposal.bind(this));
    this.web3wallet.on('session_request', this.onSessionRequest.bind(this));
    this.web3wallet.on('session_delete', this.onSessionDelete.bind(this));
  }

  private async onSessionProposal(event: any) {
    try {
      const { id, params } = event;
      const { requiredNamespaces, relays } = params;

      // Build approved namespaces
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          eip155: {
            chains: ['eip155:1', 'eip155:137', 'eip155:56'], // Ethereum, Polygon, BSC
            methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
            events: ['accountsChanged', 'chainChanged'],
            accounts: []
          }
        }
      });

      await this.web3wallet.approveSession({
        id,
        namespaces: approvedNamespaces,
      });
    } catch (error) {
      console.error('Session proposal error:', error);
    }
  }

  private async onSessionRequest(event: any) {
    const { id, topic, params } = event;

    try {
      // Handle session requests here
      console.log('Session request:', event);
    } catch (error) {
      await this.web3wallet.respondSessionRequest({
        topic,
        response: {
          id,
          error: getSdkError('USER_REJECTED'),
        },
      });
    }
  }

  private onSessionDelete(event: any) {
    console.log('Session deleted:', event);
  }

  async connectWallet(walletType: string) {
    try {
      if (!this.web3wallet) {
        await this.initialize();
      }

      // Create connection URI for the specific wallet
      const { uri } = await this.web3wallet.core.pairing.create();

      return {
        uri,
        walletType,
        success: true
      };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  async getConnectedAccounts() {
    if (!this.web3wallet) return [];

    const sessions = this.web3wallet.getActiveSessions();
    const accounts = [];

    for (const session of Object.values(sessions)) {
      const sessionAccounts = (session as any).namespaces?.eip155?.accounts || [];
      accounts.push(...sessionAccounts.map((acc: string) => acc.split(':')[2]));
    }

    return accounts;
  }

  async disconnectAll() {
    if (!this.web3wallet) return;

    const sessions = this.web3wallet.getActiveSessions();
    for (const session of Object.values(sessions)) {
      await this.web3wallet.disconnectSession({
        topic: (session as any).topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
    }
  }
}

export const walletConnectService = new WalletConnectService();