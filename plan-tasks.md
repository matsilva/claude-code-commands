---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Break down feature into prioritized, actionable tasks with dependencies
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- Problem definition: Check existing "📋 Problem & Users" project item
- Technical design: Check existing "🏗️ Technical Approach" project item

## Task

Break down implementation plan for: $ARGUMENTS

Create specific, actionable tasks based on problem definition and technical design:

### Task Breakdown Strategy
1. **Start with user stories** from problem definition
2. **Map to technical components** from technical design  
3. **Identify dependencies** - what blocks what?
4. **Prioritize ruthlessly** - P0 (must have), P1 (should have), P2 (nice to have)

### Task Format
Each task should be:
- **User story format:** "As a [user], I want [goal], so that [benefit]"
- **Clear acceptance criteria:** Specific, testable conditions for "done"
- **Proper priority:** P0/P1/P2 based on user impact and dependencies
- **Dependencies noted:** What must be completed first?

### Priority Guidelines
- **P0 (Must Have):** Core functionality, blocks other work, user-critical
- **P1 (Should Have):** Important but not blocking, clear user value
- **P2 (Nice to Have):** Polish, optimization, future enhancement

## Output

1. Create GitHub project item titled "📝 Tasks & Priority" with task breakdown overview
2. Create individual project items for each implementation task
3. Set Priority field for each task item

## Simple Workflow

```bash
# Find or create project  
PROJECT_ID=$(gh project list --owner="@me" --format=json | jq -r '.[0].id' 2>/dev/null)

# Add Priority field if not exists
gh project field-create $PROJECT_ID --name "Priority" --type "single_select" --options "P0,P1,P2" 2>/dev/null || true

# Create tasks overview item
gh project item-create $PROJECT_ID \
  --title "📝 Tasks & Priority" \
  --body "$(cat <<'EOF'
## Task Breakdown

### P0 Tasks (Must Have)
- TASK-001: [user story] - [acceptance criteria]
- TASK-002: [user story] - [acceptance criteria]

### P1 Tasks (Should Have)  
- TASK-003: [user story] - [acceptance criteria]

### P2 Tasks (Nice to Have)
- TASK-004: [user story] - [acceptance criteria]

### Dependencies
- TASK-002 depends on TASK-001
- TASK-003 depends on TASK-001, TASK-002
EOF
)"

# Create individual task items
gh project item-create $PROJECT_ID \
  --title "TASK-001: [Task Title]" \
  --body "$(cat <<'EOF'
**User Story:** As a [user], I want [goal], so that [benefit]

**Acceptance Criteria:**
- [ ] Specific testable condition 1
- [ ] Specific testable condition 2
- [ ] Specific testable condition 3

**Dependencies:** None (or list blocking tasks)
**Priority:** P0
EOF
)"

# Set priority field
PRIORITY_FIELD_ID=$(gh project field-list $PROJECT_ID --format=json | jq -r '.[] | select(.name=="Priority") | .id')
ITEM_ID=$(gh project item-list $PROJECT_ID --format=json | jq -r '.[0].id')
gh project item-edit --id $ITEM_ID --field-id $PRIORITY_FIELD_ID --single-select-option-id "P0"
```

## Task Planning Heuristics

1. **User value first** - prioritize by user impact, not technical complexity
2. **Small, testable chunks** - each task should be completable in 1-3 days
3. **Clear done criteria** - acceptance criteria should be specific and testable
4. **Dependency aware** - identify and call out blocking relationships
5. **Iterate and refine** - tasks will evolve as you learn more during implementation