import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#212529] text-[#CED4DA] py-8 px-4 md:px-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        
        {/* Left: Developer Info */}
        <div className="text-center md:text-left">
          <p className="text-sm">
            © {currentYear}{' '}
            <a
              href="https://adeelaliyousaf.github.io/Portfolio"
              className="text-[#FF9F1C] hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Adeel Ali Yousaf
            </a>. All rights reserved.
          </p>
        </div>

        {/* Center: Social Icons */}
        <div className="flex space-x-5">
          <a
            href="https://github.com/AdeelAliYousaf"
            className="hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github fa-lg"></i>
          </a>
          <a
            href="https://linkedin.com/in/adeel-ali-yousaf-b10b87232/"
            className="hover:text-[#FF9F1C]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin fa-lg"></i>
          </a>
          <a
            href="mailto:adeelaliyousaf.dev@gmail.com"
            className="hover:text-[#FF9F1C]"
          >
            <i className="fas fa-envelope fa-lg"></i>
          </a>
          <a
            href="https://instagram.com/adeelportfolio"
            className="hover:text-[#FF9F1C]"
            target='_blank'
            rel='noopener noreferrer'
          >
            <i className="fab fa-instagram fa-lg"></i>
          </a>
        </div>

        {/* Right: Tech Info */}
        <div className="text-sm text-center md:text-right">
          <p>
            Built with 💻 using <span className="font-semibold text-white">React + Tailwind</span>
          </p>
        </div>
      </div>
      <br /><br />
    </footer>
  );
};

export default Footer;
