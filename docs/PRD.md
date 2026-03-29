Product Requirement Document (PRD)
Product Name
Dynamic Configuration Server

1. Purpose & Vision
Modern applications require frequent configuration changes based on environment, client type, location, or application version. Restarting applications or redeploying code for every configuration update is inefficient and risky.
The Dynamic Configuration Server aims to provide a centralized, real-time, and secure configuration management system that delivers the right configuration to the right client at the right time—without downtime.

2. Problem Statement
Configurations are often hard-coded or scattered across services.


Updating configs usually requires redeployments.


Managing different environments (dev, staging, prod) is error-prone.


Client-specific or location-based overrides are difficult to maintain.


No real-time propagation of configuration changes.



3. Goals & Objectives
Primary Goals
Centralize configuration management


Support dynamic, real-time configuration updates


Enable hierarchical configuration overrides


Separate configurations across environments


Ensure configuration validation before deployment


Success Metrics
Zero downtime during configuration updates


Reduced deployment frequency for config-only changes


Accurate delivery of client-specific configurations


Fast propagation of configuration changes



4. Target Users
Backend Developers


DevOps Engineers


Platform Engineers


Teams managing multi-environment or multi-tenant applications



5. Key Features
5.1 Client-Specific Configuration Delivery
Serve configurations based on:


Application version


Client ID


Location (country/region)


Environment (dev/staging/prod)



5.2 Hierarchical Configuration Management
Configurations follow a layered priority system:
Global configuration


Environment-level configuration


Location-based configuration


Client-specific overrides


More specific configurations override general ones.

5.3 Real-Time Configuration Updates
Node.js monitors configuration changes


Connected clients receive updates instantly


No application restart required



5.4 Configuration Validation
Shell scripts validate:


Schema correctness


Required fields


Invalid or unsafe values


Invalid configurations are blocked from deployment



5.5 Environment Isolation via Git
Git branches represent environments:


dev


staging


production


Ensures safe testing before production rollout



5.6 File Change Detection
Unix File Watch APIs detect:


Local configuration file updates


Automatically triggers validation and deployment pipeline



6. Functional Requirements
FR-1: Configuration Fetch API
System shall expose an API to fetch configuration


Input: client metadata (version, location, client ID)


Output: resolved configuration JSON



FR-2: Configuration Storage
MongoDB shall store configurations in hierarchical format


Support versioning and metadata



FR-3: Override Resolution
System shall merge configurations based on priority rules


Latest and most specific config must take precedence



FR-4: Live Update Propagation
System shall notify connected clients when configuration changes


Support WebSockets or long polling



FR-5: Validation Before Deployment
System shall validate configurations before activation


Failed validation must stop deployment



7. Non-Functional Requirements
Performance
Configuration fetch response < 200ms


Real-time update latency < 2 seconds


Scalability
Support thousands of concurrent clients


Horizontal scalability via stateless APIs


Reliability
No downtime during configuration changes


Config rollback supported via Git


Security
Only authorized clients can access configurations


Environment-level access control



8. System Architecture Overview
Backend Components
Express.js – API layer for serving configurations


MongoDB – Configuration storage


Node.js Watcher – Detects and propagates changes


Shell Scripts – Configuration validation


Git – Environment management


Unix File Watch API – Local file change detection



9. Example Use Case
Use Case: SaaS Application Configuration
Global API timeout: 30s


India region timeout: 25s


Enterprise client timeout: 20s


When an enterprise client from India requests configuration:
Server resolves and sends 20s timeout


If admin updates timeout:
Change is validated


Pushed instantly to all connected apps



10. Competitive Reference
This system is conceptually similar to:
Enterprise configuration management solutions


Distributed configuration servers used in microservices architectures


However, this project demonstrates a custom-built, lightweight, and extensible solution.

11. Risks & Mitigation
Risk
Mitigation
Invalid config deployment
Pre-deployment validation
Environment mix-up
Git branch isolation
Performance bottlenecks
Caching & stateless APIs
Config corruption
Versioning & rollback


12. Future Enhancements
Role-based access control (RBAC)


UI dashboard for configuration management


Audit logs for config changes


Encryption for sensitive configuration values


Multi-region replication



13. Conclusion
The Dynamic Configuration Server provides a robust, scalable, and real-time solution for managing application configurations across environments and clients. It reduces operational risk, improves deployment speed, and aligns with modern DevOps and microservices practices.

