import { Lock } from "lucide-react";

const footerSections = [
  {
    title: "Ecology",
    links: ["Loop", "SavingBox", "Lease()", "Wallet"]
  },
  {
    title: "Community", 
    links: ["Join Community", "Git Book", "Telegram Groups", "Telegram News"]
  },
  {
    title: "About",
    links: ["Domain", "Legal Disclaimer", "Terms of Use", "Privacy Policy"]
  },
  {
    title: "Support",
    links: ["WhitePaper", "Security Audit", "Contract"]
  }
];

export default function Footer() {
  return (
    <footer className="px-4 py-8 border-t border-gray-800" data-testid="footer">
      <div className="space-y-6">
        {footerSections.map((section) => (
          <div key={section.title}>
            <h4 className="text-bitnest-green font-semibold mb-3" data-testid={`footer-title-${section.title.toLowerCase()}`}>
              {section.title}
            </h4>
            <div className="space-y-2">
              {section.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-gray-400 text-sm hover:text-bitnest-green transition-colors"
                  data-testid={`link-${link.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800 text-center">
        <p className="text-gray-500 text-xs" data-testid="copyright">
          © 2022 BitNest Limited, all rights reserved
        </p>
        <div className="mt-4 flex justify-center">
          <div className="bg-dark-card px-4 py-2 rounded-lg flex items-center space-x-2">
            <Lock className="text-gray-400 h-3 w-3" />
            <span className="text-gray-400 text-xs font-semibold" data-testid="domain">
              bitnest.finance
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
