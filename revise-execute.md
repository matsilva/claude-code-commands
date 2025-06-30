---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Revise task based on execution feedback, update acceptance criteria, and re-execute
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- Current branch: !`git branch --show-current`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`

## Task

Revise current task based on execution feedback: $ARGUMENTS

Update task acceptance criteria based on feedback from previous execution attempt, then continue implementing the revised requirements.

## Output

Update GitHub Projects task with revised acceptance criteria based on feedback, then continue execution on the same branch.

## Revision & Re-execution Workflow

```bash
# Get current branch and extract task info
CURRENT_BRANCH=$(git branch --show-current)

if [[ "$CURRENT_BRANCH" == "main" ]] || [[ "$CURRENT_BRANCH" == "master" ]]; then
  echo "Error: Not on a task branch. Run 'execute' command first to start a task."
  exit 1
fi

# Extract task ID from branch name
TASK_ID=$(echo "$CURRENT_BRANCH" | grep -o "task-[0-9]*" | head -1 | tr '[:lower:]' '[:upper:]')

if [ -z "$TASK_ID" ]; then
  echo "Error: Could not extract task ID from branch: $CURRENT_BRANCH"
  exit 1
fi

echo "Revising task: $TASK_ID based on feedback"
echo "Feedback: $ARGUMENTS"

# Get project and task details
PROJECT_NUMBER=$(gh project list --owner="@me" --format=json | jq -r '.[0].number')
PROJECT_ID=$(gh project list --owner="@me" --format=json | jq -r '.[0].id')
TASK_ITEM_ID=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json | \
  jq -r --arg task "$TASK_ID" '.[] | select(.title | contains($task)) | .id')

if [ -z "$TASK_ITEM_ID" ]; then
  echo "Error: Could not find task $TASK_ID in GitHub Projects"
  exit 1
fi

# Get current task content
CURRENT_CONTENT=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json | \
  jq -r --arg task "$TASK_ID" '.[] | select(.title | contains($task)) | .content.body')

echo "Current task content:"
echo "$CURRENT_CONTENT"
echo ""

# Parse current content components
USER_STORY=$(echo "$CURRENT_CONTENT" | grep "User Story:" | sed 's/\*\*User Story:\*\* //')
DEPENDENCIES=$(echo "$CURRENT_CONTENT" | grep "Dependencies:" | sed 's/\*\*Dependencies:\*\* //')
PRIORITY=$(echo "$CURRENT_CONTENT" | grep "Priority:" | sed 's/\*\*Priority:\*\* //')

# Extract current acceptance criteria and progress
CURRENT_CRITERIA=$(echo "$CURRENT_CONTENT" | sed -n '/\*\*Acceptance Criteria:\*\*/,/\*\*Progress Update:\*\*/p' | head -n -1 | tail -n +2)
CURRENT_PROGRESS=$(echo "$CURRENT_CONTENT" | sed -n '/\*\*Progress Update:\*\*/,/\*\*Dependencies:\*\*/p' | head -n -1 | tail -n +2)

echo "Based on feedback: $ARGUMENTS"
echo ""
echo "Current acceptance criteria:"
echo "$CURRENT_CRITERIA"
echo ""
echo "Update acceptance criteria to address feedback:"
echo "- Mark completed items: [ ] → [x]"
echo "- Add new requirements from feedback"
echo "- Modify existing criteria as needed"
echo ""
echo "Enter updated acceptance criteria (type 'END' on new line when finished):"

# Read updated acceptance criteria
UPDATED_CRITERIA=""
while IFS= read -r line; do
  if [ "$line" = "END" ]; then
    break
  fi
  UPDATED_CRITERIA="$UPDATED_CRITERIA$line"$'\n'
done

# If no update provided, keep current
if [ -z "$UPDATED_CRITERIA" ]; then
  UPDATED_CRITERIA="$CURRENT_CRITERIA"
fi

# Create updated task content with feedback incorporated
FEEDBACK_SECTION=""
if [ -n "$CURRENT_PROGRESS" ]; then
  FEEDBACK_SECTION="$CURRENT_PROGRESS

**Latest Feedback & Revision:**
$ARGUMENTS
"
else
  FEEDBACK_SECTION="**Latest Feedback & Revision:**
$ARGUMENTS
"
fi

UPDATED_CONTENT="**User Story:** $USER_STORY

**Acceptance Criteria:**
$UPDATED_CRITERIA

**Progress Update:**
$FEEDBACK_SECTION

**Dependencies:** $DEPENDENCIES
**Priority:** $PRIORITY"

# Update the GitHub Projects task item
gh project item-edit --id $TASK_ITEM_ID \
  --body "$UPDATED_CONTENT"

echo ""
echo "Task $TASK_ID updated with revised acceptance criteria"
echo "Feedback incorporated: $ARGUMENTS"

# Show git status and continue working
echo ""
echo "Current git status:"
git status --short

echo ""
echo "Ready to continue implementation with revised requirements."
echo "Use 'execute-commit' when ready to commit progress."
echo "Use 'execute-update' to mark criteria complete as you work."
```

## Revision Heuristics

1. **Feedback-driven refinement** - use execution experience to improve task definition
2. **Preserve completed work** - mark already finished criteria as [x] completed
3. **Add discovered requirements** - include new criteria found during implementation
4. **Iterate in place** - continue on same branch with refined understanding
5. **Document feedback** - record what was learned and why changes were made
6. **Stay focused** - maintain single task focus while incorporating feedback
7. **Update regularly** - use execute-update to track progress on revised criteria

