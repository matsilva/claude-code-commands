---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Define problem statement, users, and success criteria for a feature request
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`

## Task

Create Problem & Users definition for: $ARGUMENTS

Research and define:

### Problem Definition
- **What problem are we solving?** Clear, specific problem statement
- **Why does this matter?** Business/user impact and urgency
- **Success criteria:** How do we measure success? (quantifiable outcomes)
- **Constraints:** What limits us? (technical, business, scope, timeline)
- **Non-goals:** What are we explicitly NOT doing?

### User Research
- **Who are the users?** Primary and secondary user personas
- **What are their goals?** Core user objectives and motivations  
- **What are their pain points?** Current frustrations and blockers
- **User stories:** Key scenarios in "As a [user], I want [goal], so that [benefit]" format

## Output

Create GitHub project item titled "📋 Problem & Users" with comprehensive problem definition and user research.

## Simple Workflow

```bash
# Find or create project
PROJECT_ID=$(gh project list --owner="@me" --format=json | jq -r '.[0].id' 2>/dev/null)

# Create problem & users item
gh project item-create $PROJECT_ID \
  --title "📋 Problem & Users" \
  --body "$(cat <<'EOF'
## Problem Statement
[Clear description of what we're solving]

## Success Criteria
- [ ] Criterion 1 (measurable)
- [ ] Criterion 2 (measurable)

## Users & Stories
**Primary Users:** [Who]
**Key Stories:**
- As a [user], I want [goal], so that [benefit]
- As a [user], I want [goal], so that [benefit]

## Constraints
- Technical: [limits]
- Business: [limits]  
- Scope: [what's out of scope]
EOF
)"
```

## Research Heuristics

1. **Start with why** - understand the underlying business/user need
2. **Talk to users** - validate assumptions with real user feedback
3. **Quantify success** - define measurable outcomes, not just features
4. **Scope tightly** - better to solve one problem well than many poorly
5. **Use existing patterns** - research current codebase and similar solutions