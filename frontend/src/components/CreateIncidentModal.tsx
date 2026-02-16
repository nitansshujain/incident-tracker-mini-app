import React, { useState } from 'react';
import { CreateIncidentPayload, Severity, Status } from '../types/incident';

interface CreateIncidentModalProps {
  onClose: () => void;
  onSubmit: (payload: CreateIncidentPayload) => Promise<void>;
}

const SERVICES = ['Auth', 'Payments', 'Backend', 'Frontend', 'Database', 'API Gateway', 'Notifications', 'Search', 'Analytics', 'CDN'];

const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState<CreateIncidentPayload>({
    title: '',
    service: '',
    severity: 'SEV1',
    status: 'OPEN',
    owner: '',
    summary: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim() || form.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (!form.service) {
      newErrors.service = 'Service is required';
    }
    if (!form.status) {
      newErrors.status = 'Status is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload: CreateIncidentPayload = {
        ...form,
        owner: form.owner?.trim() || undefined,
        summary: form.summary?.trim() || undefined,
      };
      await onSubmit(payload);
    } catch {
      setErrors({ general: 'Failed to create incident. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateIncidentPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Incident</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.general && <p className="form-error" style={{ marginBottom: '1rem' }}>{errors.general}</p>}

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                className="form-control"
                type="text"
                placeholder="Issue Title..."
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                autoFocus
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="service">Service</label>
              <select
                id="service"
                className="form-control"
                value={form.service}
                onChange={(e) => handleChange('service', e.target.value)}
              >
                <option value="">Select Service</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.service && <p className="form-error">{errors.service}</p>}
            </div>

            <div className="form-group">
              <label>Severity</label>
              <div className="radio-group">
                {(['SEV1', 'SEV2', 'SEV3', 'SEV4'] as Severity[]).map((sev) => (
                  <label key={sev}>
                    <input
                      type="radio"
                      name="severity"
                      value={sev}
                      checked={form.severity === sev}
                      onChange={(e) => handleChange('severity', e.target.value)}
                    />
                    {sev}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                className="form-control"
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value as Status)}
              >
                <option value="">Select Status</option>
                <option value="OPEN">Open</option>
                <option value="MITIGATED">Mitigated</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              {errors.status && <p className="form-error">{errors.status}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="owner">Assigned To</label>
              <input
                id="owner"
                className="form-control"
                type="text"
                placeholder="Optional"
                value={form.owner || ''}
                onChange={(e) => handleChange('owner', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="summary">Summary</label>
              <textarea
                id="summary"
                className="form-control"
                placeholder="Describe the incident..."
                value={form.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Incident'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIncidentModal;
