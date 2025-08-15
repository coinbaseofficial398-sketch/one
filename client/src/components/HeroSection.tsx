import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { useQuery } from "@tanstack/react-query";

export default function HeroSection() {
  const { toast } = useToast();
  const [isInviting, setIsInviting] = useState(false);

  // Fetch live liquidity data
  const { data: liquidityData } = useQuery({
    queryKey: ["/api/liquidity"],
    refetchInterval: 5000, // Update every 5 seconds
  });

  const liquidityCount = useAnimatedCounter(
    liquidityData?.liquidity || 42851404, 
    2000
  );

  const handleInviteFriends = async () => {
    setIsInviting(true);
    
    try {
      const inviteLink = "https://www.bitnest.finance/invite?ref=user123";
      await navigator.clipboard.writeText(inviteLink);
      
      toast({
        title: "Invite Link Copied!",
        description: "Share this link with your friends to earn rewards",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please try copying the link manually",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <section className="relative px-4 py-8 text-center" data-testid="hero-section">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-4 w-16 h-16 border border-bitnest-green transform rotate-45 animate-float"></div>
        <div className="absolute top-32 right-8 w-12 h-12 border border-bitnest-cyan transform rotate-12 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-12 w-8 h-8 border border-bitnest-accent transform rotate-45 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Modern flowing wave background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-transparent via-bitnest-green/10 to-transparent opacity-30 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-8">
          <div 
            className="text-5xl font-bold text-gradient animate-counter"
            data-testid="text-liquidity-counter"
          >
            {liquidityCount.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-bitnest-cyan mt-2 tracking-wider">
            LIQUIDITY
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="bg-gradient-bitnest text-black px-3 py-1 rounded-full text-sm font-bold">
              №1
            </span>
            <span className="text-lg font-semibold">Join BitNest to create a new</span>
          </div>
          <div className="text-lg font-semibold text-white">
            Web 3.0 economy financial system
          </div>
        </div>

        <Button
          className="w-full max-w-sm bg-gradient-bitnest text-black py-4 rounded-full font-bold text-lg animate-glow hover:opacity-90 transition-opacity"
          onClick={handleInviteFriends}
          disabled={isInviting}
          data-testid="button-invite-friends"
        >
          <span>{isInviting ? "Copying..." : "Invite Friends"}</span>
          <Copy className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
