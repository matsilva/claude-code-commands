---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Revise and iterate on task breakdown and priorities
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`
- Current tasks item: !`gh project item-list $(gh project list --owner="@me" --format=json | jq -r '.[0].id') --format=json | jq -r '.[] | select(.title | startswith("📝") and (.title | contains("Tasks & Priority"))) | .content.body' 2>/dev/null || echo "No task breakdown found"`
- Existing task items: !`gh project item-list $(gh project list --owner="@me" --format=json | jq -r '.[0].id') --format=json | jq -r '.[] | select(.title | startswith("TASK-")) | .title' | head -5`

## Task

Revise task breakdown based on: $ARGUMENTS

**IMPORTANT: Focus on priority and execution order, NOT temporal planning.**

Analyze existing "📝 [Feature Name] - Tasks & Priority" project item and individual task items, then update with improved breakdown based on the user input.

## Output

Update the existing "📝 [Feature Name] - Tasks & Priority" GitHub project item and revise individual task items as needed to incorporate the requested changes.

## Revision Heuristics

1. **User value first** - prioritize by real user impact, not technical ease
2. **Priority over time** - use P0/P1/P2 rankings, never time estimates
3. **Execution order only** - focus on dependencies, ignore temporal planning
4. **Right-size tasks** - not too big (unmanageable) or too small (overhead)
5. **Clear done criteria** - acceptance criteria should be specific and testable
6. **Dependency accuracy** - ensure blocking relationships are correct
7. **Use codeloops** - leverage actor-critic for iterative task refinement
8. **Document changes** - explain what was revised and why
9. **Validate with stakeholders** - ensure priorities align with user needs