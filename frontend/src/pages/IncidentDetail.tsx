import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchIncidentById, updateIncident } from '../api/incidentApi';
import { Incident, UpdateIncidentPayload, Severity, Status } from '../types/incident';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge';

const SERVICES = ['Auth', 'Payments', 'Backend', 'Frontend', 'Database', 'API Gateway', 'Notifications', 'Search', 'Analytics', 'CDN'];

const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState<UpdateIncidentPayload>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    loadIncident();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadIncident = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIncidentById(id!);
      setIncident(data);
      setEditForm({
        title: data.title,
        service: data.service,
        severity: data.severity,
        status: data.status,
        owner: data.owner || '',
        summary: data.summary || '',
      });
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Incident not found');
      } else {
        setError('Failed to load incident details');
      }
    } finally {
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (editForm.title !== undefined && editForm.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters';
    }
    if (editForm.service !== undefined && !editForm.service.trim()) {
      errs.service = 'Service is required';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: UpdateIncidentPayload = { ...editForm };
      if (payload.owner === '') payload.owner = undefined;
      if (payload.summary === '') payload.summary = undefined;
      const updated = await updateIncident(id!, payload);
      setIncident(updated);
      setEditing(false);
      setToast({ message: 'Incident updated successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update incident.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (incident) {
      setEditForm({
        title: incident.title,
        service: incident.service,
        severity: incident.severity,
        status: incident.status,
        owner: incident.owner || '',
        summary: incident.summary || '',
      });
    }
    setFormErrors({});
    setEditing(false);
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string): string => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading incident details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error-state">
          <p>{error}</p>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/')}>
            Back to Incidents
          </button>
        </div>
      </div>
    );
  }

  if (!incident) return null;

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to Incidents
      </Link>

      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Incident Tracker</h2>
          {!editing && (
            <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
              Edit Incident
            </button>
          )}
        </div>

        <div className="card-body">
          {editing ? (
            /* ===== Edit Mode ===== */
            <div>
              <div className="form-group">
                <label htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  className="form-control"
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                />
                {formErrors.title && <p className="form-error">{formErrors.title}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-service">Service</label>
                  <select
                    id="edit-service"
                    className="form-control"
                    value={editForm.service || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, service: e.target.value }))}
                  >
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {formErrors.service && <p className="form-error">{formErrors.service}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="edit-severity">Severity</label>
                  <select
                    id="edit-severity"
                    className="form-control"
                    value={editForm.severity || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, severity: e.target.value as Severity }))}
                  >
                    {['SEV1', 'SEV2', 'SEV3', 'SEV4'].map((sev) => (
                      <option key={sev} value={sev}>{sev}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-status">Status</label>
                  <select
                    id="edit-status"
                    className="form-control"
                    value={editForm.status || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value as Status }))}
                  >
                    <option value="OPEN">Open</option>
                    <option value="MITIGATED">Mitigated</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-owner">Assigned To</label>
                  <input
                    id="edit-owner"
                    className="form-control"
                    type="text"
                    placeholder="Optional"
                    value={editForm.owner || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, owner: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-summary">Summary</label>
                <textarea
                  id="edit-summary"
                  className="form-control"
                  rows={4}
                  value={editForm.summary || ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, summary: e.target.value }))}
                />
              </div>

              <div className="actions-row">
                <button className="btn btn-success" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="btn btn-secondary" onClick={handleCancel} disabled={saving}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ===== View Mode ===== */
            <div>
              <div className="detail-header">
                <h1 className="detail-title">{incident.title}</h1>
              </div>

              <div className="detail-meta">
                <div className="meta-item">
                  <span className="meta-label">Service</span>
                  <span className="meta-value">{incident.service}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Severity</span>
                  <span className="meta-value"><SeverityBadge severity={incident.severity} /></span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <span className="meta-value"><StatusBadge status={incident.status} /></span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Assigned To</span>
                  <span className="meta-value">{incident.owner || '—'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Occurred At</span>
                  <span className="meta-value">{formatDate(incident.createdAt)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Last Updated</span>
                  <span className="meta-value">{formatDateTime(incident.updatedAt)}</span>
                </div>
              </div>

              {incident.summary && (
                <div className="detail-summary">
                  <h3>Summary</h3>
                  <p>{incident.summary}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default IncidentDetail;
