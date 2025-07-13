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

**IMPORTANT: Analyze ALL available context - problem definition, technical approach, codebase patterns, external docs, and dependencies. Create specific, actionable tasks with detailed implementation guidance.**

**CRITICAL: Each task must be small batch (1-4 hours), have clear scope boundaries with explicit "Out of Scope" sections, and include specific file changes, API endpoints, and constraints.**

Create comprehensive task breakdown with full context integration:

### Context Analysis Strategy
1. **Problem & User Context** - Extract user stories, success criteria, and constraints from problem definition
2. **Technical Context** - Leverage architecture, data models, and tech stack from technical approach
3. **Codebase Context** - Analyze existing patterns, file structures, naming conventions, and dependencies
4. **External Context** - Review README, docs, configuration files for additional constraints
5. **Integration Context** - Identify existing systems, APIs, and components that must be preserved
6. **Scope Context** - Define clear boundaries of what IS and IS NOT included

### Task Specification Requirements
Each task must include:
- **Focused Scope:** Single-sentence summary of exactly what this task accomplishes
- **User Story:** "As a [user], I want [goal], so that [benefit]" from problem definition
- **Context Analysis:** What already exists vs what's missing, based on full codebase analysis
- **File Structure Changes:** Explicit before/after showing NEW/MODIFIED/MOVED files with paths
- **Implementation Details:** Exact files, functions, components, API endpoints to create/modify
- **Technical Specifications:** Code patterns, data structures, schemas following existing conventions
- **Implementation Constraints:** Clear list of what NOT to change or reimplement
- **External Dependencies:** Required libraries, services, or external integrations
- **Integration Points:** How this connects to existing systems and components
- **Acceptance Criteria:** Granular, testable conditions (not high-level outcomes)
- **Success Definition:** Clear definition of what completion looks like and how to verify
- **Out of Scope:** Explicit boundaries listing what NOT to implement
- **Batch Size:** Ensure 1-4 hours of focused work per task
- **Dependencies:** What must be completed first
- **Priority:** P0/P1/P2 based on user impact and dependencies

### Priority Guidelines
- **P0 (Must Have):** Core functionality, blocks other work, user-critical features
- **P1 (Should Have):** Important but not blocking, clear user value, enhances core features  
- **P2 (Nice to Have):** Polish, optimization, future enhancements, non-critical features

## Output

1. **Comprehensive context analysis** - full understanding of problem, technical approach, and codebase
2. Create local JSON file at `.codeloops/<feature_or_task_or_bugfix>/tasks.json` with complete task breakdown
3. **Include detailed task specifications** with full context analysis and implementation details
4. Each task includes complete context analysis, specific implementation details, and clear scope boundaries
5. Set priority levels (P0/P1/P2) and dependencies for each task

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

echo "🔍 COMPREHENSIVE CONTEXT ANALYSIS FOR: $FEATURE_NAME"
echo "=================================================="
echo ""

# 1. PROBLEM & USER CONTEXT ANALYSIS
echo "📋 ANALYZING PROBLEM DEFINITION & USER CONTEXT"
echo "----------------------------------------------"

# Read and parse problem.json
echo "Reading problem definition from: $PROJECT_DIR/problem.json"
PROBLEM_STATEMENT=$(jq -r '.problemStatement' "$PROJECT_DIR/problem.json" 2>/dev/null || echo "")
WHY=$(jq -r '.why' "$PROJECT_DIR/problem.json" 2>/dev/null || echo "")
SUCCESS_CRITERIA=$(jq -r '.successCriteria | join(", ")' "$PROJECT_DIR/problem.json" 2>/dev/null || echo "")
CONSTRAINTS_TECHNICAL=$(jq -r '.constraints.technical' "$PROJECT_DIR/problem.json" 2>/dev/null || echo "")
CONSTRAINTS_BUSINESS=$(jq -r '.constraints.business' "$PROJECT_DIR/problem.json" 2>/dev/null || echo "")
CONSTRAINTS_SCOPE=$(jq -r '.constraints.scope' "$PROJECT_DIR/problem.json" 2>/dev/null || echo "")
NON_GOALS=$(jq -r '.constraints.nonGoals' "$PROJECT_DIR/problem.json" 2>/dev/null || echo "")
USER_COUNT=$(jq -r '.users | length' "$PROJECT_DIR/problem.json" 2>/dev/null || echo "0")

