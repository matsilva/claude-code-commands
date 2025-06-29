---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Commit and push progress for the current task being executed
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- Current branch: !`git branch --show-current`
- Git status: !`git status --porcelain`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`

## Task

Commit and push current progress for task: $ARGUMENTS

Create a commit with clear message describing the progress made, following the project's commit conventions.

## Output

Create git commit and push to remote branch with descriptive commit message related to the current task progress.

## Commit Workflow

```bash
# Check if we're on a task branch
CURRENT_BRANCH=$(git branch --show-current)

if [[ "$CURRENT_BRANCH" == "main" ]] || [[ "$CURRENT_BRANCH" == "master" ]]; then
  echo "Error: Cannot commit directly to main branch. Use 'execute' command to create a task branch first."
  exit 1
fi

# Show current changes
echo "Current changes:"
git status

# Add all changes
git add .

# Create commit message based on task and progress
if [ -n "$ARGUMENTS" ]; then
  COMMIT_MSG="$ARGUMENTS"
else
  # Extract task info from branch name
  TASK_ID=$(echo "$CURRENT_BRANCH" | grep -o "task-[0-9]*" | head -1)
  COMMIT_MSG="Progress on $TASK_ID: implement core functionality"
fi

# Create commit
git commit -m "$(cat <<EOF
$COMMIT_MSG

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Push to remote (create upstream if needed)
git push -u origin "$CURRENT_BRANCH"

echo "Committed and pushed progress: $COMMIT_MSG"
echo "Branch: $CURRENT_BRANCH"
```

## Commit Heuristics

1. **Descriptive messages** - clearly describe what was implemented or changed
2. **Regular commits** - commit frequently to track progress incrementally
3. **Task context** - include task ID or reference in commit message
4. **Safe branching** - never commit directly to main/master
5. **Always push** - ensure remote branch stays up to date
6. **Include co-authoring** - maintain attribution for AI assistance