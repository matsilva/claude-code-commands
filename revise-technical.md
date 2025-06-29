---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Revise and iterate on the technical approach and architecture
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`
- Current technical item: !`gh project item-list $(gh project list --owner="@me" --format=json | jq -r '.[0].id') --format=json | jq -r '.[] | select(.title == "🏗️ Technical Approach") | .content.body' 2>/dev/null || echo "No technical design found"`
- Codebase patterns: !`find . -name "*.ts" -o -name "*.js" -o -name "*.py" | head -5`

## Task

Revise technical approach based on: $ARGUMENTS

Analyze existing "🏗️ Technical Approach" project item, review codebase patterns, and update with improved technical design based on the user input.

## Output

Update the existing "🏗️ Technical Approach" GitHub project item with revised technical content incorporating the requested changes.

## Revision Heuristics

1. **Simplify first** - prefer simpler solutions over complex ones
2. **Follow existing patterns** - align with current codebase conventions
3. If ts project: **Zod-first TypeScript** - always use Zod schemas, derive types with z.infer
4. **Security by design** - validate everything, authorize properly
5. **Performance aware** - consider scale and efficiency improvements
6. **Document decisions** - explain technical choices and trade-offs
7. **Priority-driven design** - focus on implementation order, not schedules

```

```
