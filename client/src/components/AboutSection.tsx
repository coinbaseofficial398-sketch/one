import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AboutSection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="px-4 mb-8" data-testid="about-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gradient">BitNest</h2>
        <Button
          variant="ghost"
          className="bg-bitnest-cyan/20 text-bitnest-cyan hover:bg-bitnest-cyan/30 px-3 py-1 rounded-lg text-sm font-semibold"
          onClick={() => setShowMore(!showMore)}
          data-testid="button-more-about"
        >
          More
        </Button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3" data-testid="text-ecosystem-title">
          The ecosystem of the next generation cryptocurrency, known as 'Cryptocurrency Banking Smart Contract on Blockchain'
        </h3>
        
        <p className="text-gray-300 text-sm leading-relaxed" data-testid="text-ecosystem-description">
          BitNest is a decentralized finance (DeFi) platform based on blockchain technology, aimed at establishing a distributed digital world system characterized by transparency, accessibility, and inclusiveness. It realizes a decentralized peer-to-peer economic circulation model that securely meets the savings needs of global users and institutions for capital flow, leasing, and alternating income while ensuring capital preservation.
        </p>
      </div>
    </section>
  );
}
