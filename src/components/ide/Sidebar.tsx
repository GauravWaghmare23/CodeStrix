import { FolderTree, Plus, Trash2, FileCode, FileText, Globe, Hash, ChevronRight, ChevronDown, FolderPlus, FilePlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  parentId: string | null;
  isOpen?: boolean;
}

interface SidebarProps {
  fs: FileSystemItem[];
  activeFileId: string;
  onSelect: (id: string) => void;
  onCreate: (name: string, type: 'file' | 'folder', parentId: string | null) => void;
  onDelete: (id: string) => void;
  onToggleFolder: (id: string) => void;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'html': return <Globe className="h-4 w-4 text-orange-500" />;
    case 'css': return <Hash className="h-4 w-4 text-blue-400" />;
    case 'js':
    case 'ts': return <FileCode className="h-4 w-4 text-yellow-400" />;
    case 'py': return <FileCode className="h-4 w-4 text-blue-500" />;
    case 'java': return <FileCode className="h-4 w-4 text-red-500" />;
    case 'cpp': return <FileCode className="h-4 w-4 text-blue-600" />;
    default: return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function Sidebar({ fs, activeFileId, onSelect, onCreate, onDelete, onToggleFolder }: SidebarProps) {
  const [isCreating, setIsCreating] = useState<{ parentId: string | null; type: 'file' | 'folder' } | null>(null);
  const [newName, setNewName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && isCreating) {
      onCreate(newName.trim(), isCreating.type, isCreating.parentId);
      setNewName("");
      setIsCreating(null);
    }
  };

  const renderTree = (parentId: string | null, depth = 0) => {
    const items = fs.filter(item => item.parentId === parentId).sort((a, b) => {
      // Folders first
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });

    return items.map(item => (
      <div key={item.id} className="flex flex-col">
        <div
          className={`group flex items-center justify-between gap-2 rounded-md px-2 py-1 transition-all cursor-pointer ${
            activeFileId === item.id && item.type === 'file'
              ? "bg-primary/10 text-primary font-bold"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => item.type === 'folder' ? onToggleFolder(item.id) : onSelect(item.id)}
        >
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            {item.type === 'folder' ? (
              <>
                {item.isOpen ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                <span className="text-xs font-semibold truncate uppercase tracking-tighter text-blue-400/80">{item.name}</span>
              </>
            ) : (
              <>
                {getFileIcon(item.name)}
                <span className="text-xs truncate">{item.name}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {item.type === 'folder' && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsCreating({ parentId: item.id, type: 'file' }); }}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-primary"
                >
                  <FilePlus className="h-3 w-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsCreating({ parentId: item.id, type: 'folder' }); }}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-primary"
                >
                  <FolderPlus className="h-3 w-3" />
                </button>
              </>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {isCreating?.parentId === item.id && (
          <form onSubmit={handleCreate} className="my-1 mx-2" style={{ marginLeft: `${(depth + 1) * 12 + 8}px` }}>
            <Input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => !newName && setIsCreating(null)}
              placeholder={isCreating.type === 'file' ? "filename..." : "folder..."}
              className="h-6 text-[10px] bg-background border-primary/30 py-0"
            />
          </form>
        )}

        {item.type === 'folder' && item.isOpen && renderTree(item.id, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="flex h-full flex-col bg-card/60 backdrop-blur-sm border-r border-border">
      {/* Sidebar Header */}
      <div className="flex h-12 items-center justify-between px-4 border-b border-border bg-card/40">
        <span className="text-[10px] font-black tracking-[0.2em] text-muted-foreground flex items-center gap-2 uppercase">
          <FolderTree className="h-3.5 w-3.5" /> Workspace
        </span>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsCreating({ parentId: 'root', type: 'file' })}
            className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-primary"
            title="New File"
          >
            <FilePlus className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => setIsCreating({ parentId: 'root', type: 'folder' })}
            className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-primary"
            title="New Folder"
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {renderTree(null)}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border bg-muted/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Pro Workspace Active</span>
        </div>
        <div className="text-[9px] text-muted-foreground/60 font-medium leading-tight">
          Tree architecture v2.0
        </div>
      </div>
    </div>
  );
}
