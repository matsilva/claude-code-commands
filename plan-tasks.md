---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Break down feature into prioritized, actionable tasks with comprehensive context analysis
---

## Context

- Current directory: !`pwd`
- Git repository: !`git remote -v 2>/dev/null | head -1 || echo "Not a git repository"`
- Existing projects: !`ls -la .codeloops/ 2>/dev/null | grep "^d" | awk '{print $9}' | grep -v "^\." || echo "No existing projects"`
- Codebase patterns: !`find . -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.md" | head -15`
- Package files: !`find . -name "package.json" -o -name "Cargo.toml" -o -name "requirements.txt" -o -name "go.mod" | head -5`

## Task

Break down implementation plan for: $ARGUMENTS

**IMPORTANT: Perform comprehensive codebase analysis to understand existing patterns before creating tasks. Create specific, actionable tasks with detailed implementation guidance.**

**CRITICAL: Each task must be small batch (1-4 hours), have clear scope boundaries with explicit "Out of Scope" sections, and include specific file changes, API endpoints, and constraints.**

### Task Creation Approach

**LLM MUST perform comprehensive codebase analysis to create contextually appropriate tasks:**

1. **Dynamic Context Discovery** - Analyze codebase patterns, architecture, existing conventions
2. **Problem-Driven Tasks** - Extract user stories and acceptance criteria from problem definition  
3. **Technical Integration** - Ensure tasks align with established technical approach
4. **Dependency Management** - Identify blocking relationships and proper sequencing
5. **Scope Definition** - Clear boundaries of what IS and IS NOT included per task

### Required Task Structure

Each task must include:
- **id**: Unique identifier (T1, T2, T3, etc.)
- **title**: Clear, actionable task name
- **description**: Detailed description of what needs to be done
- **priority**: P0 (Must Have) | P1 (Should Have) | P2 (Nice to Have)
- **status**: "pending"
- **userStory**: "As a [user], I want [goal], so that [benefit]"
- **levelOfEffort**: Fibonacci number (1, 2, 3, 5, 8, 13, 21) indicating complexity
- **contextAnalysis**: What exists vs what's missing
- **fileStructureChanges**: Files to create/modify/move
- **implementationDetails**: Specific files, functions, API endpoints
- **technicalSpecifications**: Code patterns, data structures, schemas
- **implementationConstraints**: What NOT to change
- **externalDependencies**: Required libraries, services
- **integrationPoints**: Existing systems affected
- **acceptanceCriteria**: Testable conditions
- **successDefinition**: How to verify completion
- **outOfScope**: What NOT to implement
- **dependencies**: Other task IDs that must complete first
- **createdDate**: ISO timestamp
- **updatedDate**: ISO timestamp

## Output

Create local JSON file at `.codeloops/<feature_or_task_or_bugfix>/tasks.json` with comprehensive task breakdown based on dynamic codebase analysis.

## JSON-Based Workflow

