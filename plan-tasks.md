---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Break down feature into prioritized, actionable tasks with dependencies
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`
- Problem definition: Check existing "📋 Problem & Users" project item
- Technical design: Check existing "🏗️ Technical Approach" project item

## Task

Break down implementation plan for: $ARGUMENTS

**IMPORTANT: Focus on priority and execution order, NOT temporal planning. Time estimates and deadlines are irrelevant - only priority (P0/P1/P2) and task dependencies matter.**

Create specific, actionable tasks based on problem definition and technical design:

### Task Breakdown Strategy
1. **Start with user stories** from problem definition
2. **Map to technical components** from technical design  
3. **Identify dependencies** - what blocks what?
4. **Prioritize ruthlessly** - P0 (must have), P1 (should have), P2 (nice to have)

### Task Format
Each task becomes its own GitHub project item with:
- **Title:** "TASK-XXX: [Actual descriptive task title based on what needs to be done]"
- **User story format:** "As a [user], I want [goal], so that [benefit]"
- **Clear acceptance criteria:** Specific, testable conditions for "done"
- **Proper priority:** P0/P1/P2 based on user impact and dependencies
- **Dependencies noted:** What must be completed first?

### Priority Guidelines
- **P0 (Must Have):** Core functionality, blocks other work, user-critical
- **P1 (Should Have):** Important but not blocking, clear user value
- **P2 (Nice to Have):** Polish, optimization, future enhancement

## Output

1. Create GitHub project item titled "📝 [Feature Name] - Tasks & Priority" with task breakdown overview (use actual feature name)
2. **Create individual GitHub project items for EACH implementation task** (every task becomes its own project item)
3. Set Priority field for each task item

## Simple Workflow

```bash
# Find or create project  
PROJECT_ID=$(gh project list --owner="@me" --format=json | jq -r '.[0].id' 2>/dev/null)

# Add Priority field if not exists
gh project field-create $PROJECT_ID --name "Priority" --type "single_select" --options "P0,P1,P2" 2>/dev/null || true

# Create tasks overview item (use actual feature name from $ARGUMENTS)
gh project item-create $PROJECT_ID \
  --title "📝 User Authentication System - Tasks & Priority" \
  --body "$(cat <<'EOF'
## Task Breakdown

### P0 Tasks (Must Have)
- TASK-001: Create user authentication system - Login/logout with email/password
- TASK-002: Implement user dashboard UI - Main dashboard with nav and content areas

### P1 Tasks (Should Have)  
- TASK-003: Add user profile management - Users can view and edit their profile

### P2 Tasks (Nice to Have)
- TASK-004: Implement advanced search filters - Filter by date, category, status

### Dependencies
- TASK-002 depends on TASK-001
- TASK-003 depends on TASK-001, TASK-002
EOF
)"

# Create individual GitHub project items for EACH task
# IMPORTANT: Every implementation task must be its own GitHub project item

# Task 1 (P0) - Use actual descriptive title
gh project item-create $PROJECT_ID \
  --title "TASK-001: Create user authentication system" \
  --body "$(cat <<'EOF'
**User Story:** As a new user, I want to create an account and log in, so that I can access the application securely

**Acceptance Criteria:**
- [ ] User can register with email and password
- [ ] User can log in with valid credentials
- [ ] User sessions are properly managed and secure
- [ ] Password validation and error handling works

**Dependencies:** None
**Priority:** P0
EOF
)"

# Task 2 (P0) - Use actual descriptive title
gh project item-create $PROJECT_ID \
  --title "TASK-002: Implement user dashboard UI" \
  --body "$(cat <<'EOF'
**User Story:** As a logged-in user, I want to see a personalized dashboard, so that I can quickly access key features and information

**Acceptance Criteria:**
- [ ] Dashboard displays user-specific content
- [ ] Navigation menu is accessible and functional  
- [ ] Page loads quickly and is responsive
- [ ] User can access main features from dashboard

**Dependencies:** TASK-001
**Priority:** P0
EOF
)"

# Task 3 (P1) - Continue with real examples
gh project item-create $PROJECT_ID \
  --title "TASK-003: Add user profile management" \
  --body "$(cat <<'EOF'
**User Story:** As a user, I want to view and edit my profile information, so that I can keep my account details current

**Acceptance Criteria:**
- [ ] User can view current profile information
- [ ] User can edit name, email, and other details
- [ ] Changes are saved and validated properly
- [ ] User receives confirmation of updates

**Dependencies:** TASK-001
**Priority:** P1
EOF
)"

# Task 4 (P2) - Complete the example set
gh project item-create $PROJECT_ID \
  --title "TASK-004: Implement advanced search filters" \
  --body "$(cat <<'EOF'
**User Story:** As a power user, I want advanced filtering options, so that I can quickly find specific content

**Acceptance Criteria:**
- [ ] Filter by date range works correctly
- [ ] Category filtering is functional
- [ ] Status filtering shows accurate results
- [ ] Multiple filters can be combined
- [ ] Filter state persists during session

**Dependencies:** TASK-002
**Priority:** P2
EOF
)"

# Set priority field for each task item
PRIORITY_FIELD_ID=$(gh project field-list $PROJECT_ID --format=json | jq -r '.[] | select(.name=="Priority") | .id')

# Set priority for each task
# P0 tasks
for task_title in "TASK-001" "TASK-002"; do
  ITEM_ID=$(gh project item-list $PROJECT_ID --format=json | jq -r --arg title "$task_title" '.[] | select(.title | contains($title)) | .id')
  gh project item-edit --id $ITEM_ID --field-id $PRIORITY_FIELD_ID --single-select-option-id "P0"
done

# P1 tasks  
ITEM_ID=$(gh project item-list $PROJECT_ID --format=json | jq -r '.[] | select(.title | contains("TASK-003")) | .id')
gh project item-edit --id $ITEM_ID --field-id $PRIORITY_FIELD_ID --single-select-option-id "P1"

# P2 tasks
ITEM_ID=$(gh project item-list $PROJECT_ID --format=json | jq -r '.[] | select(.title | contains("TASK-004")) | .id')
gh project item-edit --id $ITEM_ID --field-id $PRIORITY_FIELD_ID --single-select-option-id "P2"
```

## Task Planning Heuristics

1. **One task, one project item** - every implementation task must be its own GitHub project item
2. **User value first** - prioritize by user impact, not technical complexity
3. **Priority over time** - use P0/P1/P2 rankings, never time estimates or deadlines
4. **Execution order only** - focus on what must be done before what, ignore temporal planning
5. **Small, testable chunks** - each task should be completable and verifiable
6. **Clear done criteria** - acceptance criteria should be specific and testable
7. **Dependency aware** - identify and call out blocking relationships
8. **Iterate and refine** - tasks will evolve as you learn more during implementation