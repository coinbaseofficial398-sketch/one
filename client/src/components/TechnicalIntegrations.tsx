import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { walletConnectService } from "@/lib/walletConnect";

const integrations = [
  { id: "metamask", name: "METAMASK", color: "bg-orange-500", icon: "🦊" },
  { id: "tokenpocket", name: "TokenPocket", color: "bg-blue-500", icon: "TP" },
  { id: "coinbase", name: "CoinBase", color: "bg-blue-600", icon: "₿" },
  { id: "aml", name: "AML Bot", color: "bg-gray-600", icon: "🤖" },
  { id: "chainlink", name: "ChainLink", color: "bg-blue-400", icon: "🔗" }
];

export default function TechnicalIntegrations() {
  const { toast } = useToast();

  const handleConnectWallet = async (integration: typeof integrations[0]) => {
    if (integration.id === "aml" || integration.id === "chainlink") {
      toast({
        title: `${integration.name} Integration`,
        description: "Technical integration coming soon...",
      });
      return;
    }

    try {
      toast({
        title: `Connecting to ${integration.name}`,
        description: "Initializing WalletConnect protocol...",
      });

      const connectionResult = await walletConnectService.connectWallet(integration.id);
      
      if (connectionResult.success) {
        toast({
          title: `${integration.name} Ready`,
          description: "Please connect your wallet using the QR code or deep link",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Could not connect to ${integration.name}`,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="px-4 mb-8" data-testid="technical-integrations">
      <h3 className="text-lg font-bold text-gradient mb-6">
        Technical Integrations
      </h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className="bg-dark-card border border-gray-700 rounded-xl p-4 flex flex-col items-center space-y-3 hover:border-bitnest-green/50 transition-all duration-300 cursor-pointer"
            onClick={() => handleConnectWallet(integration)}
            data-testid={`wallet-${integration.id}`}
          >
            <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
              {integration.icon}
            </div>
            <span className="text-xs text-gray-300 font-semibold text-center" data-testid={`text-${integration.id}`}>
              {integration.name}
            </span>
          </Card>
        ))}
      </div>
    </section>
  );
}
