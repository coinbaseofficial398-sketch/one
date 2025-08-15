import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { useState } from "react";

export default function AutomationFeature() {
  const [currentSlide] = useState(0);
  const totalSlides = 5;

  return (
    <section className="px-4 mb-8" data-testid="automation-feature">
      <Card className="relative bg-gradient-to-br from-dark-card to-dark-surface border-gradient rounded-xl p-6 overflow-hidden">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-bitnest rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="text-black text-2xl" />
          </div>
          
          <h3 className="text-xl font-bold mb-4" data-testid="text-automation-title">
            Full Automation
          </h3>
          
          <p className="text-gray-300 text-sm leading-relaxed" data-testid="text-automation-description">
            BitNest does not store your assets; all assets are fully stored on the blockchain, with assets automatically moving between participants and contracts.
          </p>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center space-x-2 mt-6" data-testid="pagination-dots">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-bitnest-green' : 'bg-gray-600'
              }`}
              data-testid={`dot-${index}`}
            />
          ))}
        </div>
      </Card>
    </section>
  );
}
