---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Add a new task to an existing project during implementation
---

## Context

- Current directory: !`pwd`
- Git repository: !`git remote -v 2>/dev/null | head -1 || echo "Not a git repository"`
- Existing projects: !`ls -la .codeloops/ 2>/dev/null | grep "^d" | awk '{print $9}' | grep -v "^\." || echo "No existing projects"`
- Available tasks: !`find .codeloops -name "tasks.json" 2>/dev/null | wc -l | tr -d ' '` projects with task definitions

## Task

Add a new task to existing project: $ARGUMENTS (format: <project_name> "<task_title>" [priority])

**Use Case**: During implementation, you discover additional tasks needed to complete the feature (e.g., missing dependencies, database migrations, test setup, etc.)

**IMPORTANT: Perform comprehensive codebase analysis to understand existing patterns before creating the task. Follow the same dynamic discovery approach as other commands.**

### Task Creation Process

1. **Validate project exists** - ensure project directory and tasks.json exist
2. **Perform codebase analysis** - understand existing patterns and conventions
3. **Generate unique task ID** - create next sequential ID (T1, T2, etc.)
4. **Create comprehensive task** - include all required fields with proper context
5. **Update tasks.json** - add new task while preserving existing structure
6. **Set dependencies** - identify if this blocks or is blocked by other tasks

### Required Task Fields

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

Add new task to existing project's tasks.json file with proper validation and context analysis.

## JSON-Based Workflow

```bash
# Validate arguments
if [ -z "$ARGUMENTS" ]; then
    echo "Error: Please provide project name and task title"
    echo "Usage: add-task <project_name> \"<task_title>\" [priority]"
    echo "Example: add-task user-authentication-feature \"Add password validation\" P1"
    echo "Example: add-task user-auth \"Setup test database\" P0"
    exit 1
fi

# Parse arguments: project_name "task_title" [priority]
PROJECT_NAME=$(echo "$ARGUMENTS" | awk '{print $1}')
TASK_TITLE=$(echo "$ARGUMENTS" | sed 's/^[^ ]* *//' | sed 's/^\"\(.*\)\" *[^ ]*$/\1/' | sed 's/^\"\(.*\)\"$/\1/')
PRIORITY=$(echo "$ARGUMENTS" | awk '{print $NF}' | grep -E '^P[012]$' || echo "P1")

# Validate task title was provided
if [ -z "$TASK_TITLE" ] || [ "$TASK_TITLE" = "$PROJECT_NAME" ]; then
    echo "⚠️  Error: Task title is required and must be quoted"
    echo "Usage: add-task <project_name> \"<task_title>\" [priority]"
    echo "Example: add-task user-auth \"Add input validation\""
    exit 1
fi

# Sanitize project name
PROJECT_NAME=$(echo "$PROJECT_NAME" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
PROJECT_DIR=".codeloops/$PROJECT_NAME"

# Validate project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo "⚠️  Project directory does not exist: $PROJECT_DIR"
    echo "Available projects:"
    ls -la .codeloops/ 2>/dev/null | grep "^d" | awk '{print "  - " $9}' | grep -v "^\.\."
    exit 1
fi

# Validate tasks.json exists
if [ ! -f "$PROJECT_DIR/tasks.json" ]; then
    echo "⚠️  Tasks file not found: $PROJECT_DIR/tasks.json"
    echo "Run 'plan-tasks $PROJECT_NAME' first to create task structure"
    exit 1
fi

echo "➕ ADDING NEW TASK TO PROJECT: $PROJECT_NAME"
echo "============================================="
echo "Project directory: $PROJECT_DIR"
echo "Task title: $TASK_TITLE"
echo "Priority: $PRIORITY"
echo ""

echo "🔍 CODEBASE CONTEXT DISCOVERY (Required)"
echo "========================================"
echo "CRITICAL: LLM must perform comprehensive codebase analysis to understand:"
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
echo "🎯 TASK CONTEXT ANALYSIS"
echo "- Review existing tasks to understand project scope and dependencies"
echo "- Identify what already exists vs what's missing for this new task"
echo "- Determine appropriate priority based on blocking relationships"
echo "- Ensure task aligns with project's problem definition and technical approach"
echo ""

# Generate next available task ID
EXISTING_IDS=$(jq -r '.tasks[]?.id' "$PROJECT_DIR/tasks.json" 2>/dev/null | grep -E '^T[0-9]+$' | sed 's/T//' | sort -n || echo "0")
if [ -n "$EXISTING_IDS" ]; then
    LAST_ID=$(echo "$EXISTING_IDS" | tail -1)
    NEXT_ID=$((LAST_ID + 1))
else
    NEXT_ID=1
fi
TASK_ID="T$NEXT_ID"

echo "📝 Generated Task ID: $TASK_ID"
echo ""

# Read existing project context
PROBLEM_STATEMENT=""
if [ -f "$PROJECT_DIR/problem.json" ]; then
    PROBLEM_STATEMENT=$(jq -r '.problemStatement' "$PROJECT_DIR/problem.json" 2>/dev/null || echo "")
fi

TECH_LANGUAGE=""
TECH_FRAMEWORK=""
if [ -f "$PROJECT_DIR/technical.json" ]; then
    TECH_LANGUAGE=$(jq -r '.technologyStack.language' "$PROJECT_DIR/technical.json" 2>/dev/null || echo "")
    TECH_FRAMEWORK=$(jq -r '.technologyStack.framework' "$PROJECT_DIR/technical.json" 2>/dev/null || echo "")
fi

echo "📋 PROJECT CONTEXT"
echo "=================="
echo "Problem: $PROBLEM_STATEMENT"
echo "Tech Stack: $TECH_LANGUAGE/$TECH_FRAMEWORK"
echo ""

# Create timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")

# Create new task structure
NEW_TASK=$(cat << EOF
{
  "id": "$TASK_ID",
  "title": "$TASK_TITLE",
  "description": "Detailed description to be filled by LLM based on codebase analysis",
  "priority": "$PRIORITY",
  "status": "pending",
  "userStory": "To be derived from problem definition and task context",
  "levelOfEffort": 3,
  "contextAnalysis": {
    "whatExists": ["To be discovered through codebase analysis"],
    "whatsMissing": ["To be identified based on task requirements"]
  },
  "fileStructureChanges": {
    "newFiles": [],
    "modifiedFiles": [],
    "movedFiles": []
  },
  "implementationDetails": {
    "files": [],
    "functions": [],
    "apiEndpoints": [],
    "databaseChanges": []
  },
  "technicalSpecifications": "To be defined based on existing patterns",
  "implementationConstraints": ["Follow existing codebase patterns", "Do not break existing functionality"],
  "externalDependencies": [],
  "integrationPoints": [],
  "acceptanceCriteria": ["To be defined with specific, testable conditions"],
  "successDefinition": "Clear completion criteria to be defined",
  "outOfScope": ["To be explicitly defined to prevent scope creep"],
  "dependencies": [],
  "createdDate": "$TIMESTAMP",
  "updatedDate": "$TIMESTAMP"
}
EOF
)

# Add new task to tasks.json
jq --argjson newTask "$NEW_TASK" \
   --arg timestamp "$TIMESTAMP" '
  .tasks += [$newTask] |
  .metadata.updated = $timestamp
' "$PROJECT_DIR/tasks.json" > "$PROJECT_DIR/tasks.json.tmp" && mv "$PROJECT_DIR/tasks.json.tmp" "$PROJECT_DIR/tasks.json"

echo "✅ Added new task: $TASK_ID - $TASK_TITLE"
echo ""
echo "📝 NEXT STEPS (CRITICAL)"
echo "======================="
echo "1. LLM MUST perform comprehensive codebase analysis as outlined above"
echo "2. LLM MUST update the task with specific implementation details based on discovered patterns"
echo "3. LLM MUST define proper acceptance criteria and success definitions"
echo "4. LLM MUST identify dependencies and update other tasks if needed"
echo "5. LLM MUST set appropriate levelOfEffort based on complexity analysis"
echo ""
echo "📄 Task Template Created:"
echo "========================"
jq --arg taskId "$TASK_ID" '.tasks[] | select(.id == $taskId)' "$PROJECT_DIR/tasks.json"
echo ""
echo "🔧 To edit this task further:"
echo "edit $PROJECT_DIR/tasks.json"
echo ""
echo "📊 Current Project Status:"
jq -r '.tasks[] | "  - \(.id): \(.title) [\(.priority)] [\(.status)]"' "$PROJECT_DIR/tasks.json"
```

