import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, Coins, Handshake, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const navigationItems = [
  { icon: Users, label: "My Team", id: "team" },
  { icon: MessageCircle, label: "Community", id: "community" },
  { icon: Coins, label: "Earn Daily", id: "earn" },
  { icon: Handshake, label: "Partner", id: "partner" }
];

export default function NavigationZone() {
  const { toast } = useToast();
  const [showMore, setShowMore] = useState(false);

  const navigationMutation = useMutation({
    mutationFn: (section: string) => 
      apiRequest(`/api/navigate/${section}`, {
        method: "POST",
      }),
    onSuccess: (data, section) => {
      const item = navigationItems.find(item => item.id === section);
      toast({
        title: `${item?.label} Opened`,
        description: `Successfully navigated to ${item?.label}`,
      });

      // Handle specific navigation actions
      if (section === 'community') {
        window.open('https://t.me/bitnest_community', '_blank');
      }
    },
    onError: (error: any, section) => {
      const item = navigationItems.find(item => item.id === section);
      toast({
        title: "Navigation Failed",
        description: `Could not open ${item?.label}. Please try again.`,
        variant: "destructive",
      });
    }
  });

  const handleNavigation = (item: typeof navigationItems[0]) => {
    navigationMutation.mutate(item.id);
  };

  const toggleMore = () => {
    setShowMore(!showMore);
  };

  return (
    <section className="px-4 mb-8" data-testid="navigation-zone">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gradient">BitNest Zone</h2>
        <Button
          variant="ghost"
          className="bg-bitnest-cyan/20 text-bitnest-cyan hover:bg-bitnest-cyan/30 px-3 py-1 rounded-lg text-sm font-semibold"
          onClick={toggleMore}
          data-testid="button-more"
        >
          <span>More</span>
          <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${showMore ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {navigationItems.map((item) => (
          <div 
            key={item.id}
            className="flex flex-col items-center space-y-3 cursor-pointer group"
            onClick={() => handleNavigation(item)}
            data-testid={`nav-item-${item.id}`}
          >
            <div className="w-16 h-16 border-2 border-bitnest-green rounded-full flex items-center justify-center bg-dark-card/50 hover:bg-bitnest-green/10 transition-all duration-300 hexagon">
              <item.icon className="text-white text-lg" />
            </div>
            <span className="text-xs text-gray-300 text-center group-hover:text-bitnest-green transition-colors">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