```bash
# Validate arguments
if [ -z "$ARGUMENTS" ]; then
    echo "Error: Please provide feature/task/bugfix name"
    echo "Usage: plan-tasks <feature_or_task_or_bugfix>"
    echo "Example: plan-tasks 'user-authentication-feature'"
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

# Check if technical.json exists (prerequisite)
if [ ! -f "$PROJECT_DIR/technical.json" ]; then
    echo "⚠️  Technical approach not found: $PROJECT_DIR/technical.json"
    echo "Run 'plan-technical $FEATURE_NAME' first to define the technical approach"
    exit 1
fi

# Check if tasks.json already exists
if [ -f "$PROJECT_DIR/tasks.json" ]; then
    echo "⚠️  Task breakdown already exists for '$FEATURE_NAME'"
    echo "📄 Current content preview:"
    head -20 "$PROJECT_DIR/tasks.json"
    echo ""
    echo "Choose action:"
    echo "1. Continue to update existing tasks"
    echo "2. Exit and use revise-tasks command instead"
    read -p "Enter choice (1-2): " choice
    
    if [ "$choice" != "1" ]; then
        echo "Exiting. Use 'revise-tasks $FEATURE_NAME' to modify existing tasks."
        exit 0
    fi
fi

echo "📋 CREATING TASK BREAKDOWN FOR: $FEATURE_NAME"
echo "============================================="
echo "Project directory: $PROJECT_DIR"
echo ""

echo "🔍 CODEBASE CONTEXT DISCOVERY (Required)"
echo "========================================"
echo "CRITICAL: LLM must perform comprehensive codebase analysis to discover:"
echo ""
echo "📁 PROJECT STRUCTURE & PATTERNS"
echo "- Programming language and version"
echo "- Framework/runtime (Express, React, FastAPI, Django, etc.)"
echo "- Project type (web app, API service, CLI tool, library)"
echo "- File organization patterns (monorepo, microservices, MVC, clean architecture)"
echo "- Directory structure and naming conventions"
echo ""
echo "🏗️ ARCHITECTURE & DESIGN PATTERNS"
echo "- API patterns (REST, GraphQL, gRPC)"
echo "- Authentication/authorization patterns"
echo "- Data access patterns (ORM, query builders, raw queries)"
echo "- Dependency injection patterns"
echo "- Error handling and validation patterns"
echo "- Testing patterns and frameworks"
echo ""
echo "🛠️ INFRASTRUCTURE & TOOLING"
echo "- Database type and ORM/ODM"
echo "- Build tools and package managers"
echo "- Configuration management patterns"
echo "- Deployment and containerization"
echo "- Monitoring and logging patterns"
echo ""
echo "🎯 PROJECT CONTEXT ANALYSIS"
echo "- Review problem.json for user stories and success criteria"
echo "- Analyze technical.json for architecture and data models"
echo "- Understand existing systems that must be preserved"
echo "- Identify integration points and external dependencies"
echo ""

# Read project context files
PROBLEM_STATEMENT=""
WHY=""
SUCCESS_CRITERIA=""
if [ -f "$PROJECT_DIR/problem.json" ]; then
    PROBLEM_STATEMENT=$(jq -r '.problemStatement' "$PROJECT_DIR/problem.json" 2>/dev/null || echo "")
    WHY=$(jq -r '.why' "$PROJECT_DIR/problem.json" 2>/dev/null || echo "")
    SUCCESS_CRITERIA=$(jq -r '.successCriteria | join(", ")' "$PROJECT_DIR/problem.json" 2>/dev/null || echo "")
fi

TECH_LANGUAGE=""
TECH_FRAMEWORK=""
if [ -f "$PROJECT_DIR/technical.json" ]; then
    TECH_LANGUAGE=$(jq -r '.technologyStack.language' "$PROJECT_DIR/technical.json" 2>/dev/null || echo "")
    TECH_FRAMEWORK=$(jq -r '.technologyStack.framework' "$PROJECT_DIR/technical.json" 2>/dev/null || echo "")
fi

README_CONTENT=""
if [ -f "README.md" ]; then
    README_CONTENT=$(head -50 README.md)
fi

echo "📋 PROJECT CONTEXT"
echo "=================="
echo "Problem: $PROBLEM_STATEMENT"
echo "Why: $WHY"
echo "Success Criteria: $SUCCESS_CRITERIA"
echo "Tech Stack: $TECH_LANGUAGE/$TECH_FRAMEWORK"
echo ""

# Create tasks.json structure
cat > "$PROJECT_DIR/tasks.json" << 'EOF'
{
  "metadata": {
    "created": "",
    "updated": "",
    "version": "1.0.0",
    "featureName": ""
  },
  "contextAnalysis": {
    "problemDefinition": "",
    "technicalApproach": "",
    "codebasePatterns": "",
    "externalDocs": ""
  },
  "tasks": [],
  "dependencies": []
}
EOF

# Update metadata and context analysis
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
jq --arg timestamp "$TIMESTAMP" \
   --arg feature "$FEATURE_NAME" \
   --arg problem "$PROBLEM_STATEMENT" \
   --arg readme "$README_CONTENT" '
  .metadata.created = $timestamp |
  .metadata.updated = $timestamp |
  .metadata.featureName = $feature |
  .contextAnalysis.problemDefinition = $problem |
  .contextAnalysis.technicalApproach = "To be discovered by LLM analysis" |
  .contextAnalysis.codebasePatterns = "To be discovered by LLM analysis" |
  .contextAnalysis.externalDocs = $readme
' "$PROJECT_DIR/tasks.json" > "$PROJECT_DIR/tasks.json.tmp" && mv "$PROJECT_DIR/tasks.json.tmp" "$PROJECT_DIR/tasks.json"

echo "✅ Created task breakdown template at: $PROJECT_DIR/tasks.json"
echo ""
echo "📝 NEXT STEPS (CRITICAL)"
echo "======================="
echo "1. LLM MUST perform comprehensive codebase analysis as outlined above"
echo "2. LLM MUST create specific tasks based on discovered patterns and project context"
echo "3. LLM MUST populate tasks array with complete task objects following the structure below"
echo "4. LLM MUST set appropriate priorities (P0/P1/P2) and dependencies"
echo "5. LLM MUST ensure each task is 1-4 hours of focused work"
echo ""
echo "📋 TASK STRUCTURE TEMPLATE"
echo "=========================="
echo "Each task in the tasks array must follow this structure:"
cat << 'EOT'
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
EOT

echo ""
echo "🎯 PRIORITY GUIDELINES"
echo "====================="
echo "- P0 (Must Have): Core functionality, blocks other work, user-critical features"
echo "- P1 (Should Have): Important but not blocking, clear user value, enhances core features"
echo "- P2 (Nice to Have): Polish, optimization, future enhancements, non-critical features"
echo ""
echo "🔧 PROJECT STRUCTURE"
echo "===================="
echo "$PROJECT_DIR/"
echo "├── problem.json (✅ exists)"
echo "├── technical.json (✅ exists)"
echo "└── tasks.json (✅ created - ready for LLM to populate)"
echo ""
echo "💡 NEXT COMMANDS"
echo "==============="
echo "- add-task $FEATURE_NAME \"Task Title\" [P0|P1|P2] - Add discovered tasks during implementation"
echo "- execute $FEATURE_NAME [task_id] - Start implementing tasks"
```

