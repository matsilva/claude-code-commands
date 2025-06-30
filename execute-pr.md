---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Create a pull request for the current task being executed
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- Current branch: !`git branch --show-current`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`

## Task

Create pull request for completed task: $ARGUMENTS

Create PR with proper title, description including acceptance criteria checklist, and link to GitHub Projects task.

## Output

Create GitHub pull request for the current task branch with comprehensive description and automatic task linking.

## PR Creation Workflow

```bash
# Check if we're on a task branch
CURRENT_BRANCH=$(git branch --show-current)

if [[ "$CURRENT_BRANCH" == "main" ]] || [[ "$CURRENT_BRANCH" == "master" ]]; then
  echo "Error: Cannot create PR from main branch. Use 'execute' command to create a task branch first."
  exit 1
fi

# Extract task ID from branch name
TASK_ID=$(echo "$CURRENT_BRANCH" | grep -o "task-[0-9]*" | head -1 | tr '[:lower:]' '[:upper:]')

if [ -z "$TASK_ID" ]; then
  echo "Error: Could not extract task ID from branch name: $CURRENT_BRANCH"
  exit 1
fi

# Get task details from GitHub Projects
PROJECT_NUMBER=$(gh project list --owner="@me" --format=json | jq -r '.[0].number')
PROJECT_ID=$(gh project list --owner="@me" --format=json | jq -r '.[0].id')
TASK_DETAILS=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json | \
  jq -r --arg task "$TASK_ID" '.[] | select(.title | contains($task)) | .content.body')

# Extract user story and acceptance criteria from task details
USER_STORY=$(echo "$TASK_DETAILS" | grep "User Story:" | sed 's/\*\*User Story:\*\* //')
ACCEPTANCE_CRITERIA=$(echo "$TASK_DETAILS" | sed -n '/\*\*Acceptance Criteria:\*\*/,/\*\*Dependencies:\*\*/p' | head -n -1)

# Create PR title
if [ -n "$ARGUMENTS" ]; then
  PR_TITLE="$ARGUMENTS"
else
  PR_TITLE=$(echo "$CURRENT_BRANCH" | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
fi

# Ensure branch is pushed
git push -u origin "$CURRENT_BRANCH"

# Create pull request
gh pr create \
  --title "$PR_TITLE" \
  --body "$(cat <<EOF
## Summary

$USER_STORY

## Changes Made

- [ ] Implemented core functionality
- [ ] Added tests for new features
- [ ] Updated documentation as needed
- [ ] Followed existing code patterns

## Acceptance Criteria

$ACCEPTANCE_CRITERIA

## Testing

- [ ] All existing tests pass
- [ ] New functionality is tested
- [ ] Manual testing completed

## Related Task

Links to GitHub Projects task: $TASK_ID

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"

# Get PR URL for status update
PR_URL=$(gh pr view --json url --jq '.url')

echo "Pull request created: $PR_URL"
echo "Task: $TASK_ID"

# Update GitHub Projects task status to "In Review" (Note: Field operations may require project admin access)
if [ -n "$PROJECT_ID" ] && [ -n "$TASK_ID" ]; then
  TASK_ITEM_ID=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json | \
    jq -r --arg task "$TASK_ID" '.[] | select(.title | contains($task)) | .id')
  
  STATUS_FIELD_ID=$(gh project field-list $PROJECT_ID --format=json 2>/dev/null | \
    jq -r '.[] | select(.name=="Status") | .id' || echo "")
  
  if [ -n "$TASK_ITEM_ID" ] && [ -n "$STATUS_FIELD_ID" ]; then
    gh project item-edit --id $TASK_ITEM_ID --field-id $STATUS_FIELD_ID \
      --project-id $PROJECT_ID --single-select-option-id "In Review" 2>/dev/null && \
      echo "Updated task status to 'In Review'" || \
      echo "Status update failed - task status in project item content"
  else
    echo "Status field not found or not accessible - task status in project item content"
  fi
fi
```

## PR Creation Heuristics

1. **Clear titles** - use descriptive PR titles that explain the change
2. **Comprehensive description** - include user story, changes, and testing info
3. **Acceptance criteria checklist** - copy from GitHub Projects task for review
4. **Link to task** - reference the original GitHub Projects task
5. **Status updates** - automatically move task to "In Review" status
6. **Testing section** - include testing checklist for reviewers
7. **Co-authoring** - maintain attribution for AI assistance