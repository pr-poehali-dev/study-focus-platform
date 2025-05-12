
import { Link } from "react-router-dom";
import { BrainCircuit, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 animate-fade-in">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium font-montserrat">StudyFocus</span>
        </div>
        
        <nav className="flex gap-4 md:gap-6 text-sm">
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            О проекте
          </Link>
          <Link
            to="/privacy"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Политика конфиденциальности
          </Link>
          <Link
            to="/terms"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Условия использования
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground inline-flex items-center gap-1"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
        </nav>
        
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} StudyFocus. Все права защищены.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
