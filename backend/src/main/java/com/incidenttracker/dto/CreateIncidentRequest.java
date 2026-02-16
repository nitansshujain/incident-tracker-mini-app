package com.incidenttracker.dto;

import com.incidenttracker.entity.Incident;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateIncidentRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @NotBlank(message = "Service is required")
    @Size(max = 100, message = "Service must not exceed 100 characters")
    private String service;

    @NotNull(message = "Severity is required")
    private Incident.Severity severity;

    @NotNull(message = "Status is required")
    private Incident.Status status;

    @Size(max = 200, message = "Owner must not exceed 200 characters")
    private String owner;

    @Size(max = 2000, message = "Summary must not exceed 2000 characters")
    private String summary;

    public CreateIncidentRequest() {}

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
}
