# Claude Code Planning Commands

A comprehensive set of commands for systematic feature development with Claude Code, featuring dynamic codebase analysis and local-first JSON-based planning.

## Overview

These commands provide a structured workflow for developing features with Claude Code, replacing hardcoded project detection with intelligent LLM-based codebase analysis. The system creates local JSON files that track your project's planning and execution, enabling offline-first development and version-controlled planning data.

## Core Philosophy

- **Dynamic Discovery**: LLM analyzes your codebase to understand patterns, architecture, and conventions
- **Local-First**: All planning data stored as JSON files alongside your code
- **Context-Driven**: Tasks are created based on actual codebase analysis, not assumptions
- **Incremental**: Add tasks as you discover new requirements during implementation
- **Priority-Focused**: Organize work by user impact and dependencies, not time estimates

## Command Workflow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   plan-problem  │───▶│  plan-technical │───▶│   plan-tasks    │
│                 │    │                 │    │                 │
│ Define users &  │    │ Design arch &   │    │ Break down into │
│ problem scope   │    │ tech approach   │    │ actionable tasks│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌─────────────────┐    ┌─────────────────┐
                       │    add-task     │◀───┤                 │
                       │                 │    │                 │
                       │ Add discovered  │    │                 │
                       │ tasks during    │    │                 │
                       │ implementation  │    │                 │
                       └─────────────────┘    │                 │
                                              │                 │
                       ┌─────────────────┐    │                 │
                       │     execute     │◀───┘                 │
                       │                 │                      │
                       │ Implement       │                      │
                       │ individual      │                      │
                       │ tasks           │                      │
                       └─────────────────┘                      │
```

## Commands

### 1. plan-problem

**Purpose**: Define the problem statement, users, and success criteria

**Usage**: `plan-problem <feature-name>`

**Creates**: `.codeloops/<feature-name>/problem.json`

**What it does**:

- Creates project directory structure
- Defines problem statement and business context
- Identifies user personas and their goals
- Sets success criteria and constraints

**Example**:

```bash
plan-problem user-authentication
```

### 2. plan-technical

**Purpose**: Design technical approach and architecture

**Usage**: `plan-technical <feature-name>`

**Creates**: `.codeloops/<feature-name>/technical.json`

**What it does**:

- Analyzes existing codebase patterns dynamically
- Designs data models and API endpoints
- Selects appropriate technology stack
- Defines security and integration approaches

**Key Feature**: Uses LLM-based codebase analysis instead of hardcoded project type detection

### 3. plan-tasks

**Purpose**: Break down feature into actionable tasks

**Usage**: `plan-tasks <feature-name>`

**Creates**: `.codeloops/<feature-name>/tasks.json`

**What it does**:

- Performs comprehensive codebase analysis
- Creates detailed task breakdown with all required fields
- Sets priorities (P0/P1/P2) and dependencies
- Includes acceptance criteria and scope boundaries

**Key Feature**: Consolidated task creation with dynamic discovery

### 4. add-task

**Purpose**: Add new tasks discovered during implementation

**Usage**: `add-task <feature-name> "<task-title>" [priority]`

**Updates**: `.codeloops/<feature-name>/tasks.json`

**What it does**:

- Adds tasks discovered during implementation
- Maintains consistent task structure
- Auto-generates sequential task IDs
- Preserves existing project context

**Examples**:

```bash
add-task user-auth "Add password validation" P1
add-task user-auth "Setup test database" P0
```

### 5. execute

**Purpose**: Implement individual tasks with full context

**Usage**: `execute <feature-name> [task-id]`

**What it does**:

- Provides comprehensive implementation context
- Requires codebase analysis before coding
- Updates task status during implementation
- Maintains git workflow integration

## Dynamic Codebase Analysis

All commands now use **LLM-based dynamic discovery** instead of hardcoded patterns. The LLM analyzes:

### Project Structure & Patterns

- Programming language and version
- Framework/runtime (Express, React, FastAPI, Django, etc.)
- Project type (web app, API service, CLI tool, library)
- File organization patterns (monorepo, microservices, MVC, clean architecture)
- Directory structure and naming conventions

### Architecture & Design Patterns

- API patterns (REST, GraphQL, gRPC)
- Authentication/authorization patterns
- Data access patterns (ORM, query builders, raw queries)
- Dependency injection patterns
- Error handling and validation patterns
- Testing patterns and frameworks

### Infrastructure & Tooling

- Database type and ORM/ODM
- Build tools and package managers
- Configuration management patterns
- Deployment and containerization
- Monitoring and logging patterns

## Task Structure

Each task includes comprehensive specifications:

```json
{
  "id": "T1",
  "title": "Implement user authentication API",
  "description": "Create JWT-based authentication endpoints",
  "priority": "P0",
  "status": "pending",
  "userStory": "As a user, I want to log in securely, so that I can access protected features",
  "levelOfEffort": 3,
  "contextAnalysis": {
    "whatExists": ["Express server", "Database connection"],
    "whatsMissing": ["Auth middleware", "JWT handling", "Password hashing"]
  },
  "fileStructureChanges": {
    "newFiles": ["src/auth/authController.ts", "src/middleware/auth.ts"],
    "modifiedFiles": ["src/routes/index.ts", "src/types/user.ts"],
    "movedFiles": []
  },
  "implementationDetails": {
    "files": ["src/auth/authController.ts"],
    "functions": ["login", "register", "validateToken"],
    "apiEndpoints": ["/api/auth/login", "/api/auth/register"],
    "databaseChanges": ["users table password_hash column"]
  },
  "technicalSpecifications": "Use bcrypt for password hashing, JWT for tokens",
  "implementationConstraints": ["Do not modify existing user schema", "Maintain backward compatibility"],
  "externalDependencies": ["bcrypt", "jsonwebtoken"],
  "integrationPoints": ["User service", "Database layer"],
  "acceptanceCriteria": ["Login returns valid JWT", "Invalid credentials rejected", "Token validates correctly"],
  "successDefinition": "Users can authenticate and receive working JWT tokens",
  "outOfScope": ["Password reset", "Social login", "Multi-factor auth"],
  "dependencies": [],
  "createdDate": "2024-01-01T00:00:00.000Z",
  "updatedDate": "2024-01-01T00:00:00.000Z"
}
```

## File Structure

Each feature creates a structured directory:

```
.codeloops/
└── <feature-name>/
    ├── problem.json     # Problem definition & users
    ├── technical.json   # Technical approach & architecture
    └── tasks.json       # Task breakdown & tracking