## Task Addition Heuristics

1. **Context-driven creation** - analyze existing codebase patterns before defining task
2. **Integration awareness** - ensure new task fits within existing project architecture
3. **Dependency management** - identify blocking relationships with other tasks
4. **Priority alignment** - set priority based on user impact and blocking relationships
5. **Scope clarity** - define clear boundaries of what IS and IS NOT included
6. **Pattern consistency** - follow existing project conventions and approaches
7. **Comprehensive specification** - include all required fields for complete task definition
8. **Dynamic discovery** - use LLM analysis rather than hardcoded patterns
9. **Validation ready** - include testable acceptance criteria
10. **Timeline independent** - focus on priority and dependencies, not time estimates

## Usage Examples

```bash
# Add a critical infrastructure task
add-task user-auth "Setup database migrations" P0

# Add an enhancement task  
add-task user-auth "Add password strength validation" P1

# Add a nice-to-have feature
add-task user-auth "Add remember me functionality" P2

# Complex task requiring analysis
add-task api-service "Implement rate limiting middleware" P1
```

## Integration with Existing Workflow

This command integrates with the existing task management workflow:

1. **plan-problem** - Define problem and users
2. **plan-technical** - Design technical approach  
3. **plan-tasks** - Break down initial tasks
4. **add-task** - Add discovered tasks during implementation ⭐ NEW
5. **execute** - Implement individual tasks

## Benefits

- **Dynamic task management** - Add tasks as requirements are discovered
- **Maintains project structure** - Preserves existing task organization
- **Context-aware** - Leverages codebase analysis for appropriate task definition
- **Dependency tracking** - Identifies blocking relationships
- **Priority management** - Fits new tasks into existing priority framework
- **Comprehensive specification** - Ensures new tasks have all required details