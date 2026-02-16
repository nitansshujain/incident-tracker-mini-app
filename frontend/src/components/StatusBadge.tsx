import React from 'react';
import { Status, Severity } from '../types/incident';

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const className = `badge badge-${status.toLowerCase()}`;
  return <span className={className}>{status}</span>;
};

interface SeverityBadgeProps {
  severity: Severity;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const className = `badge badge-${severity.toLowerCase()}`;
  return <span className={className}>{severity}</span>;
};
