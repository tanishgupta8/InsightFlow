import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HistoryPage = () => {
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

  if (!user) return <div className="page-container">Please log in to view history.</div>;

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="mb-2">Analysis History</h1>
        <Link to="/upload" className="btn-primary">New Analysis</Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Dataset Name</th>
              <th style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Date</th>
              <th style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Status</th>
              <th style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '1.5rem', textAlign: 'center' }}>Loading...</td></tr>
            ) : summaries.length > 0 ? (
              summaries.map(summary => (
                <tr key={summary._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{summary.fileId?.originalName || 'Unknown'}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{new Date(summary.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500'}}>
                      {summary.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <Link to={`/summary/${summary._id}`} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>View Detail</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No history found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;