## Task Creation Heuristics

1. **Context-driven analysis** - LLM must analyze existing codebase patterns before creating tasks
2. **Problem alignment** - Tasks must directly address user stories and success criteria
3. **Technical integration** - Follow established architecture and design patterns
4. **Small batch sizing** - Each task should be 1-4 hours of focused work
5. **Clear scope boundaries** - Explicit "outOfScope" sections prevent feature creep
6. **Dependency awareness** - Identify blocking relationships between tasks
7. **Pattern consistency** - Follow existing codebase conventions and standards
8. **Priority-driven** - Organize by user impact and dependencies, not time estimates
9. **Comprehensive specification** - Include all required fields for complete task definition
10. **Integration ready** - Consider existing systems and external dependencies
11. **Verification focused** - Include testable acceptance criteria and success definitions
12. **Dynamic discovery** - Use LLM analysis rather than hardcoded patterns

## Integration with Workflow

This command integrates with the existing workflow:

1. **plan-problem** - Define problem and users
2. **plan-technical** - Design technical approach  
3. **plan-tasks** - Break down into actionable tasks ⭐ IMPROVED
4. **add-task** - Add discovered tasks during implementation
5. **execute** - Implement individual tasks

## Benefits

- **Streamlined creation** - Consolidated approach similar to add-task command
- **Dynamic discovery** - LLM-based codebase analysis instead of hardcoded detection
- **Comprehensive tasks** - All required fields included from the start
- **Context-aware** - Leverages problem definition and technical approach
- **Integration ready** - Fits into existing local-first JSON workflow
- **Scalable** - Supports projects of any size and complexity