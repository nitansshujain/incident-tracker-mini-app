package com.incidenttracker.repository;

import com.incidenttracker.entity.Incident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, UUID> {

    @Query("SELECT i FROM Incident i WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(i.owner) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:service IS NULL OR :service = '' OR i.service = :service) " +
           "AND (:severity IS NULL OR i.severity = :severity) " +
           "AND (:status IS NULL OR i.status = :status)")
    Page<Incident> findWithFilters(
            @Param("search") String search,
            @Param("service") String service,
            @Param("severity") Incident.Severity severity,
            @Param("status") Incident.Status status,
            Pageable pageable
    );
}
