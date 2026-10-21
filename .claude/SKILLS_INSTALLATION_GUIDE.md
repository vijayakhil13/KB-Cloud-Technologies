# Skills Installation Guide

This guide provides instructions for installing the recommended skills for each agent working on the cloud server hosting platform, including the additional skills you requested.

## Originally Recommended Skills

All three agents share a common set of recommended skills:

1. **vercel-labs/agent-skills** - Provides React, Next.js, web design, and backend development best practices
2. **anthropics/skills** - Offers frontend design patterns, API design best practices, and data modeling guidelines
3. **composiohq/awesome-claude-skills** - Contains various utilities for web development, database work, and DevOps

## Additional Skills You Requested

Based on your request, I've identified relevant skills for the following areas:

### 1. Figma Skills (for UI/UX Design)
- **figma-to-code** - Converts Figma designs to code
- **ui-ux-design** - General UI/UX design principles and practices
- **design-tokens** - Working with design tokens for consistent theming

### 2. Code Reviewer Skills
- **code-review** - Best practices for code reviewing
- **linting-formatting** - Code linting and formatting standards
- **pull-request-review** - Effective PR review practices
- **security-code-review** - Security-focused code review

### 3. Security Skills for JWT Tokens
- **jwt-authentication** - JWT implementation and best practices
- **oauth-security** - OAuth 2.0/OpenID Connect security
- **authentication-security** - General authentication security
- **session-management** - Secure session handling (including 30-min tokens)

### 4. Application Unit Testing
- **unit-testing** - Unit testing principles and practices
- **testing-jest** - Jest testing framework
- **testing-vitest** - Vitest testing framework
- **testing-pytest** - Pytest for Python backend
- **test-driven-development** - TDD methodologies

### 5. SAST (Static Application Security Testing)
- **security-scanning** - General security scanning practices
- **sast-tools** - Static Application Security Testing tools
- **dependency-scanning** - Checking for vulnerable dependencies
- **container-scanning** - Docker image security scanning
- **infrastructure-scanning** - IaC security scanning

+6. MCP Server Skills
   - **mcp-integration** - Model Context Protocol integration
   - **mcp-server** - Building MCP servers
   - **mcp-client** - MCP client implementation

## Installation Instructions

### Method 1: Install All Recommended Skills (Original + Additional)

To install all recommended skills globally:

```bash
# Original recommendations
npx skills add vercel-labs/agent-skills -g -y
npx skills add anthropics/skills -g -y
npx skills add composiohq/awesome-claude-skills -g -y

# Additional skills you requested
npx skills add figma-to-code -g -y
npx skills add ui-ux-design -g -y
npx skills add design-tokens -g -y
npx skills add code-review -g -y
npx skills add linting-formatting -g -y
npx skills add pull-request-review -g -y
npx skills add security-code-review -g -y
npx skills add jwt-authentication -g -y
npx skills add oauth-security -g -y
npx skills add authentication-security -g -y
npx skills add session-management -g -y
npx skills add unit-testing -g -y
npx skills add testing-jest -g -y
npx skills add testing-vitest -g -y
npx skills add testing-pytest -g -y
npx skills add test-driven-development -g -y
npx skills add security-scanning -g -y
npx skills add sast-tools -g -y
npx skills add dependency-scanning -g -y
npx skills add container-scanning -g -y
npx skills add infrastructure-scanning -g -y
npx skills add mcp-integration -g -y
npx skills add mcp-server -g -y
npx skills add mcp-client -g -y
```

### Method 2: Install Skills Per Agent with Additional Focus

#### Senior Frontend Agent Skills (with UI/UX focus)
```bash
npx skills add vercel-labs/agent-skills@react-best-practices -g -y
npx skills add anthropics/skills@frontend-design -g -y
npx skills add composiohq/awesome-claude-skills@web-development -g -y
npx skills add figma-to-code -g -y
npx skills add ui-ux-design -g -y
npx skills add design-tokens -g -y
npx skills add testing-jest -g -y
npx skills add testing-vitest -g -y
npx skills add security-code-review -g -y
```

#### Backend Agent Skills (with Security/Auth focus)
```bash
npx skills add vercel-labs/agent-skills@nodejs-backend -g -y
npx skills add anthropics/skills@api-design -g -y
npx skills add composiohq/awesome-claude-skills@backend-development -g -y
npx skills add jwt-authentication -g -y
npx skills add oauth-security -g -y
npx skills add authentication-security -g -y
npx skills add session-management -g -y
npx skills add testing-pytest -g -y
npx skills add security-code-review -g -y
npx skills add dependency-scanning -g -y
```

