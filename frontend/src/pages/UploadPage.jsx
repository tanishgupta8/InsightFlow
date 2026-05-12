import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20 }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [customInsight, setCustomInsight] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { user } = useAuth();

  // Pre-fill email for logged-in users on first render
  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
      setStatus('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setStatus('');
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus('');
    setCustomInsight('');
    if (!user) setEmail('');
  };

  const handleSubmit = async () => {
    if (!file) {
      setStatus("Please select a valid CSV or Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (email) {
      formData.append("email", email);
    }
    if (customInsight) {
      formData.append("customInsight", customInsight);
    }

    try {
      setStatus("Analyzing dataset via LLM...");
      setLoading(true);
      setResult(null);

      const headers = {};
      if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }

      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Upload failed");
      }

      setStatus("");
      setResult(data);

    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="page-container" 
      style={{ maxWidth: '800px' }}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.h1 variants={itemVariants} className="mb-2" style={{ fontSize: '3rem', color: 'var(--accent-primary)' }}>NEW ANALYSIS</motion.h1>
      <motion.p variants={itemVariants} className="mb-8" style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>UPLOAD DATASET. EXTRACT METRICS.</motion.p>

      {/* Dropzone */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="dropzone-container mb-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <svg className="dropzone-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <div className="dropzone-text">
          {file ? file.name : 'Click or drag file to this area to upload'}
        </div>
        <div className="dropzone-subtext">
          {file ? `${(file.size / 1024).toFixed(2)} KB` : 'Support for a single or bulk upload. CSV, XLSX.'}
        </div>
        <input 
          id="file-upload" 
          type="file" 
          style={{ display: 'none' }} 
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleFileChange}
        />
      </motion.div>

      {/* Email Field — shown for both guest and logged-in users */}
      <motion.div variants={itemVariants} className="form-group mb-6">
        <label>{user ? 'EMAIL TARGET' : 'EMAIL TARGET (GUEST)'}</label>
        <input 
          type="email" 
          placeholder="Where should we send the report?" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {user && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>Pre-filled from your account. You can change it.</span>}
      </motion.div>

      {/* Custom Insight Field */}
      <motion.div variants={itemVariants} className="form-group mb-6">
        <label>CUSTOM PARAMETERS (OPTIONAL)</label>
        <textarea 
          placeholder="ENTER SPECIFIC INQUIRIES. E.G., 'BEST PERFORMING PRODUCT?'" 
          value={customInsight}
          onChange={(e) => setCustomInsight(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical', borderRadius: '0' }}
        />
      </motion.div>

      {/* Status Messages */}
      <AnimatePresence>
        {status && !loading && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4" style={{ 
            color: status.includes('valid') || status.includes('failed') || status.includes('Failed') ? 'var(--error)' : 'var(--text-secondary)'
          }}>
            {status}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="loading-container mb-6"
          >
            <div className="loading-spinner"></div>
            <div className="loading-text">
              <span style={{ fontWeight: '500' }}>Analyzing your dataset...</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>This may take a moment as AI processes your data.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Button */}
      <AnimatePresence>
        {!result && (
          <motion.button 
            variants={itemVariants}
            exit={{ opacity: 0 }}
            className="btn-primary" 
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.25rem' }}
            onClick={handleSubmit}
            disabled={loading || !file}
          >
            {loading ? 'PROCESSING...' : 'INITIATE ANALYSIS'}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="result-section"
          >
          {/* Status Badges */}
          <div className="result-badges mb-6">
            {result.emailSent && (
              <div className="result-badge badge-success">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Email sent successfully
              </div>
            )}
            {result.emailSent === false && email && (
              <div className="result-badge badge-warning">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Email delivery failed
              </div>
            )}
            {result.savedToHistory && (
              <div className="result-badge badge-info">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Saved to your history
              </div>
            )}
            {!result.savedToHistory && (
              <div className="result-badge badge-muted">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Guest mode — not saved
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="summary-result-card">
            <div className="summary-result-header">
              <h3>{result.fileName || 'Dataset'} — Analysis</h3>
            </div>
            <div className="summary-result-body">
              {result.summaryText}
            </div>
          </div>

          {/* New Analysis Button */}
          <button 
            className="btn-secondary mt-8" 
            style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem' }}
            onClick={handleReset}
          >
            Start New Analysis
          </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UploadPage;
