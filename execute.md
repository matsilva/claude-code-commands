---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Execute a single implementation task from local project files
---

## Context

- Current directory: !`pwd`
- Git repository: !`git remote -v 2>/dev/null | head -1 || echo "Not a git repository"`
- Existing projects: !`ls -la .codeloops/ 2>/dev/null | grep "^d" | awk '{print $9}' | grep -v "^\." || echo "No existing projects"`
- Available tasks: !`find .codeloops -name "tasks.json" 2>/dev/null | wc -l | tr -d ' '` projects with task definitions

## Task

Execute one specific task: $ARGUMENTS (format: <project_name> [task_id] or auto-pick next priority task)

**IMPORTANT: Work is executed by priority order only (P0 → P1 → P2). Ignore temporal pressure, deadlines, or time estimates. Focus on completing tasks properly based on dependencies and priority ranking.**

**CRITICAL: Implement ONLY what is specified in acceptance criteria. Review the "Out of Scope" section and strictly avoid implementing anything listed there. Scope creep is the enemy of focused execution.**

Single task execution workflow:

### Task Execution Steps

1. **Identify target task** - either specified task ID or auto-pick highest priority
2. **Create git branch** - create feature branch with consistent naming convention
3. **Validate dependencies** - ensure all blocking tasks are complete
4. **Move to "In Progress"** - update GitHub Projects status
5. **Implement with quality** - write code, tests, documentation following acceptance criteria
6. **Test and validate** - ensure all acceptance criteria are met

### Status Management

- **Todo** - Ready to start, dependencies met
- **In Progress** - Currently working on
- **In Review** - Implementation complete, needs review
- **Done** - Accepted and merged

### Quality Standards

- Follow existing code patterns and conventions
- Write tests for new functionality
- Update documentation as needed
- Consider edge cases and error handling

## Output

Complete one specific task from start to finish, updating local task status and implementing all acceptance criteria.

## Single Task Workflow

