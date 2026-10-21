# Cloud Server Hosting Platform - Agent Configuration

This file coordinates the work of specialized agents for building the cloud server hosting platform.

## Agent System

This project uses three specialized agents working in parallel:
1. **Senior Frontend Agent** - Handles UI/UX, customer/admin dashboards, and frontend implementation
2. **Backend Agent** - Handles server-side logic, APIs, authentication, and business logic  
3. **Database Agent** - Handles data persistence, schema design, and optimization

## Workflow

Agents follow this process:
1. **Planning Phase** - Each agent creates their plan in their respective .md files
2. **Implementation Phase** - Agents work in parallel on their assigned components
3. **Integration Phase** - Agents coordinate to ensure components work together
4. **Review Phase** - Agents review each other's work for consistency and quality

## Communication

Agents communicate through:
- Shared understanding of API contracts (defined in backend agent's plan)
- Database schema definitions (defined in database agent's plan)
- UI component specifications (defined in frontend agent's plan)
- Regular updates in this file and agent-specific .md files

## Skill Installation

Before beginning work, each agent should install their recommended skills:
- Senior Frontend Agent: vercel-labs/agent-skills, anthropics/skills, composiohq/awesome-claude-skills
- Backend Agent: vercel-labs/agent-skills, anthropics/skills, composiohq/awesome-claude-skills
- Database Agent: vercel-labs/agent-skills, anthropics/skills, composiohq/awesome-claude-skills

## Parallel Execution

Agents are designed to work in parallel on their respective domains while maintaining loose coupling through well-defined interfaces:
- Frontend ↔ Backend: REST API contracts
- Backend ↔ Database: Schema definitions and query patterns
- Frontend ↔ Database: Indirect through backend (no direct database access)

## Deliverables Tracking

Each agent maintains their progress in:
- .claude/agents/[agent-name]/planning.md - What they plan to build
- .claude/agents/[agent-name]/progress.md - What they've completed
- .claude/agents/[agent-name]/tasks.md - Current work items