if [ -n "$PROBLEM_STATEMENT" ] && [ "$PROBLEM_STATEMENT" != "null" ]; then
  echo "✅ Found problem definition"
  echo "Problem: $PROBLEM_STATEMENT"
  echo "Why: $WHY"
  echo "Users: $USER_COUNT personas defined"
  echo "Success Criteria: $SUCCESS_CRITERIA"
  echo "Technical Constraints: $CONSTRAINTS_TECHNICAL"
  echo "Business Constraints: $CONSTRAINTS_BUSINESS"
  echo "Scope: $CONSTRAINTS_SCOPE"
  echo "Non-goals: $NON_GOALS"
else
  echo "⚠️  Problem definition appears incomplete"
  echo "Please complete $PROJECT_DIR/problem.json before proceeding"
fi
echo ""

# 2. TECHNICAL CONTEXT ANALYSIS
echo "🏗️ ANALYZING TECHNICAL APPROACH & ARCHITECTURE"
echo "----------------------------------------------"

# Read and parse technical.json
echo "Reading technical approach from: $PROJECT_DIR/technical.json"
LANGUAGE=$(jq -r '.technologyStack.language' "$PROJECT_DIR/technical.json" 2>/dev/null || echo "")
FRAMEWORK=$(jq -r '.technologyStack.framework' "$PROJECT_DIR/technical.json" 2>/dev/null || echo "")
DEPENDENCIES=$(jq -r '.technologyStack.dependencies | join(", ")' "$PROJECT_DIR/technical.json" 2>/dev/null || echo "")
DATABASE=$(jq -r '.technologyStack.database' "$PROJECT_DIR/technical.json" 2>/dev/null || echo "")
DATA_MODEL_COUNT=$(jq -r '.dataModels | length' "$PROJECT_DIR/technical.json" 2>/dev/null || echo "0")
API_ENDPOINT_COUNT=$(jq -r '.architecture.apiEndpoints | length' "$PROJECT_DIR/technical.json" 2>/dev/null || echo "0")
COMPONENTS=$(jq -r '.architecture.components | join(", ")' "$PROJECT_DIR/technical.json" 2>/dev/null || echo "")
AUTH_METHOD=$(jq -r '.security.authentication' "$PROJECT_DIR/technical.json" 2>/dev/null || echo "")

if [ -n "$LANGUAGE" ] && [ "$LANGUAGE" != "null" ]; then
  echo "✅ Found technical approach"
  echo "Language: $LANGUAGE"
  echo "Framework: $FRAMEWORK"
  echo "Dependencies: $DEPENDENCIES"
  echo "Database: $DATABASE"
  echo "Data Models: $DATA_MODEL_COUNT defined"
  echo "API Endpoints: $API_ENDPOINT_COUNT planned"
  echo "Components: $COMPONENTS"
  echo "Authentication: $AUTH_METHOD"
else
  echo "⚠️  Technical approach appears incomplete"
  echo "Please complete $PROJECT_DIR/technical.json before proceeding"
fi
echo ""

# 3. CODEBASE CONTEXT ANALYSIS
echo "💻 ANALYZING EXISTING CODEBASE PATTERNS"
echo "--------------------------------------"
echo "Analyzing file structure and patterns..."

# Detect project type and patterns
PROJECT_TYPE="unknown"
MAIN_LANGUAGE="unknown"
FRAMEWORK="unknown"

if [ -f "package.json" ]; then
  PROJECT_TYPE="javascript/typescript"
  echo "✅ Found JavaScript/TypeScript project"
  FRAMEWORK=$(cat package.json | jq -r '.dependencies | keys[]' | grep -E 'react|vue|angular|express|next' | head -1 || echo "vanilla")
  if find . -name "*.ts" -not -path "./node_modules/*" | head -1 >/dev/null 2>&1; then
    MAIN_LANGUAGE="typescript"
  else
    MAIN_LANGUAGE="javascript"
  fi
