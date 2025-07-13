---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Design technical approach, architecture, and data models for a feature
---

## Context

- Current directory: !`pwd`
- Git repository: !`git remote -v 2>/dev/null | head -1 || echo "Not a git repository"`
- Existing projects: !`ls -la .codeloops/ 2>/dev/null | grep "^d" | awk '{print $9}' | grep -v "^\." || echo "No existing projects"`
- Existing codebase patterns: !`find . -name "*.ts" -o -name "*.js" -o -name "*.py" | head -10`

## Task

Design technical approach for: $ARGUMENTS

Research existing codebase and design:

### Technology Stack
- **Language/Framework:** What and why? (align with existing)
- **Dependencies:** New libraries needed? (ensure Zod is available for TypeScript projects)
- **Schema validation:** Use Zod for all data validation and type derivation
- **Database:** Schema changes or new tables needed?
- **Infrastructure:** Deployment, scaling, monitoring considerations

### Data Models  
- **Core entities:** What are the main data objects?
- **Relationships:** How do entities connect?
- **Schema design:** Database tables/collections with fields
- **Validation rules:** Required fields, constraints, business rules
- **TypeScript schemas:** Use Zod for schema definition, derive types with z.infer (never standalone types)

### Architecture
- **Component structure:** How does this fit into existing architecture?
- **API endpoints:** New routes needed? Request/response schemas?
- **Integration points:** What existing systems/services are affected?
- **File organization:** Where does new code live?

### Security & Quality
- **Authentication:** Who can access this feature?
- **Authorization:** What permissions are needed?
- **Data validation:** Input sanitization and business rule enforcement
- **Error handling:** Edge cases and failure scenarios

## Output

Create local JSON file at `.codeloops/<feature_or_task_or_bugfix>/technical.json` with detailed technical design.

## JSON-Based Workflow

```bash
# Validate arguments
if [ -z "$ARGUMENTS" ]; then
    echo "Error: Please provide feature/task/bugfix name"
    echo "Usage: plan-technical <feature_or_task_or_bugfix>"
    echo "Example: plan-technical 'user-authentication-feature'"
    exit 1
fi

# Sanitize feature name for directory
FEATURE_NAME=$(echo "$ARGUMENTS" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')

# Check if project directory exists
PROJECT_DIR=".codeloops/$FEATURE_NAME"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "⚠️  Project directory does not exist: $PROJECT_DIR"
    echo "Run 'plan-problem $FEATURE_NAME' first to create the project"
    exit 1
fi

# Check if problem.json exists (prerequisite)
if [ ! -f "$PROJECT_DIR/problem.json" ]; then
    echo "⚠️  Problem definition not found: $PROJECT_DIR/problem.json"
    echo "Run 'plan-problem $FEATURE_NAME' first to define the problem"
    exit 1
fi

# Check if technical.json already exists
if [ -f "$PROJECT_DIR/technical.json" ]; then
    echo "⚠️  Technical approach already exists for '$FEATURE_NAME'"
    echo "📄 Current content preview:"
    head -20 "$PROJECT_DIR/technical.json"
    echo ""
    echo "Choose action:"
    echo "1. Continue to update existing approach"
    echo "2. Exit and use revise-technical command instead"
    read -p "Enter choice (1-2): " choice
    
    if [ "$choice" != "1" ]; then
        echo "Exiting. Use 'revise-technical $FEATURE_NAME' to modify existing approach."
        exit 0
    fi
fi

echo "🏗️ Creating technical approach for: $FEATURE_NAME"
echo "Project directory: $PROJECT_DIR"
echo ""

# CODEBASE ANALYSIS INSTRUCTIONS FOR LLM
echo "🔍 CODEBASE CONTEXT DISCOVERY INSTRUCTIONS"
echo "=========================================="
echo "CRITICAL: LLM must perform comprehensive codebase analysis to discover:"
echo ""
echo "📁 TECHNOLOGY STACK & PROJECT TYPE"
echo "- Programming language and version (JavaScript, TypeScript, Python, Rust, Go, etc.)"
echo "- Framework/runtime (Express, React, FastAPI, Django, Actix, etc.)"
echo "- Project type (web app, API service, CLI tool, library, microservice)"
echo "- Package manager and dependency patterns"
echo ""
echo "🏗️ ARCHITECTURAL PATTERNS"
echo "- Code organization (monorepo, microservices, MVC, clean architecture)"
echo "- File and directory naming conventions"
echo "- Import/export patterns and module structure"
echo "- Dependency injection and inversion of control patterns"
echo ""
echo "🛠️ EXISTING INFRASTRUCTURE"
echo "- Database type and ORM/ODM patterns"
echo "- Authentication and authorization mechanisms"
echo "- API design patterns (REST, GraphQL, gRPC)"
echo "- Configuration management and environment handling"
echo "- Testing frameworks and patterns"
echo "- Build tools and deployment configurations"
echo ""
echo "🎯 ANALYSIS APPROACH"
echo "- Examine manifest files (package.json, requirements.txt, Cargo.toml, go.mod)"
echo "- Review directory structure and existing code organization"
echo "- Identify established patterns for data models, validation, error handling"
echo "- Understand existing API endpoints and routing conventions"
echo "- Analyze configuration files and deployment patterns"
echo ""

# NOTE: Technology detection now handled by LLM analysis - see instructions above
PROJECT_TYPE="dynamically_discovered"
MAIN_LANGUAGE="dynamically_discovered" 
FRAMEWORK="dynamically_discovered"

# Create technical.json structure with detected patterns
cat > "$PROJECT_DIR/technical.json" << 'EOF'
{
  "metadata": {
    "created": "",
    "updated": "",
    "version": "1.0.0",
    "featureName": ""
  },
  "technologyStack": {
    "language": "",
    "framework": "",
    "dependencies": [],
    "database": "",
    "infrastructure": ""
  },
  "dataModels": [],
  "architecture": {
    "components": [],
    "apiEndpoints": [],
    "integrationPoints": [],
    "fileOrganization": []
  },
  "security": {
    "authentication": "",
    "authorization": "",
    "validation": "",
    "errorHandling": ""
  }
}
EOF

# Update metadata (tech stack will be filled by LLM based on analysis)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
jq --arg timestamp "$TIMESTAMP" \
   --arg feature "$FEATURE_NAME" '
  .metadata.created = $timestamp |
  .metadata.updated = $timestamp |
  .metadata.featureName = $feature
' "$PROJECT_DIR/technical.json" > "$PROJECT_DIR/technical.json.tmp" && mv "$PROJECT_DIR/technical.json.tmp" "$PROJECT_DIR/technical.json"

echo "✅ Created technical approach template at: $PROJECT_DIR/technical.json"
echo ""
echo "📝 Next steps:"
echo "1. Open the file in your editor to complete the technical design"
echo "2. Define data models, API endpoints, and architecture components"
echo "3. Consider security requirements and validation rules"
echo "4. Run 'plan-tasks $FEATURE_NAME' when ready for task breakdown"
echo ""
echo "📄 Current project structure:"
echo "$PROJECT_DIR/"
echo "├── problem.json (✅ exists)"
echo "├── technical.json (✅ created)"
echo "└── tasks.json (pending)"
```

