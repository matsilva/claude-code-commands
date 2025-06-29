---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Execute a single implementation task from the GitHub Projects board
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`
- Next P0 task: !`gh project item-list $(gh project list --owner="@me" --format=json | jq -r '.[0].id') --format=json | jq -r '.[] | select(.title | startswith("TASK-")) | select(.fieldValues.Priority == "P0") | "\(.title)"' | head -1`
- Task details: !`gh project item-list $(gh project list --owner="@me" --format=json | jq -r '.[0].id') --format=json | jq -r '.[] | select(.title | startswith("TASK-")) | select(.fieldValues.Priority == "P0") | .content.body' | head -1`

## Task

Execute one specific task: $ARGUMENTS (or auto-pick next priority task)

**IMPORTANT: Work is executed by priority order only (P0 → P1 → P2). Ignore temporal pressure, deadlines, or time estimates. Focus on completing tasks properly based on dependencies and priority ranking.**

Single task execution workflow:

### Task Execution Steps
1. **Identify target task** - either specified task ID or auto-pick highest priority
2. **Create git branch** - create feature branch with consistent naming convention
3. **Validate dependencies** - ensure all blocking tasks are complete
4. **Move to "In Progress"** - update GitHub Projects status
5. **Implement with quality** - write code, tests, documentation following acceptance criteria
6. **Test and validate** - ensure all acceptance criteria are met
7. **Use execute-commit** - commit progress and push to remote branch
8. **Use execute-pr** - create pull request when task is complete

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

Complete one specific task from start to finish, updating GitHub Projects status and implementing all acceptance criteria.

## Single Task Workflow

```bash
# Get project
PROJECT_ID=$(gh project list --owner="@me" --format=json | jq -r '.[0].id')

# Find specific task or auto-pick next P0
if [[ "$ARGUMENTS" == TASK-* ]]; then
  TASK_TITLE="$ARGUMENTS"
else
  TASK_TITLE=$(gh project item-list $PROJECT_ID --format=json | \
    jq -r '.[] | select(.title | startswith("TASK-")) | select(.fieldValues.Priority == "P0") | .title' | \
    head -1)
fi

echo "Working on: $TASK_TITLE"

# Create git branch with consistent naming convention
BRANCH_NAME=$(echo "$TASK_TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
echo "Creating branch: $BRANCH_NAME"

# Ensure we're on main and up to date
git checkout main
git pull origin main

# Create and checkout new branch
git checkout -b "$BRANCH_NAME"

# Get task details
TASK_ITEM_ID=$(gh project item-list $PROJECT_ID --format=json | \
  jq -r --arg title "$TASK_TITLE" '.[] | select(.title == $title) | .id')

TASK_BODY=$(gh project item-list $PROJECT_ID --format=json | \
  jq -r --arg title "$TASK_TITLE" '.[] | select(.title == $title) | .content.body')

echo "Task Details:"
echo "$TASK_BODY"

# Move to In Progress
STATUS_FIELD_ID=$(gh project field-list $PROJECT_ID --format=json | \
  jq -r '.[] | select(.name=="Status") | .id')

gh project item-edit --id $TASK_ITEM_ID --field-id $STATUS_FIELD_ID \
  --single-select-option-id "In Progress"

echo "Task moved to In Progress. Ready to implement!"

# After implementation, move to Done:
# gh project item-edit --id $TASK_ITEM_ID --field-id $STATUS_FIELD_ID \
#   --single-select-option-id "Done"
```

## Single Task Heuristics

1. **One task, done well** - focus completely on current task until completion
2. **Priority-driven execution** - work strictly by priority order (P0 → P1 → P2), ignore time pressure
3. **Follow acceptance criteria** - implement exactly what's defined, no more, no less
4. **Dependencies first** - ensure all blocking tasks are truly complete
5. **Completion over speed** - focus on finishing tasks properly, not meeting deadlines
6. **Test as you go** - validate each acceptance criterion as you implement
7. **Status transparency** - keep GitHub Projects updated with real progress
8. **Ask for help early** - if blocked, update status and seek assistance