---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Revise and iterate on the problem definition and user research
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`
- Current problem item: !`gh project item-list $(gh project list --owner="@me" --format=json | jq -r '.[0].id') --format=json | jq -r '.[] | select(.title == "📋 Problem & Users") | .content.body' 2>/dev/null || echo "No problem definition found"`

## Task

Revise problem definition based on: $ARGUMENTS

Analyze existing "📋 Problem & Users" project item, gather additional context as needed, and update with improved content based on the user input.

## Output

Update the existing "📋 Problem & Users" GitHub project item with revised content incorporating the requested changes.

## Revision Heuristics

1. **Question assumptions** - challenge what you thought you knew
2. **Validate with users** - get real feedback, not assumptions
3. **Refine success criteria** - make them more specific and measurable
4. **Clarify boundaries** - be explicit about what's in/out of scope
5. **Use codeloops** - leverage actor-critic for iterative improvement
6. **Document changes** - explain what changed and why
7. **Priority over time** - focus on what's most important, ignore temporal constraints