```

## Example Workflow

```bash
# 1. Define the problem and users
plan-problem user-authentication

# 2. Design technical approach (analyzes your codebase)
plan-technical user-authentication

# 3. Break down into tasks (creates comprehensive task list)
plan-tasks user-authentication

# 4. Start implementing tasks
execute user-authentication T1

# 5. Add tasks discovered during implementation
add-task user-authentication "Add rate limiting" P1

# 6. Continue implementing
execute user-authentication T2
```

## Benefits

### For Development Teams

- **Systematic Planning**: Structured approach to feature development
- **Context Preservation**: All planning data versioned with code
- **Dynamic Adaptation**: Add tasks as requirements evolve
- **Priority Management**: Focus on user impact, not arbitrary deadlines

### For Claude Code Integration

- **Intelligent Analysis**: LLM understands your specific codebase patterns
- **Consistent Quality**: Tasks include comprehensive specifications
- **Reduced Context Loss**: All project context preserved in JSON files
- **Offline Capability**: No dependency on external services

### For Code Quality

- **Pattern Consistency**: Follow existing codebase conventions
- **Scope Control**: Clear boundaries prevent feature creep
- **Integration Awareness**: Understand impact on existing systems
- **Testable Outcomes**: Specific acceptance criteria for each task

## Key Improvements

### From Previous Approach

- ✅ **Dynamic Discovery**: Replaced hardcoded project detection with LLM analysis
- ✅ **Consolidated Commands**: Streamlined task creation process
- ✅ **Comprehensive Tasks**: All required fields included from start
- ✅ **Better Integration**: Clear workflow between commands
- ✅ **Incremental Planning**: Add tasks during implementation

### Technical Advantages

- **JSON-Based**: Machine-readable planning data
- **Version Controlled**: Planning tracked in git with code
- **Local-First**: No external dependencies
- **Extensible**: Easy to add new fields and capabilities
- **Searchable**: Find tasks by priority, status, dependencies

## Best Practices

1. **Complete Each Phase**: Don't skip problem or technical planning
2. **Analyze Before Coding**: Always perform codebase analysis
3. **Small Batches**: Keep tasks small, focused and narrow to increase the likelihood of success.
4. **Clear Scope**: Define what's explicitly out of scope
5. **Update Status**: Keep task status current during implementation
6. **Version Control**: Commit planning files with feature branches

## Troubleshooting

**Q: Command not found**
A: Ensure commands are in your Claude Code commands directory

**Q: Tasks seem generic**
A: The LLM needs to perform codebase analysis - check that it's following the discovery instructions

**Q: Missing context**
A: Ensure problem.json and technical.json are complete before creating tasks

**Q: Dependencies unclear**
A: Review task breakdown and update dependency relationships

This system transforms feature development with Claude Code from ad-hoc implementation to systematic, context-aware planning and execution.
