import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchIncidents, createIncident } from '../api/incidentApi';
import { Incident, IncidentFilters, PageResponse, CreateIncidentPayload } from '../types/incident';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import CreateIncidentModal from '../components/CreateIncidentModal';
import { useDebounce } from '../hooks/useDebounce';

const SERVICES = ['Auth', 'Payments', 'Backend', 'Frontend', 'Database', 'API Gateway', 'Notifications', 'Search', 'Analytics', 'CDN'];

const IncidentList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL params
  const getInitialFilters = (): IncidentFilters => ({
    search: searchParams.get('search') || '',
    service: searchParams.get('service') || '',
    severity: searchParams.get('severity') || '',
    status: searchParams.get('status') || '',
    page: parseInt(searchParams.get('page') || '0', 10),
    size: parseInt(searchParams.get('size') || '10', 10),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortDir: (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc',
  });

  const [filters, setFilters] = useState<IncidentFilters>(getInitialFilters);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [data, setData] = useState<PageResponse<Incident> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync debounced search to filters
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 0 }));
  }, [debouncedSearch]);

  // Sync filters to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.service) params.service = filters.service;
    if (filters.severity) params.severity = filters.severity;
    if (filters.status) params.status = filters.status;
    if (filters.page > 0) params.page = String(filters.page);
    if (filters.size !== 10) params.size = String(filters.size);
    if (filters.sortBy !== 'createdAt') params.sortBy = filters.sortBy;
    if (filters.sortDir !== 'desc') params.sortDir = filters.sortDir;
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Fetch data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchIncidents(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load incidents');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSort = (column: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: column,
      sortDir: prev.sortBy === column && prev.sortDir === 'asc' ? 'desc' : 'asc',
      page: 0,
    }));
  };

  const handleFilterChange = (field: keyof IncidentFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 0 }));
  };

  const handleCreateIncident = async (payload: CreateIncidentPayload) => {
    await createIncident(payload);
    setShowCreateModal(false);
    setToast({ message: 'Incident created successfully!', type: 'success' });
    setFilters((prev) => ({ ...prev, page: 0 }));
    loadData();
  };

  const getSortIndicator = (column: string): string => {
    if (filters.sortBy !== column) return '↕';
    return filters.sortDir === 'asc' ? '↑' : '↓';
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const renderSortHeader = (column: string, label: string) => (
    <th
      onClick={() => handleSort(column)}
      className={filters.sortBy === column ? 'active-sort' : ''}
    >
      {label}
      <span className="sort-indicator">{getSortIndicator(column)}</span>
    </th>
  );

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Incident Tracker</h2>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            + New Incident
          </button>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <label>Service</label>
            <select
              className="form-control"
              value={filters.service}
              onChange={(e) => handleFilterChange('service', e.target.value)}
            >
              <option value="">All Services</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Severity</label>
            <div className="severity-checkboxes">
              {['SEV1', 'SEV2', 'SEV3', 'SEV4'].map((sev) => (
                <label key={sev}>
                  <input
                    type="checkbox"
                    checked={filters.severity === sev}
                    onChange={() =>
                      handleFilterChange('severity', filters.severity === sev ? '' : sev)
                    }
                  />
                  {sev}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              className="form-control"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="MITIGATED">Mitigated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Search</label>
            <input
              className="form-control search-input"
              type="text"
              placeholder="Search by title or owner..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="filter-group" style={{ alignSelf: 'flex-end' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setFilters({
                  search: '',
                  service: '',
                  severity: '',
                  status: '',
                  page: 0,
                  size: 10,
                  sortBy: 'createdAt',
                  sortDir: 'desc',
                });
                setSearchInput('');
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading incidents...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button className="btn btn-primary btn-sm" onClick={loadData}>
                Retry
              </button>
            </div>
          ) : data && data.content.length === 0 ? (
            <div className="empty-state">
              <p>No incidents found.</p>
              <p style={{ fontSize: '0.85rem' }}>Try adjusting your filters or create a new incident.</p>
            </div>
          ) : (
            <table className="incident-table">
              <thead>
                <tr>
                  {renderSortHeader('title', 'Title')}
                  {renderSortHeader('service', 'Service')}
                  {renderSortHeader('severity', 'Severity')}
                  {renderSortHeader('status', 'Status')}
                  {renderSortHeader('createdAt', 'Created At')}
                  {renderSortHeader('owner', 'Owner')}
                </tr>
              </thead>
              <tbody>
                {data?.content.map((incident) => (
                  <tr
                    key={incident.id}
                    onClick={() => navigate(`/incidents/${incident.id}`)}
                  >
                    <td style={{ fontWeight: 500 }}>{incident.title}</td>
                    <td>{incident.service}</td>
                    <td><SeverityBadge severity={incident.severity} /></td>
                    <td><StatusBadge status={incident.status} /></td>
                    <td>{formatDate(incident.createdAt)}</td>
                    <td className="text-truncate">{incident.owner || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {data && data.totalPages > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ paddingLeft: '1.5rem', paddingTop: '0.5rem' }}>
              <select
                className="form-control"
                style={{ width: 'auto', display: 'inline-block', minWidth: '70px' }}
                value={filters.size}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                per page
              </span>
            </div>
            <Pagination
              currentPage={data.number}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              pageSize={data.size}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateIncidentModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateIncident}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default IncidentList;
