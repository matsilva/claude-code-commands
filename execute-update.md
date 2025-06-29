---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Update task progress and acceptance criteria checklist during execution
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- Current branch: !`git branch --show-current`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`

## Task

Update task progress and acceptance criteria for: $ARGUMENTS

Update the GitHub Projects task item to reflect current progress, mark completed acceptance criteria as done, and add any new work items discovered during implementation.

## Output

Update the GitHub Projects task item with current progress, marking completed items and adding new discovered work items to the acceptance criteria checklist.

## Update Workflow

```bash
# Check if we're on a task branch
CURRENT_BRANCH=$(git branch --show-current)

if [[ "$CURRENT_BRANCH" == "main" ]] || [[ "$CURRENT_BRANCH" == "master" ]]; then
  echo "Error: Not on a task branch. Use 'execute' command to start a task first."
  exit 1
fi

# Extract task ID from branch name or use provided argument
if [[ "$ARGUMENTS" == TASK-* ]]; then
  TASK_ID="$ARGUMENTS"
else
  TASK_ID=$(echo "$CURRENT_BRANCH" | grep -o "task-[0-9]*" | head -1 | tr '[:lower:]' '[:upper:]')
fi

if [ -z "$TASK_ID" ]; then
  echo "Error: Could not determine task ID. Provide task ID as argument or ensure branch name contains task ID."
  exit 1
fi

echo "Updating progress for: $TASK_ID"

# Get project and task details
PROJECT_ID=$(gh project list --owner="@me" --format=json | jq -r '.[0].id')
TASK_ITEM_ID=$(gh project item-list $PROJECT_ID --format=json | \
  jq -r --arg task "$TASK_ID" '.[] | select(.title | contains($task)) | .id')

if [ -z "$TASK_ITEM_ID" ]; then
  echo "Error: Could not find task $TASK_ID in GitHub Projects"
  exit 1
fi

# Get current task content
CURRENT_CONTENT=$(gh project item-list $PROJECT_ID --format=json | \
  jq -r --arg task "$TASK_ID" '.[] | select(.title | contains($task)) | .content.body')

echo "Current task content:"
echo "$CURRENT_CONTENT"
echo ""
echo "Enter your progress update (what work has been completed):"
read -r PROGRESS_UPDATE

# Parse current content to extract components
USER_STORY=$(echo "$CURRENT_CONTENT" | grep "User Story:" | sed 's/\*\*User Story:\*\* //')
DEPENDENCIES=$(echo "$CURRENT_CONTENT" | grep "Dependencies:" | sed 's/\*\*Dependencies:\*\* //')
PRIORITY=$(echo "$CURRENT_CONTENT" | grep "Priority:" | sed 's/\*\*Priority:\*\* //')

# Extract current acceptance criteria
CURRENT_CRITERIA=$(echo "$CURRENT_CONTENT" | sed -n '/\*\*Acceptance Criteria:\*\*/,/\*\*Dependencies:\*\*/p' | head -n -1 | tail -n +2)

echo ""
echo "Current acceptance criteria:"
echo "$CURRENT_CRITERIA"
echo ""
echo "Mark any completed items by changing [ ] to [x], and add any new items discovered:"
echo "Enter updated acceptance criteria (or press Enter to keep current):"

# Read multiline input for acceptance criteria
echo "Enter acceptance criteria (type 'END' on a new line when finished):"
UPDATED_CRITERIA=""
while IFS= read -r line; do
  if [ "$line" = "END" ]; then
    break
  fi
  UPDATED_CRITERIA="$UPDATED_CRITERIA$line"$'\n'
done

# If no new criteria provided, keep current
if [ -z "$UPDATED_CRITERIA" ]; then
  UPDATED_CRITERIA="$CURRENT_CRITERIA"
fi

# Create updated task content
UPDATED_CONTENT="**User Story:** $USER_STORY

**Acceptance Criteria:**
$UPDATED_CRITERIA

**Progress Update:**
$PROGRESS_UPDATE

**Dependencies:** $DEPENDENCIES
**Priority:** $PRIORITY"

# Update the GitHub Projects task item
gh project item-edit --id $TASK_ITEM_ID \
  --body "$UPDATED_CONTENT"

echo ""
echo "Task $TASK_ID updated successfully!"
echo "Progress recorded: $PROGRESS_UPDATE"

# Show git status for reference
echo ""
echo "Current git status:"
git status --short
```

## Update Heuristics

1. **Regular updates** - update task progress frequently during implementation
2. **Mark completed work** - change [ ] to [x] for completed acceptance criteria
3. **Add discovered work** - include new items found during implementation
4. **Clear progress notes** - describe what was actually implemented
5. **Maintain traceability** - keep original user story and metadata
6. **Real-time status** - reflect actual current state of the work
7. **Include scope changes** - document any scope additions or modifications