## Design Heuristics

1. **Follow existing patterns** - use current codebase conventions and structures
2. **Minimize dependencies** - prefer existing libraries over new ones
3. **Zod-first TypeScript** - define schemas with Zod, derive types with z.infer, never standalone types
4. **Design for change** - build flexible, extensible interfaces
5. **Security first** - validate all inputs, authorize all actions
6. **Performance aware** - consider scale, caching, database efficiency
7. **Priority-driven design** - focus on implementation order and dependencies, not timelines or schedules
8. **Integration awareness** - reference problem.json for context and constraints
9. **Structured data** - JSON format enables automation and tooling integration

## JSON Structure Guide

The technical.json file should contain:

```json
{
  "metadata": {
    "created": "2024-01-01T00:00:00.000Z",
    "updated": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0",
    "featureName": "user-authentication-feature"
  },
  "technologyStack": {
    "language": "typescript",
    "framework": "express",
    "dependencies": ["zod", "bcrypt", "jsonwebtoken"],
    "database": "postgresql",
    "infrastructure": "docker, nginx"
  },
  "dataModels": [
    {
      "name": "User",
      "schema": "{ id: string, email: string, passwordHash: string }",
      "validationRules": "email must be unique, password min 8 chars",
      "relationships": ["Profile", "Session"]
    }
  ],
  "architecture": {
    "components": ["AuthService", "UserController", "TokenManager"],
    "apiEndpoints": [
      {
        "method": "POST",
        "path": "/api/auth/login",
        "purpose": "Authenticate user and return JWT token"
      }
    ],
    "integrationPoints": ["existing UserProfile system"],
    "fileOrganization": [
      "src/auth/",
      "src/middleware/auth.ts",
      "src/types/auth.ts"
    ]
  },
  "security": {
    "authentication": "JWT tokens with refresh mechanism",
    "authorization": "Role-based access control",
    "validation": "Zod schemas for all inputs",
    "errorHandling": "Sanitized error messages, detailed logging"
  }
}
```

## Tips for Effective Technical Design

- **Reference problem.json**: Ensure your technical approach addresses the problem statement
- **Validate constraints**: Check problem.json constraints and ensure compliance
- **Auto-detect tech stack**: The workflow automatically detects your project type
- **Be specific**: Include exact file paths, component names, and API endpoints
- **Consider integration**: How does this fit with existing systems?
- **Security by design**: Consider auth, validation, and error handling from the start
