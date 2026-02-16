package com.incidenttracker.controller;

import com.incidenttracker.dto.CreateIncidentRequest;
import com.incidenttracker.dto.IncidentResponse;
import com.incidenttracker.dto.UpdateIncidentRequest;
import com.incidenttracker.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    /**
     * POST /api/incidents - Create a new incident
     */
    @PostMapping
    public ResponseEntity<IncidentResponse> createIncident(
            @Valid @RequestBody CreateIncidentRequest request
    ) {
        IncidentResponse response = incidentService.createIncident(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/incidents - List incidents with pagination, filtering, sorting, and search
     */
    @GetMapping
    public ResponseEntity<Page<IncidentResponse>> getIncidents(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "") String service,
            @RequestParam(required = false, defaultValue = "") String severity,
            @RequestParam(required = false, defaultValue = "") String status,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDir
    ) {
        Page<IncidentResponse> incidents = incidentService.getIncidents(
                search, service, severity, status, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(incidents);
    }

    /**
     * GET /api/incidents/:id - Get incident by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable UUID id) {
        IncidentResponse response = incidentService.getIncidentById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/incidents/:id - Update an incident
     */
    @PatchMapping("/{id}")
    public ResponseEntity<IncidentResponse> updateIncident(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateIncidentRequest request
    ) {
        IncidentResponse response = incidentService.updateIncident(id, request);
        return ResponseEntity.ok(response);
    }
}
