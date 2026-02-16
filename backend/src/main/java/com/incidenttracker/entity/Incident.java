package com.incidenttracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "incidents", indexes = {
    @Index(name = "idx_incident_service", columnList = "service"),
    @Index(name = "idx_incident_severity", columnList = "severity"),
    @Index(name = "idx_incident_status", columnList = "status"),
    @Index(name = "idx_incident_created_at", columnList = "createdAt"),
    @Index(name = "idx_incident_title", columnList = "title")
})
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Service is required")
    @Size(max = 100, message = "Service must not exceed 100 characters")
    @Column(nullable = false)
    private String service;

    @NotNull(message = "Severity is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Severity severity;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Size(max = 200, message = "Owner must not exceed 200 characters")
    private String owner;

    @Size(max = 2000, message = "Summary must not exceed 2000 characters")
    @Column(length = 2000)
    private String summary;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Incident() {}

    public Incident(String title, String service, Severity severity, Status status, String owner, String summary) {
        this.title = title;
        this.service = service;
        this.severity = severity;
        this.status = status;
        this.owner = owner;
        this.summary = summary;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum Severity {
        SEV1, SEV2, SEV3, SEV4
    }

    public enum Status {
        OPEN, MITIGATED, RESOLVED
    }
}
