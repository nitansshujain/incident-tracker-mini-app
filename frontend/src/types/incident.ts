export type Severity = 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';
export type Status = 'OPEN' | 'MITIGATED' | 'RESOLVED';

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: Status;
  owner: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CreateIncidentPayload {
  title: string;
  service: string;
  severity: Severity;
  status: Status;
  owner?: string;
  summary?: string;
}

export interface UpdateIncidentPayload {
  title?: string;
  service?: string;
  severity?: Severity;
  status?: Status;
  owner?: string;
  summary?: string;
}

export interface IncidentFilters {
  search: string;
  service: string;
  severity: string;
  status: string;
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}
