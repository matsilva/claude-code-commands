---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), mcp__codeloops__*
description: Create a comprehensive software development plan with GitHub Projects integration for end-to-end planning and implementation progress tracking
---

## Context

- Current directory: !`pwd`
- Git status: !`git status 2>/dev/null || echo "Not a git repository"`
- GitHub repository: !`gh repo view --json url,name,owner 2>/dev/null || echo "Not a GitHub repository"`
- Project structure: !`ls -la`
- Existing TODOs: !`claude-code todo read 2>/dev/null || echo "No existing todos"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`

## Task

Create a comprehensive software development plan for: $ARGUMENTS

Use the codeloops actor-critic system to iteratively refine the plan. Structure the plan with:

### 1. Problem Definition
- Clear problem statement
- Success criteria (measurable outcomes)
- Constraints (technical, business, user)
- Non-goals (what we explicitly won't do)

### 2. User Flows & Experience
- User personas with goals and pain points
- User stories in "As a... I want... So that..." format
- Core user flows with decision points
- UI/UX considerations (responsive, accessibility, performance)

### 3. Technical Design
- Technology stack decisions with rationale
- API design with endpoints and schemas
- Data models with TypeScript interfaces
- Security considerations (auth, encryption, validation)

### 4. Architecture
- System architecture diagram
- Component/folder structure
- Integration points
- Scalability considerations

### 5. Implementation Plan
- Break down into phases/epics
- Create specific tasks with:
  - Unique ID (TASK-XXX)
  - Clear acceptance criteria
  - Time estimates
  - Priority (P0/P1/P2)
  - Dependencies

### 6. Testing & Quality
- Test coverage targets
- Testing strategy (unit, integration, E2E)
- Quality metrics

### 7. Progress Tracking & GitHub Integration
- Milestones with dates and GitHub milestones
- Risk register with issue labels
- GitHub Projects board with automated workflows
- Issue templates for consistent task creation
- Pull request templates with checklist references

## Output Format

1. Create a `PROJECT_PLAN.md` file in the current directory
2. Set up GitHub Projects board with custom fields and views
3. Create GitHub milestones for major phases
4. Generate GitHub issues for all implementation tasks with:
   - Proper labels (priority, type, epic)
   - Assignees and due dates
   - Task dependencies via blocking relationships
5. Set up issue and PR templates in `.github/` directory
6. Use TodoWrite to create initial high-level tasks
7. Provide a summary with GitHub Projects board URL and next steps

## GitHub Projects Setup Workflow

### Automated Board Creation
```bash
# Create new GitHub Project
gh project create --title "$PROJECT_NAME" --owner "@me"

# Add custom fields
gh project field-create $PROJECT_ID --name "Priority" --type "single_select" --options "P0,P1,P2,P3"
gh project field-create $PROJECT_ID --name "Epic" --type "text"
gh project field-create $PROJECT_ID --name "Effort" --type "single_select" --options "XS,S,M,L,XL"
gh project field-create $PROJECT_ID --name "Phase" --type "single_select" --options "Planning,Design,Implementation,Testing,Review"

# Create views
gh project view-create $PROJECT_ID --name "By Priority" --type "board" --field "Priority"
gh project view-create $PROJECT_ID --name "By Epic" --type "board" --field "Epic"
gh project view-create $PROJECT_ID --name "Sprint Board" --type "board" --field "Status"
```

### Issue Creation Template
```bash
# Create issues with proper linking
gh issue create \
  --title "$TASK_TITLE" \
  --body "$TASK_DESCRIPTION" \
  --label "priority:$PRIORITY,type:$TYPE,epic:$EPIC" \
  --milestone "$MILESTONE" \
  --assignee "@me"

# Link to project
gh project item-add $PROJECT_ID --url "$ISSUE_URL"
```

## Guidelines

- Be specific and actionable - avoid vague descriptions
- Every task should have clear completion criteria with GitHub issue acceptance criteria
- Consider edge cases and error scenarios
- Think about maintainability and future extensibility
- Use existing project patterns and conventions where applicable
- Leverage codeloops for iterative refinement of each section
- Integrate GitHub Projects for real-time progress tracking
- Use GitHub milestones to track major deliverables
- Set up automated workflows for status updates