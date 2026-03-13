import { Code2, FolderTree } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const FILES = [
  { name: "main.js", lang: "javascript", icon: <Code2 className="h-4 w-4 text-yellow-400" /> },
  { name: "script.py", lang: "python", icon: <Code2 className="h-4 w-4 text-blue-400" /> },
  { name: "App.java", lang: "java", icon: <Code2 className="h-4 w-4 text-orange-500" /> },
  { name: "main.cpp", lang: "c++", icon: <Code2 className="h-4 w-4 text-blue-500" /> },
];

export default function Sidebar({ currentLanguage, onLanguageChange }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Sidebar Header */}
      <div className="flex h-12 items-center justify-between px-4 border-b border-border">
        <span className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FolderTree className="h-4 w-4" /> Explorer
        </span>
      </div>

      {/* File List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {FILES.map((file) => (
            <button
              key={file.lang}
              onClick={() => onLanguageChange(file.lang)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                currentLanguage === file.lang
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {file.icon}
              {file.name}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
