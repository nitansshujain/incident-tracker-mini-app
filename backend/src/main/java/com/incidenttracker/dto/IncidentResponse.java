package com.incidenttracker.dto;

import com.incidenttracker.entity.Incident;

import java.time.LocalDateTime;
import java.util.UUID;

public class IncidentResponse {

    private UUID id;
    private String title;
    private String service;
    private Incident.Severity severity;
    private Incident.Status status;
    private String owner;
    private String summary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public IncidentResponse() {}

    public static IncidentResponse fromEntity(Incident incident) {
        IncidentResponse response = new IncidentResponse();
        response.setId(incident.getId());
        response.setTitle(incident.getTitle());
        response.setService(incident.getService());
        response.setSeverity(incident.getSeverity());
        response.setStatus(incident.getStatus());
        response.setOwner(incident.getOwner());
        response.setSummary(incident.getSummary());
        response.setCreatedAt(incident.getCreatedAt());
        response.setUpdatedAt(incident.getUpdatedAt());
        return response;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public Incident.Severity getSeverity() { return severity; }
    public void setSeverity(Incident.Severity severity) { this.severity = severity; }

    public Incident.Status getStatus() { return status; }
    public void setStatus(Incident.Status status) { this.status = status; }

    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
