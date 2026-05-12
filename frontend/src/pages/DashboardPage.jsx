import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/summaries', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setSummaries(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSummaries();
    }
  }, [user]);

  if (!user) return <div className="page-container">Please log in.</div>;

  const totalFiles = summaries.length;
  // Approximation, just summing bytes
  const totalSize = summaries.reduce((acc, curr) => acc + (curr.fileId?.sizeBytes || 0), 0);

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Welcome back, {user.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here's an overview of your automated insights.</p>
        </div>
        <Link to="/upload" className="btn-primary">New Analysis</Link>
      </div>

      <div className="bento-grid">
        <div className="card stat-card">
          <h3>Total Datasets Analyzed</h3>
          <div className="value">{loading ? '-' : totalFiles}</div>
        </div>
        <div className="card stat-card">
          <h3>Data Processed</h3>
          <div className="value">{loading ? '-' : `${(totalSize / 1024 / 1024).toFixed(2)} MB`}</div>
        </div>
        <div className="card stat-card">
          <h3>Active Workflows</h3>
          <div className="value">1</div>
        </div>

        <div className="card main-card">
          <h3 className="mb-6">Recent Summaries</h3>
          {loading ? (
            <p>Loading...</p>
          ) : summaries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {summaries.slice(0,5).map(summary => (
                <div key={summary._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: '500'}}>{summary.fileId?.originalName || 'Unknown File'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(summary.createdAt).toLocaleDateString()}</div>
                  </div>
                  <Link to={`/summary/${summary._id}`} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>View</Link>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)'}}>No summaries yet. Upload a dataset to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
