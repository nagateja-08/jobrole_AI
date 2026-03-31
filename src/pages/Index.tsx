import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, User, Database, Cpu, ChevronDown } from "lucide-react";
import TagInput from "@/components/TagInput";
import PredictionResult from "@/components/PredictionResult";
import DatasetViewer from "@/components/DatasetViewer";
import ParticleBackground from "@/components/ParticleBackground";
import { predictRoleWithAI, AIPredictionResult } from "@/lib/geminiService";

const SKILLS = [
  "Python", "JavaScript", "React", "Node.js", "TypeScript", "Angular", "Vue.js",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn",
  "SQL", "MongoDB", "MySQL", "PostgreSQL", "Docker", "AWS", "Git",
  "HTML", "CSS", "PHP", "R", "Excel", "Pandas", "NumPy",
  "NLP", "OpenCV", "LangChain", "Hugging Face", "MLOps", "Keras",
  "REST APIs", "GraphQL", "SPSS", "Statistics", "Data Visualization",
  "Google Analytics", "Tableau",
];

const CERTIFICATIONS = [
  "AWS Cloud Practitioner", "AWS Machine Learning", "Google TensorFlow Developer",
  "Deep Learning Specialization", "IBM AI Engineering", "MongoDB Developer",
  "React Developer Certification", "Node.js Certification", "Meta Frontend Developer",
  "Tableau Desktop Specialist", "None",
];

const SOFT_SKILLS = [
  "Communication", "Teamwork", "Leadership", "Problem Solving",
  "Critical Thinking", "Creativity", "Adaptability", "Collaboration",
  "Attention to Detail", "Time Management",
];

const EDUCATION = ["Diploma", "Bachelor's", "Master's", "PhD"];

const ROLE_TIPS: Record<string, string[]> = {
  "AI Engineer": [
    "Master deep learning frameworks like TensorFlow and PyTorch",
    "Build a portfolio of ML projects on GitHub",
    "Stay updated with latest research papers on arXiv",
    "Learn MLOps for production deployment",
  ],
  "Web Developer": [
    "Build full-stack projects with modern frameworks",
    "Learn cloud deployment (AWS, Vercel, Netlify)",
    "Contribute to open-source projects",
    "Master responsive design and accessibility",
  ],
  "Data Analyst": [
    "Get proficient with SQL and Excel for data manipulation",
    "Learn data visualization tools like Tableau or Power BI",
    "Practice statistical analysis and hypothesis testing",
    "Build dashboards and reports for real-world datasets",
  ],
  "Data Scientist": [
    "Strengthen your statistics and probability foundations",
    "Learn feature engineering techniques",
    "Practice with Kaggle competitions",
    "Master storytelling with data",
  ],
};

const RELATED_ROLES: Record<string, string[]> = {
  "AI Engineer": ["ML Engineer", "Data Scientist", "Research Engineer", "NLP Engineer"],
  "Web Developer": ["Full Stack Developer", "Frontend Engineer", "UI/UX Developer", "DevOps Engineer"],
  "Data Analyst": ["Business Analyst", "Data Scientist", "BI Developer", "Analytics Engineer"],
  "Data Scientist": ["ML Engineer", "AI Engineer", "Data Analyst", "Research Scientist"],
};