```bash
# Validate .codeloops directory exists
if [ ! -d ".codeloops" ]; then
    echo "⚠️  No .codeloops directory found"
    echo "Run 'plan-problem <feature_name>' first to create a project"
    exit 1
fi

# Parse arguments: <project_name> [task_id]
if [ -z "$ARGUMENTS" ]; then
    echo "📋 Available projects:"
    ls -la .codeloops/ 2>/dev/null | grep "^d" | awk '{print "  - " $9}' | grep -v "^\.\."
    echo ""
    echo "Usage: execute <project_name> [task_id]"
    echo "Example: execute user-authentication-feature T1"
    echo "Example: execute user-authentication-feature  # auto-pick highest priority"
    exit 1
fi

# Extract project name and optional task ID
PROJECT_NAME=$(echo "$ARGUMENTS" | awk '{print $1}')
TASK_ID=$(echo "$ARGUMENTS" | awk '{print $2}')

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

# Validate required files exist
if [ ! -f "$PROJECT_DIR/problem.json" ]; then
    echo "⚠️  Problem definition not found: $PROJECT_DIR/problem.json"
    echo "Run 'plan-problem $PROJECT_NAME' first"
    exit 1
fi

if [ ! -f "$PROJECT_DIR/technical.json" ]; then
    echo "⚠️  Technical approach not found: $PROJECT_DIR/technical.json"
    echo "Run 'plan-technical $PROJECT_NAME' first"
    exit 1
fi

if [ ! -f "$PROJECT_DIR/tasks.json" ]; then
    echo "⚠️  Task breakdown not found: $PROJECT_DIR/tasks.json"
    echo "Run 'plan-tasks $PROJECT_NAME' first"
    exit 1
fi

echo "🎯 EXECUTING TASK FOR PROJECT: $PROJECT_NAME"
echo "================================================"
echo "Project directory: $PROJECT_DIR"
echo ""

# Find specific task or auto-pick next P0
if [ -n "$TASK_ID" ]; then
    # Use specified task ID
    TASK=$(jq --arg task_id "$TASK_ID" '.tasks[] | select(.id == $task_id)' "$PROJECT_DIR/tasks.json")
    if [ "$TASK" = "null" ] || [ -z "$TASK" ]; then
        echo "⚠️  Task ID '$TASK_ID' not found in $PROJECT_DIR/tasks.json"
        echo "Available tasks:"
        jq -r '.tasks[] | "  - \(.id): \(.title) [\(.priority)] [\(.status)]"' "$PROJECT_DIR/tasks.json"
        exit 1
    fi
else
    # Auto-pick highest priority pending task
    TASK=$(jq '.tasks[] | select(.status == "pending") | select(.priority == "P0")' "$PROJECT_DIR/tasks.json" | head -1)
    if [ "$TASK" = "null" ] || [ -z "$TASK" ]; then
        # Try P1 if no P0 tasks
        TASK=$(jq '.tasks[] | select(.status == "pending") | select(.priority == "P1")' "$PROJECT_DIR/tasks.json" | head -1)
        if [ "$TASK" = "null" ] || [ -z "$TASK" ]; then
            # Try P2 if no P1 tasks
            TASK=$(jq '.tasks[] | select(.status == "pending") | select(.priority == "P2")' "$PROJECT_DIR/tasks.json" | head -1)
            if [ "$TASK" = "null" ] || [ -z "$TASK" ]; then
                echo "⚠️  No pending tasks found in $PROJECT_DIR/tasks.json"
                echo "Available tasks:"
                jq -r '.tasks[] | "  - \(.id): \(.title) [\(.priority)] [\(.status)]"' "$PROJECT_DIR/tasks.json"
                exit 1
            fi
        fi
    fi
    TASK_ID=$(echo "$TASK" | jq -r '.id')
fi

# Extract task details
TASK_TITLE=$(echo "$TASK" | jq -r '.title')
TASK_DESCRIPTION=$(echo "$TASK" | jq -r '.description')
TASK_PRIORITY=$(echo "$TASK" | jq -r '.priority')
TASK_STATUS=$(echo "$TASK" | jq -r '.status')
USER_STORY=$(echo "$TASK" | jq -r '.userStory')
ACCEPTANCE_CRITERIA=$(echo "$TASK" | jq -r '.acceptanceCriteria | join("\n- ")')
OUT_OF_SCOPE=$(echo "$TASK" | jq -r '.outOfScope | join("\n- ")')

echo "Selected task: $TASK_ID - $TASK_TITLE [$TASK_PRIORITY]"

# Validate dependencies are met
DEPENDENCIES=$(echo "$TASK" | jq -r '.dependencies[]?' 2>/dev/null)
if [ -n "$DEPENDENCIES" ]; then
    echo ""
    echo "🔍 Checking task dependencies..."
    for dep in $DEPENDENCIES; do
        DEP_STATUS=$(jq -r --arg dep_id "$dep" '.tasks[] | select(.id == $dep_id) | .status' "$PROJECT_DIR/tasks.json")
        if [ "$DEP_STATUS" != "completed" ]; then
            echo "⚠️  Dependency $dep is not completed (status: $DEP_STATUS)"
            echo "Complete dependency first before working on this task"
            exit 1
        else
            echo "✅ Dependency $dep is completed"
        fi
    done
fi

# Create git branch with consistent naming convention
BRANCH_NAME=$(echo "$PROJECT_NAME-$TASK_ID" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
echo ""
echo "🌿 Creating git branch: $BRANCH_NAME"

# Ensure we're on main and up to date
git checkout main
git pull origin main 2>/dev/null || echo "⚠️  Could not pull from origin (working offline)"

# Create and checkout new branch
git checkout -b "$BRANCH_NAME"

# Read project context files
PROBLEM_DEFINITION=$(jq -r '.problemStatement' "$PROJECT_DIR/problem.json")
WHY=$(jq -r '.why' "$PROJECT_DIR/problem.json")
SUCCESS_CRITERIA=$(jq -r '.successCriteria | join(", ")' "$PROJECT_DIR/problem.json")
CONSTRAINTS=$(jq -r '.constraints.technical' "$PROJECT_DIR/problem.json")

TECH_LANGUAGE=$(jq -r '.technologyStack.language' "$PROJECT_DIR/technical.json")
TECH_FRAMEWORK=$(jq -r '.technologyStack.framework' "$PROJECT_DIR/technical.json")
TECH_DEPENDENCIES=$(jq -r '.technologyStack.dependencies | join(", ")' "$PROJECT_DIR/technical.json")

# Update task status to in_progress
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
jq --arg task_id "$TASK_ID" --arg timestamp "$TIMESTAMP" '
  (.tasks[] | select(.id == $task_id) | .status) = "in_progress" |
  (.tasks[] | select(.id == $task_id) | .updatedDate) = $timestamp
' "$PROJECT_DIR/tasks.json" > "$PROJECT_DIR/tasks.json.tmp" && mv "$PROJECT_DIR/tasks.json.tmp" "$PROJECT_DIR/tasks.json"

echo ""
echo "🎯 FULL CONTEXT FOR IMPLEMENTATION"
echo "===================================="
echo ""

echo "📋 ORIGINAL PROBLEM & USERS"
echo "============================"
echo "Problem: $PROBLEM_DEFINITION"
echo "Why: $WHY"
echo "Success Criteria: $SUCCESS_CRITERIA"
echo "Technical Constraints: $CONSTRAINTS"
echo ""

echo "🏗️ TECHNICAL DESIGN"
echo "===================="
echo "Language: $TECH_LANGUAGE"
echo "Framework: $TECH_FRAMEWORK"
echo "Dependencies: $TECH_DEPENDENCIES"
echo ""

echo "🎯 CURRENT TASK DETAILS"
echo "========================"
echo "Task: $TASK_TITLE"
echo "Description: $TASK_DESCRIPTION"
echo "Priority: $TASK_PRIORITY"
echo "User Story: $USER_STORY"
echo ""
echo "Acceptance Criteria:"
echo "- $ACCEPTANCE_CRITERIA"
echo ""

if [ "$OUT_OF_SCOPE" != "null" ] && [ -n "$OUT_OF_SCOPE" ]; then
    echo "⚠️  SCOPE BOUNDARY CHECK ⚠️"
    echo "=============================="
    echo "Do NOT implement the following (Out of Scope):"
    echo "- $OUT_OF_SCOPE"
    echo ""
fi

echo "📚 IMPLEMENTATION GUIDANCE"
echo "==========================="
echo "- Follow the technical design patterns and architecture above"
echo "- Keep the original problem and users in mind while implementing"
echo "- Ensure your solution fits within the broader system design"
echo "- Stick strictly to the acceptance criteria and nothing more"
echo "- Review task breakdown overview to understand dependencies"
echo ""

echo "✅ Task moved to 'in_progress'. Ready to implement!"
echo ""
echo "💡 After implementation, run:"
echo "   jq '(.tasks[] | select(.id == \"$TASK_ID\") | .status) = \"completed\"' $PROJECT_DIR/tasks.json > tmp && mv tmp $PROJECT_DIR/tasks.json"
```

## Local Task Execution Heuristics

1. **Local-first workflow** - all planning and task data stored locally with the code
2. **Context first** - always review problem definition and technical design before coding
3. **One task, done well** - focus completely on current task until completion
4. **Priority-driven execution** - work strictly by priority order (P0 → P1 → P2), ignore time pressure
5. **Follow acceptance criteria exactly** - implement exactly what's defined, no more, no less
6. **Respect scope boundaries** - strictly avoid anything in "Out of Scope" section
7. **Design alignment** - ensure implementation follows the technical approach and architecture
8. **Problem awareness** - keep original user needs and problem statement in mind
9. **Dependencies first** - ensure all blocking tasks are truly complete
10. **Completion over speed** - focus on finishing tasks properly, not meeting deadlines
11. **Test as you go** - validate each acceptance criterion as you implement
12. **Status transparency** - keep local JSON files updated with real progress
13. **No feature creep** - resist urge to add "helpful" features not in acceptance criteria
14. **Version controlled planning** - all task data tracked in git with the code
15. **Project isolation** - each feature/task/bugfix maintains separate planning files
