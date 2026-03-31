import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TagInputProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput = ({ label, options, selected, onChange, placeholder = "Type to search..." }: TagInputProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter(
    (o) => o.toLowerCase().includes(query.toLowerCase()) && !selected.includes(o)
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addTag = (tag: string) => {
    onChange([...selected, tag]);
    setQuery("");
  };

  const removeTag = (tag: string) => {
    onChange(selected.filter((t) => t !== tag));
  };

  return (
    <div ref={containerRef} className="space-y-2">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        <AnimatePresence>
          {selected.map((tag) => (
            <motion.span
              key={tag}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="tag-chip cursor-pointer"
              onClick={() => removeTag(tag)}
            >
              {tag}
              <X className="w-3 h-3" />
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div className="relative">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-glass-border bg-glass/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all backdrop-blur-sm"
        />
        <AnimatePresence>
          {open && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute z-50 mt-1 w-full max-h-48 overflow-auto rounded-xl border border-glass-border bg-card/95 backdrop-blur-xl shadow-2xl"
            >
              {filtered.slice(0, 8).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => addTag(option)}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground transition-colors"
                >
                  {option}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TagInput;
