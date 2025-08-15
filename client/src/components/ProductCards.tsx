import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, PiggyBank, University, Vote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const products = [
  {
    id: "loop",
    icon: Zap,
    title: "BitNest Loop",
    description: "A circulation yield protocol based on the Ethereum Virtual Machine (EVM) enables individuals to provide cryptocurrency liquidity risk-free and earn returns.",
    available: true
  },
  {
    id: "saving-box",
    icon: PiggyBank,
    title: "Saving Box",
    description: "A PancakeSwap protocol based on blockchain technology, designed to provide users with safe and efficient savings services.",
    available: true
  },
  {
    id: "savings",
    icon: University,
    title: "BitNest Savings",
    description: "A cryptocurrency savings protocol based on the Binance Smart Chain network, designed to provide users with a secure and efficient savings solution.",
    available: false
  },
  {
    id: "dao",
    icon: Vote,
    title: "BitNest DAO",
    description: "Aimed at achieving a fair distribution of MellionCoin through a presale program, providing sustainable support for the development of BitNest's ecosystem.",
    available: false
  }
];

export default function ProductCards() {
  const { toast } = useToast();

  const joinProductMutation = useMutation({
    mutationFn: (productId: string) => 
      apiRequest(`/api/product/${productId}/join`, {
        method: "POST",
      }),
    onSuccess: (data, productId) => {
      const product = products.find(p => p.id === productId);
      if (data.product.status === 'active' && data.product.redirectUrl) {
        toast({
          title: `Joining ${product?.title}`,
          description: "Redirecting to product page...",
        });
        // Route payment to the specified wallet address
        window.open(data.product.redirectUrl, '_blank');
      } else {
        toast({
          title: "Coming Soon",
          description: data.message,
        });
      }
    },
    onError: (error: any, productId) => {
      const product = products.find(p => p.id === productId);
      toast({
        title: "Join Failed",
        description: `Could not join ${product?.title}. Please try again.`,
        variant: "destructive",
      });
    }
  });

  const handleJoinProduct = (product: typeof products[0]) => {
    joinProductMutation.mutate(product.id);
  };

  return (
    <section className="px-4 space-y-4 mb-8" data-testid="product-cards">
      {products.map((product) => (
        <Card 
          key={product.id}
          className="relative bg-gradient-to-br from-dark-card to-dark-surface border-gradient rounded-xl p-6 overflow-hidden group"
          data-testid={`card-product-${product.id}`}
        >
          {/* Geometric pattern background */}
          <div className="absolute top-0 left-0 w-full h-24 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-bitnest-green/20 to-bitnest-cyan/20"></div>
            <div className="absolute top-2 left-2 w-full h-full">
              <div className="grid grid-cols-12 gap-1 h-full">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-2 transform ${i % 2 === 0 ? 'rotate-45 bg-bitnest-green/40' : 'rotate-12 bg-bitnest-cyan/30'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-bitnest rounded-lg flex items-center justify-center">
                <product.icon className="text-black text-sm" />
              </div>
              <h3 className="text-xl font-bold" data-testid={`text-title-${product.id}`}>
                {product.title}
              </h3>
            </div>

            <p className="text-gray-300 text-sm mb-6 leading-relaxed" data-testid={`text-description-${product.id}`}>
              {product.description}
            </p>

            <Button
              className={`${
                product.available 
                  ? "bg-gradient-bitnest text-black hover:opacity-90" 
                  : "bg-gradient-to-r from-gray-600 to-gray-500 text-gray-300 cursor-not-allowed"
              } px-8 py-3 rounded-full font-semibold text-sm w-full max-w-32 transition-opacity`}
              onClick={() => handleJoinProduct(product)}
              disabled={!product.available}
              data-testid={`button-${product.available ? 'join' : 'coming-soon'}-${product.id}`}
            >
              {product.available ? "Join Now" : "Coming Soon"}
            </Button>
          </div>
        </Card>
      ))}
    </section>
  );
}
