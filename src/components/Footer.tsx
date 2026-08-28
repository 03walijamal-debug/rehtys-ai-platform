import { Twitter, Linkedin, Github } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "API"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Security"],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0B1120]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-white font-['Space_Grotesk']">
              REHTY<span className="text-[#00E5FF]">S</span>
            </span>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Intelligence That Executes.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-600 hover:text-[#00E5FF] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#00E5FF] transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#00E5FF] transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © 2025 Rehtys. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