const Index = () => {
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ role: string; confidence: number } | null>(null);
  const [aiResult, setAiResult] = useState<AIPredictionResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"predict" | "dataset">("predict");
  const [eduOpen, setEduOpen] = useState(false);

  const handlePredict = async () => {
    if (!education || skills.length === 0) return;
    setLoading(true);
    setResult(null);
    setAiResult(null);
    setAiError(null);

    // AI prediction logic
    const aiPromise = predictRoleWithAI(name, education, skills, certifications, softSkills).catch((e) => {
      setAiError(e.message || "Failed to fetch AI prediction.");
      return null;
    });

    // Simulate API call (replace with real POST to /predict)
    await new Promise((r) => setTimeout(r, 2500));

    // Mock prediction logic based on skills
    const hasML = skills.some((s) =>
      ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "OpenCV", "Keras", "Scikit-learn", "MLOps", "LangChain", "Hugging Face"].includes(s)
    );
    const hasWeb = skills.some((s) =>
      ["React", "Angular", "Vue.js", "Node.js", "JavaScript", "TypeScript", "HTML", "CSS", "PHP", "REST APIs"].includes(s)
    );
    const hasData = skills.some((s) =>
      ["SQL", "Excel", "R", "Pandas", "Tableau", "SPSS", "Statistics", "Data Visualization", "NumPy"].includes(s)
    );

    let role = "Web Developer";
    let confidence = 75 + Math.random() * 20;
    if (hasML && !hasWeb) { role = "AI Engineer"; confidence = 80 + Math.random() * 18; }
    else if (hasData && !hasML && !hasWeb) { role = "Data Analyst"; confidence = 78 + Math.random() * 18; }
    else if (hasML && hasData) { role = "Data Scientist"; confidence = 76 + Math.random() * 20; }

    setResult({ role, confidence: Math.round(confidence) });
    
    // wait for AI
    const aiData = await aiPromise;
    if (aiData) {
      setAiResult(aiData);
    }
    
    setLoading(false);
  };

  const canPredict = education && skills.length > 0;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-background" />
      <div className="floating-orb w-96 h-96 -top-48 -left-48 bg-neon-purple" />
      <div className="floating-orb w-80 h-80 top-1/2 -right-40 bg-neon-blue" style={{ animationDelay: "3s" }} />
      <div className="floating-orb w-64 h-64 -bottom-32 left-1/3 bg-neon-pink" style={{ animationDelay: "5s" }} />
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-glass-border/50 backdrop-blur-xl bg-background/30">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-border" style={{ background: "var(--gradient-primary)" }}>
                <Cpu className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-display neon-text">RoleAI</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Career Intelligence</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-glass-border"
            >
              <button
                onClick={() => setActiveTab("predict")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "predict"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Predict</span>
              </button>
              <button
                onClick={() => setActiveTab("dataset")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "dataset"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2"><Database className="w-4 h-4" /> Dataset</span>
              </button>
            </motion.div>
          </div>
        </header>

        {/* Main */}
        <main className="container mx-auto px-4 py-8 md:py-12">
          <AnimatePresence mode="wait">
            {activeTab === "predict" ? (
              <motion.div
                key="predict"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Hero */}
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="inline-flex items-center gap-2 tag-chip mb-4">
                      <Cpu className="w-3 h-3" /> AI-Powered Career Prediction
                    </span>
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold font-display"
                  >
                    Discover Your <span className="neon-text">Perfect Role</span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground text-lg"
                  >
                    Enter your skills and qualifications, and our ML model will predict the ideal job role for you.
                  </motion.p>
                </div>

                {/* Form + Result Grid */}
                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {/* Form */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 md:p-8 space-y-6 lg:col-span-1"
                  >
                    <h3 className="text-lg font-bold font-display flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" /> Your Profile
                    </h3>

                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full rounded-xl border border-glass-border bg-glass/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all backdrop-blur-sm"
                      />
                    </div>

                    {/* Education */}
                    <div className="space-y-2 relative">
                      <label className="text-sm font-medium text-foreground/80">Education Level</label>
                      <button
                        type="button"
                        onClick={() => setEduOpen(!eduOpen)}
                        className="w-full rounded-xl border border-glass-border bg-glass/40 px-4 py-3 text-sm text-left flex items-center justify-between focus:outline-none focus:border-primary/50 transition-all backdrop-blur-sm"
                      >
                        <span className={education ? "text-foreground" : "text-muted-foreground"}>
                          {education || "Select education"}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${eduOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {eduOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute z-50 mt-1 w-full rounded-xl border border-glass-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                          >
                            {EDUCATION.map((e) => (
                              <button
                                key={e}
                                type="button"
                                onClick={() => { setEducation(e); setEduOpen(false); }}
                                className="w-full text-left px-4 py-3 text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground transition-colors"
                              >
                                {e}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <TagInput label="Skills" options={SKILLS} selected={skills} onChange={setSkills} placeholder="e.g. Python, React..." />
                    <TagInput label="Certifications" options={CERTIFICATIONS} selected={certifications} onChange={setCertifications} placeholder="e.g. AWS Cloud..." />
                    <TagInput label="Soft Skills" options={SOFT_SKILLS} selected={softSkills} onChange={setSoftSkills} placeholder="e.g. Leadership..." />

                    {/* Predict Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePredict}
                      disabled={!canPredict || loading}
                      className={`w-full glow-button text-base py-4 flex items-center justify-center gap-3 ${
                        !canPredict ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Predict My Job Role
                        </>
                      )}
                    </motion.button>
                  </motion.div>

                  {/* Result Panel */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col"
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="glass-card flex-1 flex flex-col items-center justify-center p-8 space-y-6"
                        >
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                            <Brain className="absolute inset-0 m-auto w-8 h-8 text-primary" />
                          </div>
                          <div className="text-center space-y-2">
                            <p className="text-foreground font-semibold font-display">Analyzing your profile</p>
                            <p className="text-sm text-muted-foreground">Our ML model is processing your skills...</p>
                          </div>
                          <div className="w-full max-w-xs h-1 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 2.5 }}
                              className="h-full rounded-full"
                              style={{ background: "var(--gradient-primary)" }}
                            />
                          </div>
                        </motion.div>
                      ) : result ? (
                        <motion.div key="result" className="flex flex-col lg:flex-row gap-6 w-full h-full">
                          <div className="flex-1 w-full">
                            <h4 className="text-xl font-bold font-display text-center mb-4 text-muted-foreground"><Zap className="w-5 h-5 inline-block mr-2" />Rule-Based Prediction</h4>
                            <PredictionResult
                              role={result.role}
                              confidence={result.confidence}
                              relatedRoles={RELATED_ROLES[result.role] || []}
                              tips={ROLE_TIPS[result.role] || []}
                            />
                          </div>
                          
                          <div className="flex-1 w-full">
                            <h4 className="text-xl font-bold font-display text-center mb-4 text-primary"><Cpu className="w-5 h-5 inline-block mr-2" />Gemini Prediction</h4>
                            {aiError ? (
                              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-sm text-center">
                                {aiError}
                              </div>
                            ) : aiResult ? (
                              <PredictionResult
                                role={aiResult.role}
                                confidence={aiResult.confidence}
                                relatedRoles={aiResult.relatedRoles || []}
                                tips={aiResult.tips || []}
                              />
                            ) : null}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="glass-card flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 min-h-[400px]"
                        >
                          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                            <Zap className="w-8 h-8 text-muted-foreground/50" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-foreground/60 font-display font-semibold">Your Prediction Awaits</p>
                            <p className="text-sm text-muted-foreground max-w-xs">
                              Fill in your profile and click predict to discover your ideal career path.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dataset"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <DatasetViewer />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Blank Footer */}
        <footer className="mt-16 pb-8">
        </footer>
      </div>
    </div>
  );
};

const Brain = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
    <path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
  </svg>
);

export default Index;
