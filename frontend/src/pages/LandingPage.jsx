import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const LandingPage = () => {
  return (
    <div className="page-container" style={{ position: 'relative' }}>
      <div className="bg-grid"></div>
      <div className="bg-orbs">
        <div className="orb-1"></div>
        <div className="orb-2"></div>
      </div>
      
      <motion.section 
        className="hero"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="badge">
          InsightFlow 2.0
        </motion.div>
        <motion.h1 variants={itemVariants}>
          Instantly extract meaning from tabular data.
        </motion.h1>
        <motion.p variants={itemVariants}>
          Drop CSVs. Receive high-signal metrics and trends straight from advanced LLMs. Built for speed and focus.
        </motion.p>
        <motion.div variants={itemVariants} className="hero-actions">
          <Link to="/signup" className="btn-primary">Start Building</Link>
          <Link to="/upload" className="btn-secondary">Guest Upload</Link>
        </motion.div>
      </motion.section>

      <motion.div 
        className="bento-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={itemVariants} className="card main-card">
          <h3 className="mb-4">Zero Configuration Parsing</h3>
          <p className="mb-4" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            We ingest unstructured sales rows and map them automatically to a readable executive format.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '6px', fontSize: '0.8125rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
            $ analyzing dataset...<br/>
            &gt; found 12,450 rows<br/>
            &gt; extracting key variables...<br/>
            &gt; querying inference engine...<br/>
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1.5, duration: 0.5 }}
              style={{ color: 'var(--text-primary)'}}
            >
              $ complete - 23ms
            </motion.span>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="card side-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.2)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="m17 5-5-3-5 3"></path><path d="m17 19-5 3-5-3"></path><path d="M2 12h20"></path><path d="m5 17-3-5 3-5"></path><path d="m19 17 3-5-3-5"></path></svg>
          </div>
          <h3 className="mb-2" style={{ textAlign: 'center' }}>Extremely Fast</h3>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.8125rem' }}>Responses powered by instant model inference.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
