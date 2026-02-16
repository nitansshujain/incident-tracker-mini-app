package com.incidenttracker.config;

import com.incidenttracker.entity.Incident;
import com.incidenttracker.repository.IncidentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Configuration
public class DataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private static final String[] SERVICES = {
            "Auth", "Payments", "Backend", "Frontend", "Database",
            "API Gateway", "Notifications", "Search", "Analytics", "CDN"
    };

    private static final String[] OWNERS = {
            "alice@team.com", "bob@team.com", "charlie@team.com",
            "dev@team.com", "ops@team.com", "jason@team.com",
            "amy@team.com", "sarah@team.com", "mike@team.com",
            "david@team.com"
    };

    private static final String[] TITLE_PREFIXES = {
            "Login Failure", "Payment Delay", "API Timeout", "UI Bug on Dashboard",
            "Database Issue", "Service Degradation", "Memory Leak", "CPU Spike",
            "Deployment Failure", "SSL Certificate Expiry", "DNS Resolution Failure",
            "Rate Limiting Triggered", "Cache Invalidation Bug", "Data Sync Error",
            "Connection Pool Exhaustion", "Disk Space Alert", "Health Check Failure",
            "Latency Spike", "Error Rate Increase", "Webhook Delivery Failure",
            "Queue Backlog", "Configuration Drift", "Permission Denied Error",
            "Session Timeout Issue", "CORS Policy Violation", "Schema Migration Failure",
            "Load Balancer Misconfiguration", "Circuit Breaker Tripped",
            "Deadlock Detected", "Retry Storm"
    };

    private static final String[] SUMMARIES = {
            "API requests to the backend service were timing out, causing disruptions for users.",
            "Users reported intermittent failures when attempting to log in via SSO.",
            "Payment processing experienced significant delays during peak hours.",
            "Dashboard widgets failed to render correctly on mobile devices.",
            "Database connection pool was exhausted leading to query timeouts.",
            "Service response times degraded to unacceptable levels after deployment.",
            "Memory usage on production pods exceeded 90%% threshold.",
            "CPU utilization spiked to 100%% on multiple nodes simultaneously.",
            "Automated deployment pipeline failed during the rollout phase.",
            "SSL certificate renewal was missed causing secure connections to fail.",
            "DNS records were not properly propagated after infrastructure changes.",
            "Rate limiting was incorrectly applied to authenticated API requests.",
            "Cache entries were not being properly invalidated after data updates.",
            "Data replication lag between primary and replica databases increased.",
            "Connection pool reached maximum capacity during high traffic period.",
            "Server disk space reached critical threshold on production environment.",
            "Health check endpoint started returning 5xx errors intermittently.",
            "P99 latency increased from 200ms to 2000ms on critical API endpoints.",
            "Error rate exceeded the 1%% threshold across multiple services.",
            "Webhook deliveries to partner systems were failing silently."
    };

    @Bean
    CommandLineRunner seedData(IncidentRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                log.info("Database already seeded with {} incidents. Skipping.", repository.count());
                return;
            }

            log.info("Seeding database with 200 incident records...");
            Random random = new Random(42); // Fixed seed for reproducible data
            List<Incident> incidents = new ArrayList<>();

            for (int i = 0; i < 200; i++) {
                String title = TITLE_PREFIXES[random.nextInt(TITLE_PREFIXES.length)]
                        + " #" + (i + 1);
                String service = SERVICES[random.nextInt(SERVICES.length)];
                Incident.Severity severity = Incident.Severity.values()[random.nextInt(4)];
                Incident.Status status = Incident.Status.values()[random.nextInt(3)];
                String owner = random.nextDouble() > 0.15
                        ? OWNERS[random.nextInt(OWNERS.length)]
                        : null;
                String summary = random.nextDouble() > 0.1
                        ? SUMMARIES[random.nextInt(SUMMARIES.length)]
                        : null;

                Incident incident = new Incident(title, service, severity, status, owner, summary);
                incidents.add(incident);
            }

            repository.saveAll(incidents);
            log.info("Successfully seeded {} incidents.", incidents.size());
        };
    }
}
