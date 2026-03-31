import { motion } from "framer-motion";
import { Brain, TrendingUp, Lightbulb, Zap } from "lucide-react";

interface PredictionResultProps {
  role: string;
  confidence: number;
  relatedRoles: string[];
  tips: string[];
}

const roleIcons: Record<string, React.ReactNode> = {
  "AI Engineer": <Brain className="w-10 h-10" />,
  "Web Developer": <Zap className="w-10 h-10" />,
  "Data Analyst": <TrendingUp className="w-10 h-10" />,
  "Data Scientist": <TrendingUp className="w-10 h-10" />,
};

const PredictionResult = ({ role, confidence, relatedRoles, tips }: PredictionResultProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      className="space-y-6"
    >
      {/* Main Result */}
      <div className="result-card text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-blue/10 pointer-events-none rounded-2xl" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/30 mb-4"
        >
          <span className="text-primary">{roleIcons[role] || <Zap className="w-10 h-10" />}</span>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm uppercase tracking-widest text-muted-foreground mb-2"
        >
          Predicted Role
        </motion.h3>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl md:text-4xl font-bold font-display neon-text mb-6"
        >
          {role}
        </motion.h2>

        {/* Confidence Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-xs mx-auto"
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Confidence</span>
            <span className="text-primary font-semibold">{confidence}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "var(--gradient-primary)" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Related Roles */}
      {relatedRoles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-6"
        >
          <h4 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" /> Related Roles
          </h4>
          <div className="flex flex-wrap gap-2">
            {relatedRoles.map((r) => (
              <span key={r} className="tag-chip">{r}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Career Tips */}
      {tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="glass-card p-6"
        >
          <h4 className="text-sm font-semibold text-foreground/80 mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent" /> Career Tips
          </h4>
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.1 }}
                className="flex items-start gap-3 text-sm text-foreground/70"
              >
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {tip}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PredictionResult;