elif [ -f "Cargo.toml" ]; then
  PROJECT_TYPE="rust"
  MAIN_LANGUAGE="rust"
  echo "✅ Found Rust project"
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
  PROJECT_TYPE="python"
  MAIN_LANGUAGE="python"
  echo "✅ Found Python project"
elif [ -f "go.mod" ]; then
  PROJECT_TYPE="go"
  MAIN_LANGUAGE="go"
  echo "✅ Found Go project"
fi

# Analyze directory structure
SRC_STRUCTURE=""
if [ -d "src" ]; then
  SRC_STRUCTURE=$(find src -type d | head -10 | sed 's/^/  /')
  echo "✅ Found src/ directory structure:"
  echo "$SRC_STRUCTURE"
fi

# Analyze existing API patterns
API_PATTERNS=""
if find . -name "*.ts" -o -name "*.js" | xargs grep -l "app\." 2>/dev/null | head -1 >/dev/null; then
  API_PATTERNS="Express.js patterns detected"
  echo "✅ Found Express.js API patterns"
elif find . -name "*.py" | xargs grep -l "FastAPI\|@app\." 2>/dev/null | head -1 >/dev/null; then
  API_PATTERNS="FastAPI patterns detected"
  echo "✅ Found FastAPI patterns"
elif find . -name "*.rs" | xargs grep -l "actix\|warp" 2>/dev/null | head -1 >/dev/null; then
  API_PATTERNS="Rust web framework detected"
  echo "✅ Found Rust web framework patterns"
fi

# Analyze database patterns
DB_PATTERNS=""
if find . -name "*.sql" 2>/dev/null | head -1 >/dev/null; then
  DB_PATTERNS="SQL database patterns"
  echo "✅ Found SQL database files"
elif find . -name "*.ts" -o -name "*.js" | xargs grep -l "mongoose\|Schema" 2>/dev/null | head -1 >/dev/null; then
  DB_PATTERNS="MongoDB/Mongoose patterns"
  echo "✅ Found MongoDB patterns"
elif find . -name "*.py" | xargs grep -l "SQLAlchemy\|models.Model" 2>/dev/null | head -1 >/dev/null; then
  DB_PATTERNS="SQLAlchemy patterns"
  echo "✅ Found SQLAlchemy patterns"
fi

echo ""

# 4. EXTERNAL DOCUMENTATION ANALYSIS
echo "📚 ANALYZING EXTERNAL DOCUMENTATION"
echo "----------------------------------"
README_CONTENT=""
if [ -f "README.md" ]; then
  echo "✅ Found README.md"
  README_CONTENT=$(head -50 README.md)
  echo "Extracted setup and usage patterns from README"
else
  echo "⚠️  No README.md found"
fi

# Analyze configuration files
CONFIG_PATTERNS=""
if [ -f ".env.example" ] || [ -f ".env" ]; then
  CONFIG_PATTERNS="Environment configuration patterns found"
  echo "✅ Found environment configuration"
fi
if [ -f "docker-compose.yml" ] || [ -f "Dockerfile" ]; then
  CONFIG_PATTERNS="$CONFIG_PATTERNS, Docker containerization"
  echo "✅ Found Docker configuration"
fi

echo ""
echo "🎯 CONTEXT ANALYSIS COMPLETE - CREATING TASK BREAKDOWN"
echo "====================================================="
echo ""

# Create comprehensive task breakdown JSON structure
echo "📝 Creating task breakdown structure..."

# Create tasks.json with comprehensive context analysis
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
   --arg tech "$LANGUAGE/$FRAMEWORK" \
   --arg patterns "$PROJECT_TYPE" \
   --arg readme "$README_CONTENT" '
  .metadata.created = $timestamp |
  .metadata.updated = $timestamp |
  .metadata.featureName = $feature |
  .contextAnalysis.problemDefinition = $problem |
  .contextAnalysis.technicalApproach = $tech |
  .contextAnalysis.codebasePatterns = $patterns |
  .contextAnalysis.externalDocs = $readme