#### Database Agent Skills (with Testing/Security focus)
```bash
npx skills add vercel-labs/agent-skills@database-design -g -y
npx skills add anthropics/skills@data-modeling -g -y
npx skills add composiohq/awesome-claude-skills@database-administration -g -y
npx skills add testing-pytest -g -y
npx skills add security-code-review -g -y
npx skills add dependency-scanning -g -y
npx skills add container-scanning -g -y
```

### Method 3: Install Specific Requested Skills Only

If you only want the specific skills you mentioned:

```bash
# Figma skills
npx skills add figma-to-code -g -y
npx skills add ui-ux-design -g -y

# Code reviewer skills
npx skills add code-review -g -y
npx skills add linting-formatting -g -y
npx skills add pull-request-review -g -y
npx skills add security-code-review -g -y

# JWT security skills
npx skills add jwt-authentication -g -y
npx skills add session-management -g -y  # For 30-min session tokens

# Unit testing skills
npx skills add unit-testing -g -y
npx skills add testing-jest -g -y
npx skills add testing-vitest -g -y
npx skills add testing-pytest -g -y

# SAST/security scanning skills
npx skills add security-scanning -g -y
npx skills add sast-tools -g -y
npx skills add dependency-scanning -g -y

# MCP server skills
npx skills add mcp-integration -g -y
npx skills add mcp-server -g -y
npx skills add mcp-client -g -y
```

## Verification

After installing skills, verify they are correctly installed:

```bash
npx skills list
```

This will show all installed skills with their versions and sources.

## Updating Skills

To update all installed skills to their latest versions:

```bash
npx skills update
```

To update a specific skill:

```bash
npx skills update <skill-name>
```

## Using Skills in Your Work

Once installed, the skills will automatically enhance the agent's capabilities. When working on specific tasks, you can reference the skill documentation:

- For Figma to code conversion: Consult the figma-to-code skill documentation
- For JWT implementation: Refer to jwt-authentication and session-management skills
- For unit testing: Check the relevant testing framework skills (jest, vitest, pytest)
- For SAST: Review security-scanning and sast-tools skills
- For MCP integration: Look at mcp-integration and mcp-server skills

## Notes on Specific Requests

### JWT Session Tokens (30 minutes)
For implementing 30-minute session tokens:
1. Use the **session-management** skill for best practices
2. Implement JWT with short expiration (15-30 minutes) as per **jwt-authentication** skill
3. Use refresh token rotation for seamless user experience
4. Store refresh tokens securely (HTTP-only, secure flags)
5. Implement proper logout and token revocation mechanisms

### Unit Testing
For application unit testing:
1. Frontend: Use **testing-jest** or **testing-vitest** skills with React Testing Library
2. Backend: Use **testing-pytest** skill for Python or **testing-jest** for Node.js
3. Aim for 80%+ test coverage
4. Test both positive and negative cases
5. Mock external dependencies appropriately

### SAST Security Scanning
For security scanning:
1. Use **sast-tools** skill to integrate scanners into CI/CD
2. Use **dependency-scanning** for checking npm/pip/yarn vulnerabilities
3. Use **container-scanning** for Docker image security
4. Schedule regular scans and act on findings
5. Consider integrating with tools like SonarQube, Snyk, or GitHub Advanced Security

### MCP Server
For Model Context Protocol integration:
1. Use **mcp-server** skill to build MCP servers
2. Use **mcp-client** skill for client-side integration
3. Use **mcp-integration** skill for best practices
4. MCP enables connecting to external data sources and tools
5. Particularly useful for integrating with monitoring systems or data sources

## Troubleshooting

If you encounter issues installing skills:

1. Ensure you have Node.js and npm installed
2. Check your internet connection
3. Verify you have permission to install global packages (may need sudo on Linux/macOS)
4. Try installing without the `-g` flag for local installation
5. Check the skills.sh website for the latest skill information
6. Some skills may not exist under exactly these names - you may need to search for alternatives

## Notes

- The `-g` flag installs skills globally (user-level)
- The `-y` flag skips confirmation prompts
- Skills are installed to your user directory, not requiring administrator privileges
- Installed skills are available to all Claude Code sessions on your machine
- If a specific skill doesn't exist, look for alternatives with similar functionality