import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-bottom">
        © {new Date().getFullYear()} Contact Application | Built with ❤️ using React &
        TypeScript
      </div>
    </footer>
  );
};

export default Footer;