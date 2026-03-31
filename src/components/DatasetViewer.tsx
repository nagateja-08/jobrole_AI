import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface DataRow {
  skills: string;
  certifications: string;
  experience_years: string;
  education_level: string;
  projects_completed: string;
  github_commits_per_year: string;
  soft_skills: string;
  expected_salary_lpa: string;
  job_role: string;
}

const ROWS_PER_PAGE = 10;

const DatasetViewer = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/job_role_realistic_dataset.csv")
      .then((r) => r.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const parsed: DataRow[] = [];
        for (let i = 1; i < lines.length; i++) {
          const row = parseCSVLine(lines[i]);
          if (row.length >= 9) {
            parsed.push({
              skills: row[0],
              certifications: row[1],
              experience_years: row[2],
              education_level: row[3],
              projects_completed: row[4],
              github_commits_per_year: row[5],
              soft_skills: row[6],
              expected_salary_lpa: row[7],
              job_role: row[8],
            });
          }
        }
        setData(parsed);
        setLoading(false);
      });
  }, []);

  const filtered = data.filter((row) =>
    Object.values(row).some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const pageData = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const columns = ["Job Role", "Education", "Experience", "Skills", "Certifications", "Soft Skills", "Salary (LPA)"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-bold font-display flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <span className="neon-text">Dataset Explorer</span>
          <span className="text-xs text-muted-foreground font-normal ml-2">({data.length} records)</span>
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search dataset..."
            className="pl-9 pr-4 py-2 rounded-lg border border-glass-border bg-glass/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all backdrop-blur-sm w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-glass-border">
                  {columns.map((col) => (
                    <th key={col} className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {pageData.map((row, i) => (
                    <motion.tr
                      key={`${page}-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-glass-border/50 hover:bg-primary/5 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <span className="tag-chip text-[10px]">{row.job_role}</span>
                      </td>
                      <td className="py-3 px-3 text-foreground/70 whitespace-nowrap">{row.education_level}</td>
                      <td className="py-3 px-3 text-foreground/70">{row.experience_years}y</td>
                      <td className="py-3 px-3 text-foreground/70 max-w-[200px] truncate">{row.skills}</td>
                      <td className="py-3 px-3 text-foreground/70 max-w-[150px] truncate">{row.certifications}</td>
                      <td className="py-3 px-3 text-foreground/70 max-w-[150px] truncate">{row.soft_skills}</td>
                      <td className="py-3 px-3 text-foreground/70">₹{row.expected_salary_lpa}L</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Showing {page * ROWS_PER_PAGE + 1}-{Math.min((page + 1) * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg border border-glass-border hover:bg-primary/10 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-muted-foreground px-2">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg border border-glass-border hover:bg-primary/10 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export default DatasetViewer;
