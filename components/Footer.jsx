const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} AI Resume Analyzer
      </div>
    </footer>
  );
};

export default Footer;
