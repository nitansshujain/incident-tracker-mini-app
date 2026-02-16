package com.incidenttracker.service;

import com.incidenttracker.dto.CreateIncidentRequest;
import com.incidenttracker.dto.IncidentResponse;
import com.incidenttracker.dto.UpdateIncidentRequest;
import com.incidenttracker.entity.Incident;
import com.incidenttracker.exception.ResourceNotFoundException;
import com.incidenttracker.repository.IncidentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    @Transactional
    public IncidentResponse createIncident(CreateIncidentRequest request) {
        Incident incident = new Incident();
        incident.setTitle(request.getTitle());
        incident.setService(request.getService());
        incident.setSeverity(request.getSeverity());
        incident.setStatus(request.getStatus());
        incident.setOwner(request.getOwner());
        incident.setSummary(request.getSummary());

        Incident saved = incidentRepository.save(incident);
        return IncidentResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<IncidentResponse> getIncidents(
            String search,
            String service,
            String severity,
            String status,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        // Validate and set defaults
        if (size < 1) size = 10;
        if (size > 100) size = 100;
        if (page < 0) page = 0;

        // Validate sortBy field
        String validSortBy = switch (sortBy != null ? sortBy : "createdAt") {
            case "title", "service", "severity", "status", "owner", "createdAt", "updatedAt" -> sortBy;
            default -> "createdAt";
        };

        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(validSortBy).ascending()
                : Sort.by(validSortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // Parse enums safely
        Incident.Severity severityEnum = parseEnum(Incident.Severity.class, severity);
        Incident.Status statusEnum = parseEnum(Incident.Status.class, status);

        Page<Incident> incidents = incidentRepository.findWithFilters(
                search, service, severityEnum, statusEnum, pageable
        );

        return incidents.map(IncidentResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public IncidentResponse getIncidentById(UUID id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));
        return IncidentResponse.fromEntity(incident);
    }

    @Transactional
    public IncidentResponse updateIncident(UUID id, UpdateIncidentRequest request) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));

        if (request.getTitle() != null) {
            incident.setTitle(request.getTitle());
        }
        if (request.getService() != null) {
            incident.setService(request.getService());
        }
        if (request.getSeverity() != null) {
            incident.setSeverity(request.getSeverity());
        }
        if (request.getStatus() != null) {
            incident.setStatus(request.getStatus());
        }
        if (request.getOwner() != null) {
            incident.setOwner(request.getOwner());
        }
        if (request.getSummary() != null) {
            incident.setSummary(request.getSummary());
        }

        Incident updated = incidentRepository.save(incident);
        return IncidentResponse.fromEntity(updated);
    }

    private <T extends Enum<T>> T parseEnum(Class<T> enumClass, String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Enum.valueOf(enumClass, value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
