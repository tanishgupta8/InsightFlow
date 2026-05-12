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

const slideLeft = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

const slideRight = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

const LandingPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      
      {/* Hero Section */}
      <motion.section 
        className="hero-container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="giant-text-bg"
        >
          INSIGHT
        </motion.div>

        <div className="hero-content">
          <motion.div variants={slideLeft} className="decorative-line-vertical"></motion.div>
          <motion.h1 variants={slideLeft}>
            DATA<br/><span style={{ color: 'var(--accent-primary)' }}>UNLEASHED</span>
          </motion.h1>
          <motion.p variants={slideLeft}>
            Drop CSVs. Extract high-signal metrics and trends straight from advanced inference engines. Zero config. Extreme speed.
          </motion.p>
          <motion.div variants={slideUp} className="hero-actions" style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/signup" className="btn-primary">START ENGINE</Link>
            <Link to="/upload" className="btn-secondary">GUEST ACCESS</Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Feature Section (Bento Style) */}
      <motion.section 
        className="bento-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={slideUp} className="bento-box" style={{ gridColumn: 'span 8' }}>
          <div className="bento-number">
            790<span>R</span>
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>EXTREME PROCESSING</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
            We ingest unstructured sales rows and map them automatically to a readable executive format. Raw speed.
          </p>
        </motion.div>

        <motion.div variants={slideRight} className="bento-orange-block" style={{ gridColumn: 'span 4' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>02 <br/> INSTANT</h2>
          <p style={{ color: 'rgba(0,0,0,0.7)', fontWeight: '500' }}>
            Powered by massive 70B parameter inference models for uncompromised accuracy.
          </p>
        </motion.div>
      </motion.section>

      <motion.section 
        className="bento-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        style={{ borderTop: 'none' }}
      >
        <motion.div variants={slideLeft} className="bento-box" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="bento-number" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            03
          </div>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)' }}>CUSTOM INSIGHTS</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Ask anything. The engine adapts and extracts exactly what you demand.
          </p>
        </motion.div>

        <motion.div variants={slideUp} className="bento-box" style={{ gridColumn: 'span 8', background: 'var(--bg-primary)' }}>
          <div style={{ background: '#000', border: '1px solid var(--border-color)', padding: '2rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent-primary)' }}>&gt;</span> System initializing...<br/>
            <span style={{ color: 'var(--accent-primary)' }}>&gt;</span> Parsing 124,500 data points...<br/>
            <span style={{ color: 'var(--accent-primary)' }}>&gt;</span> Querying inference engine...<br/><br/>
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              transition={{ delay: 0.5, duration: 0.1 }}
              style={{ color: '#fff', fontSize: '1.25rem' }}
            >
              SUCCESS: Insights Extracted
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

    </div>
  );
};

export default LandingPage;
