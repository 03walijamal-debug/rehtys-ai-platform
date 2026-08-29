import { Twitter, Linkedin, Github } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "API"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Security"],
};

export function Footer() {
  return (
    <footer className="border-t border-[#1E1B3A] bg-[#090814]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Rehtys" className="h-8 w-8 rounded-lg object-cover" />
              <span className="text-xl font-bold tracking-[0.12em] text-[#D9DCE3] font-['Space_Grotesk']">
                REH<span className="text-[#8C7AE6]">TY</span>S
              </span>
            </div>
            <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">
              Intelligence That Executes.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-[#6B7280] hover:text-[#8C7AE6] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-[#6B7280] hover:text-[#8C7AE6] transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-[#6B7280] hover:text-[#8C7AE6] transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-[#D9DCE3] mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#1E1B3A] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#6B7280]">
            © 2025 Rehtys. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