' "$PROJECT_DIR/tasks.json" > "$PROJECT_DIR/tasks.json.tmp" && mv "$PROJECT_DIR/tasks.json.tmp" "$PROJECT_DIR/tasks.json"

echo "✅ Created task breakdown template at: $PROJECT_DIR/tasks.json"
echo ""
echo "📝 Context Analysis Summary:"
echo "Problem: $PROBLEM_STATEMENT"
echo "Tech Stack: $LANGUAGE/$FRAMEWORK"
echo "Project Type: $PROJECT_TYPE"
echo "Success Criteria: $SUCCESS_CRITERIA"
echo ""
echo "📋 Next steps:"
echo "1. Open $PROJECT_DIR/tasks.json in your editor"
echo "2. Add specific tasks based on the context analysis above"
echo "3. Set priorities (P0/P1/P2) and dependencies for each task"
echo "4. Use the enhance-task command to add more details to individual tasks"
echo ""
echo "📄 Complete project structure:"
echo "$PROJECT_DIR/"
echo "├── problem.json (✅ analyzed)"
echo "├── technical.json (✅ analyzed)"
echo "└── tasks.json (✅ created)"
echo ""

echo "💡 Task JSON Structure Guide:"
echo "Each task in the tasks array should follow this structure:"
echo '
{
  "id": "T1",
  "title": "Implement user authentication API",
  "description": "Create JWT-based authentication endpoints",
  "priority": "P0",
  "status": "pending",
  "estimatedHours": 3,
  "userStory": "As a user, I want to log in securely, so that I can access protected features",
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
}'

echo ""
echo "🎉 TASK BREAKDOWN INITIALIZATION COMPLETE"
echo "========================================"
echo "✅ Comprehensive context analysis performed"
echo "✅ Task breakdown template created with full context"
echo "✅ Ready for detailed task specification"
echo ""
echo "Next Steps:"
echo "1. Edit $PROJECT_DIR/tasks.json to add specific tasks"
echo "2. Use the context analysis above to inform your task creation"
echo "3. Set appropriate priorities and dependencies"
echo "4. Use enhance-task command for additional task details"
echo "5. Start implementing P0 tasks in dependency order"
```

## Comprehensive Planning Heuristics

1. **Context-driven analysis** - analyze ALL available context before creating tasks
2. **Local-first integration** - leverage problem.json and technical.json for comprehensive context
3. **Specific implementation details** - include exact files, functions, API endpoints, and data models
4. **Small batch sizing** - ensure each task is 1-4 hours of focused work
5. **Clear scope boundaries** - explicit "outOfScope" sections prevent feature creep
6. **Pattern consistency** - follow existing codebase conventions and architecture
7. **Dependency awareness** - identify and call out blocking relationships clearly
8. **External integration** - consider external docs, configuration, and deployment requirements
9. **User-centric focus** - tie each task back to user stories and success criteria
10. **Quality enforcement** - include acceptance criteria that verify integration and patterns
11. **Constraint respect** - honor limitations from problem definition and technical approach
12. **Priority-driven** - organize by user impact and dependencies, not time estimates
13. **Verification-ready** - include clear success definitions and testing approaches
14. **Architecture-aware** - ensure tasks fit within existing system design
15. **Documentation-informed** - use README and config files to understand deployment context
16. **JSON-structured** - all task data stored in machine-readable format for automation
17. **Prerequisites validation** - ensure problem.json and technical.json exist and are complete
18. **Iterative refinement** - use revise-tasks and enhance-task commands for improvements

## JSON Structure Benefits

- **Machine-readable**: Tasks can be processed by tools and scripts
- **Version controlled**: All planning data tracked in git with the code
- **Offline-first**: No dependency on external services for planning
- **Searchable**: Easy to find tasks by priority, status, or dependencies
- **Extensible**: Can add new fields without breaking existing structure
- **Integration-ready**: Other tools can read/write task data
