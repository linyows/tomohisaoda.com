import Link from "next/link";
import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer grider">
      <span></span>
      <p className="site-license">
        &copy; <Link href="/">Tomohisa Oda</Link>. {` `}
        Powered by Next.js, Cloudflare, Lolipop and {` `}
        <a
          href="https://rotion.linyo.ws/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rotion
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;
