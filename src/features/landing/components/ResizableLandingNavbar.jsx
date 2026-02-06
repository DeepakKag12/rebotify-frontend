import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "../../../components/ui/resizable-navbar";
import useAuthStore from "../../../store/authStore";

const ResizableLandingNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const navItems = [
    { name: "Home", link: "#home" },
    { name: "How It Works", link: "#how-it-works" },
    { name: "About Us", link: "#about-us" },
    { name: "Services", link: "#services" },
    { name: "Contact", link: "#contact" },
  ];

  const handleItemClick = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (href && href.startsWith("#")) {
      const sectionId = href.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Redirect to user's dashboard based on their role
      switch (user?.userType) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "recycler":
          navigate("/recycler/dashboard");
          break;
        case "delivery":
          navigate("/delivery-partner/dashboard");
          break;
        default:
          navigate("/user/dashboard");
      }
    } else {
      navigate("/signup");
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignIn = () => {
    if (isAuthenticated) {
      // Redirect to user's dashboard based on their role
      switch (user?.userType) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "recycler":
          navigate("/recycler/dashboard");
          break;
        case "delivery":
          navigate("/delivery-partner/dashboard");
          break;
        default:
          navigate("/user/dashboard");
      }
    } else {
      navigate("/login");
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} onItemClick={handleItemClick} />
          <div className="flex items-center gap-4">
            <NavbarButton
              variant="primary"
              onClick={handleSignIn}
              as="button"
            >
              {isAuthenticated ? "My Account" : "Sign In"}
            </NavbarButton>
            <NavbarButton
              variant="green"
              onClick={handleGetStarted}
              as="button"
            >
              {isAuthenticated ? "Dashboard" : "Get Started"}
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={(e) => {
                  handleItemClick(e);
                  setIsMobileMenuOpen(false);
                }}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={handleSignIn}
                variant="primary"
                className="w-full"
                as="button"
              >
                {isAuthenticated ? "My Account" : "Sign In"}
              </NavbarButton>
              <NavbarButton
                onClick={handleGetStarted}
                variant="green"
                className="w-full"
                as="button"
              >
                {isAuthenticated ? "Dashboard" : "Get Started"}
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};

// Custom Logo Component
const NavbarLogo = () => {
  return (
    <a
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
    >
      <span className="text-xl font-bold text-brand-green">
        Re<span className="text-brand-olive">bot</span>
      </span>
    </a>
  );
};

export default ResizableLandingNavbar;
