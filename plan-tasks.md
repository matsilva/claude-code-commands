---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Create simple task breakdown overview with priorities and dependencies
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`
- Problem definition: Check existing "📋 Problem & Users" project item
- Technical design: Check existing "🏗️ Technical Approach" project item

## Task

Create task breakdown overview for: $ARGUMENTS

**IMPORTANT: Focus on creating a simple overview of tasks with priorities and dependencies. Detailed task specs should be created later using the enhance-task command.**

**CRITICAL: Keep tasks high-level and focused. Avoid overengineering with too many detailed specifications at this planning stage.**

Create task breakdown overview based on problem definition and technical design:

### Planning Strategy
1. **Analyze problem definition** - understand user needs and success criteria
2. **Review technical approach** - identify key components and architecture
3. **Break into logical phases** - group related functionality together
4. **Identify dependencies** - what must be built before what
5. **Assign priorities** - P0 (core functionality), P1 (important features), P2 (enhancements)
6. **Create simple task list** - high-level tasks that can be enhanced later

### Task Overview Format
Create GitHub project item titled "📝 [Feature Name] - Tasks & Priority" containing:
- **Simple task list** - high-level implementation tasks
- **Priority grouping** - P0/P1/P2 organization
- **Basic dependencies** - what blocks what
- **Next steps** - guidance for using enhance-task command on individual tasks

### Priority Guidelines
- **P0 (Must Have):** Core functionality, blocks other work, user-critical
- **P1 (Should Have):** Important but not blocking, clear user value
- **P2 (Nice to Have):** Polish, optimization, future enhancement

## Output

Create single GitHub project item with simple task breakdown overview. Individual detailed tasks can be created later using the enhance-task command.

## Simple Workflow

```bash
# Validate arguments
if [ -z "$ARGUMENTS" ]; then
    echo "Error: Please provide feature name"
    echo "Usage: plan-tasks <feature-name>"
    echo "Example: plan-tasks 'User Authentication System'"
    exit 1
fi

# Get project details
PROJECT_NUMBER=$(gh project list --owner="@me" --format=json | jq -r '.[0].number' 2>/dev/null)
PROJECT_ID=$(gh project list --owner="@me" --format=json | jq -r '.[0].id' 2>/dev/null)

# Validate GitHub authentication
if ! gh auth status >/dev/null 2>&1; then
    echo "Error: Not authenticated with GitHub"
    echo "Run: gh auth login --with-token < ~/.config/gh/my_token.txt"
    exit 1
fi

# Add Priority field if not exists
gh project field-create $PROJECT_ID --name "Priority" --type "single_select" --options "P0,P1,P2" 2>/dev/null || true

echo "Creating task breakdown for: $ARGUMENTS"
echo "Analyzing problem definition and technical approach..."

# Get context from existing project items
PROBLEM_DEFINITION=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json 2>/dev/null | \
  jq -r '.[] | select(.title | startswith("📋") and (.title | contains("Problem"))) | .content.body' || echo "No problem definition found")

TECHNICAL_APPROACH=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json 2>/dev/null | \
  jq -r '.[] | select(.title | startswith("🏗️") and (.title | contains("Technical"))) | .content.body' || echo "No technical approach found")

# Create simple task breakdown overview
OVERVIEW_CONTENT="## Task Breakdown for $ARGUMENTS

### P0 Tasks (Must Have - Core Functionality)
- TASK-001: [First core implementation task]
- TASK-002: [Second core implementation task] 
- TASK-003: [Third core implementation task]

### P1 Tasks (Should Have - Important Features)
- TASK-004: [First important feature]
- TASK-005: [Second important feature]

### P2 Tasks (Nice to Have - Enhancements)
- TASK-006: [First enhancement]
- TASK-007: [Second enhancement]

### Dependencies
- TASK-002 depends on TASK-001
- TASK-003 depends on TASK-001, TASK-002
- TASK-004 depends on TASK-003
- TASK-005 depends on TASK-003
- TASK-006 depends on TASK-004
- TASK-007 depends on TASK-005

### Next Steps
1. Review this task breakdown
2. Use enhance-task command to add detailed specifications to individual tasks
3. Start with P0 tasks in dependency order
4. Example: \`enhance-task 9 TASK-001-ITEM-ID\`

### Context References
- Problem Definition: Check '📋 Problem & Users' project item
- Technical Approach: Check '🏗️ Technical Approach' project item

---
*Created on $(date)*
*Use enhance-task command to add detailed specifications to individual tasks*"

# Create the task breakdown overview item
gh project item-create $PROJECT_NUMBER \
  --owner "@me" \
  --title "📝 $ARGUMENTS - Tasks & Priority" \
  --body "$OVERVIEW_CONTENT"

if [ $? -eq 0 ]; then
    echo "✅ Task breakdown overview created successfully!"
    echo "📝 Created: '$ARGUMENTS - Tasks & Priority'"
    echo ""
    echo "Next Steps:"
    echo "1. Review the task breakdown in your GitHub project"
    echo "2. Use enhance-task command to add detailed specs to each task"
    echo "3. Start implementing P0 tasks in dependency order"
    echo ""
    echo "Example: enhance-task $PROJECT_NUMBER TASK-ITEM-ID"
else
    echo "❌ Failed to create task breakdown overview"
    echo "Check permissions and try again"
    exit 1
fi
```

## Planning Heuristics

1. **Keep it simple** - create high-level task overview, not detailed specifications
2. **Priority first** - focus on P0/P1/P2 organization and dependencies
3. **Use enhance-task later** - detailed specs should be added when ready to implement
4. **Logical grouping** - group related functionality together
5. **Dependency awareness** - identify what must be built before what
6. **Reference context** - point to problem definition and technical approach
7. **Clear next steps** - provide guidance for moving from planning to implementation
8. **Avoid overengineering** - resist the urge to add too much detail at planning stage