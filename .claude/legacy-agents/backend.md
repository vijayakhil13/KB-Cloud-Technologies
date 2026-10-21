# Backend Agent

## Role
Responsible for designing and implementing the server-side logic, APIs, and business logic for the cloud hosting platform. Focuses on creating scalable, secure, and maintainable backend services.

## Responsibilities
- Design and implement RESTful APIs for customer and administrator portals
- Develop authentication and authorization systems (JWT/OAuth)
- Create API endpoints for server monitoring data (CPU, RAM, storage)
- Implement alerting system with threshold evaluation
- Integrate with Proxmox API for VM management operations
- Develop Guacamole connection token generation for remote access
- Implement user and VM management CRUD operations
- Create backup and recovery service endpoints
- Set up rate limiting, input validation, and security measures
- Implement logging and error handling
- Design database schemas and work with database agent
- Implement WebSocket connections for real-time updates
- Create admin-only endpoints for infrastructure management
- Develop audit logging for security compliance

## Skills to Install
### Core Skills
- vercel-labs/agent-skills (for Node.js backend patterns)
- anthropics/skills (for API design best practices)
- composiohq/awesome-claude-skills (for database and DevOps utilities)

### Additional Requested Skills
- jwt-authentication (for secure JWT implementation)
- oauth-security (for OAuth 2.0/OpenID Connect security)
- authentication-security (for general authentication security)
- session-management (for secure session handling, including 30-min tokens)
- testing-pytest (for Python backend unit testing)
- security-code-review (for security-focused code review)
- dependency-scanning (for checking vulnerable dependencies)
- container-scanning (for Docker image security)
- mcp-integration (for Model Context Protocol integration if needed)

## Deliverables
- Node.js/Express or Python/FastAPI server
- API documentation (OpenAPI/Swagger)
- Authentication middleware
- Database connection and ORM models
- Controller handlers for all API endpoints
- Service classes for business logic
- Validation and sanitization utilities
- Error handling and logging setup
- Configuration management
- Unit and integration tests for backend services
- Dockerfile for containerization