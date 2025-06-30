---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Comprehensive self-review of implementation against original task and design documents
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- Current branch: !`git branch --show-current`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`
- Changes made: !`git diff --name-only main`
- Implementation diff: !`git diff main --stat`

## Task

Comprehensive review of implementation work against original requirements: $ARGUMENTS

Perform thorough self-review to ensure implementation accuracy, scope adherence, and completeness against original task definition and design documents.

## Output

Detailed review report highlighting alignment with requirements, potential issues, and recommendations for completion or correction.

## Comprehensive Review Workflow

```bash
# Validate we're on a task branch
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

echo "🔍 COMPREHENSIVE IMPLEMENTATION REVIEW"
echo "=================================================="
echo "Task: $TASK_ID"
echo "Branch: $CURRENT_BRANCH"
echo ""

# Get project and task details
PROJECT_NUMBER=$(gh project list --owner="@me" --format=json | jq -r '.[0].number')
PROJECT_ID=$(gh project list --owner="@me" --format=json | jq -r '.[0].id')

# Get current task content
TASK_DETAILS=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json | \
  jq -r --arg task "$TASK_ID" '.[] | select(.title | contains($task)) | .content.body')

# Get original design documents and their IDs for potential updates
PROBLEM_DEFINITION=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json | \
  jq -r '.[] | select(.title | startswith("📋") and (.title | contains("Problem & Users"))) | .content.body' 2>/dev/null)

PROBLEM_ITEM_ID=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json | \
  jq -r '.[] | select(.title | startswith("📋") and (.title | contains("Problem & Users"))) | .id' 2>/dev/null)

TECHNICAL_APPROACH=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json | \
  jq -r '.[] | select(.title | startswith("🏗️") and (.title | contains("Technical Approach"))) | .content.body' 2>/dev/null)

TECHNICAL_ITEM_ID=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json | \
  jq -r '.[] | select(.title | startswith("🏗️") and (.title | contains("Technical Approach"))) | .id' 2>/dev/null)

# Show implementation changes
echo "📁 IMPLEMENTATION CHANGES"
echo "=========================="
echo "Files modified:"
git diff --name-only main | sed 's/^/  - /'
echo ""
echo "Lines changed:"
git diff main --stat
echo ""

# Show current task requirements
echo "📋 ORIGINAL TASK REQUIREMENTS"
echo "=============================="
echo "$TASK_DETAILS"
echo ""

# Reference design documents if available
if [ -n "$PROBLEM_DEFINITION" ]; then
  echo "🎯 ORIGINAL PROBLEM DEFINITION"
  echo "==============================="
  echo "$PROBLEM_DEFINITION"
  echo ""
fi

if [ -n "$TECHNICAL_APPROACH" ]; then
  echo "🏗️ ORIGINAL TECHNICAL DESIGN"
  echo "============================"
  echo "$TECHNICAL_APPROACH"
  echo ""
fi

# Analyze code changes in detail
echo "🔬 DETAILED CODE ANALYSIS"
echo "=========================="
echo "Analyzing implementation against requirements..."
echo ""

# Check each modified file
git diff --name-only main | while read -r file; do
  echo "📄 Analyzing: $file"
  echo "-------------------"
  
  # Show file changes summary
  echo "Changes:"
  git diff main "$file" --stat
  echo ""
  
  # Show actual diff (truncated for readability)
  echo "Key changes preview:"
  git diff main "$file" | head -50
  echo ""
  echo "═══════════════════════════════════════════════════"
  echo ""
done

echo "🎯 REQUIREMENT ALIGNMENT CHECK"
echo "==============================="
echo "Please review the following alignment questions:"
echo ""
echo "1. USER STORY FULFILLMENT:"
USER_STORY=$(echo "$TASK_DETAILS" | grep "User Story:" | sed 's/\*\*User Story:\*\* //')
echo "   Original: $USER_STORY"
echo "   ✓ Does the implementation fulfill this user story?"
echo ""

echo "2. ACCEPTANCE CRITERIA VERIFICATION:"
ACCEPTANCE_CRITERIA=$(echo "$TASK_DETAILS" | sed -n '/\*\*Acceptance Criteria:\*\*/,/\*\*Progress Update:\*\*/p' | head -n -1 | tail -n +2)
echo "$ACCEPTANCE_CRITERIA"
echo "   ✓ Are all acceptance criteria properly implemented?"
echo ""

echo "3. TECHNICAL DESIGN ADHERENCE:"
if [ -n "$TECHNICAL_APPROACH" ]; then
  echo "   ✓ Does implementation follow the technical design?"
  echo "   ✓ Are data models implemented as specified?"
  echo "   ✓ Are API endpoints consistent with design?"
  echo "   ✓ Is security properly implemented?"
else
  echo "   ! No technical design document found"
fi
echo ""

echo "4. SCOPE BOUNDARY CHECK:"
echo "   ✓ Has implementation stayed within defined scope?"
echo "   ✓ Are there any feature creep issues?"
echo "   ✓ Have non-goals been properly avoided?"
echo ""

echo "5. CODE QUALITY VERIFICATION:"
echo "   ✓ Does code follow existing patterns and conventions?"
echo "   ✓ Are tests written for new functionality?"
echo "   ✓ Is error handling properly implemented?"
echo "   ✓ Are edge cases considered?"
echo ""

echo "📊 REVIEW SUMMARY"
echo "=================="
echo "Current status: Implementation complete, pending review"
echo ""
echo "RECOMMENDED ACTIONS:"
echo "□ Verify all acceptance criteria are met"
echo "□ Run tests to ensure functionality works"
echo "□ Check code follows project conventions"
echo "□ Validate against original user story"
echo "□ Ensure technical design compliance"
echo "□ Confirm scope boundaries were respected"
echo ""
echo "If all checks pass, proceed with:"
echo "  execute-commit 'final implementation ready for review'"
echo "  execute-pr 'Complete [task description]'"
echo ""
echo "If issues found, use:"
echo "  revise-execute '[describe needed corrections]'"
echo ""
echo "🔄 DESIGN DOCUMENT SYNC"
echo "========================"
echo "Checking if design documents need updates based on implementation learning..."
echo ""

# Check if any lessons learned or design changes should be synced back
if [ -n "$PROBLEM_ITEM_ID" ] || [ -n "$TECHNICAL_ITEM_ID" ]; then
  echo "Available design documents for sync:"
  [ -n "$PROBLEM_ITEM_ID" ] && echo "  📋 Problem & Users document (ID: $PROBLEM_ITEM_ID)"
  [ -n "$TECHNICAL_ITEM_ID" ] && echo "  🏗️ Technical Approach document (ID: $TECHNICAL_ITEM_ID)"
  echo ""
  echo "Consider updating design documents if implementation revealed:"
  echo "□ New technical constraints or requirements"
  echo "□ Better understanding of user needs"
  echo "□ Architecture changes or optimizations"
  echo "□ Updated scope or acceptance criteria"
  echo "□ Security considerations discovered"
  echo ""
  echo "To update design docs with implementation learnings:"
  if [ -n "$PROBLEM_ITEM_ID" ]; then
    echo "  revise-problem 'lessons learned from implementation'"
  fi
  if [ -n "$TECHNICAL_ITEM_ID" ]; then
    echo "  revise-technical 'architecture updates based on implementation'"
  fi
else
  echo "No design documents found to sync. Consider creating them for future reference:"
  echo "  plan-problem '[feature description]'"
  echo "  plan-technical '[feature description]'"
fi
echo ""

echo "🏁 REVIEW COMPLETE"
echo "=================="
```

## Review Heuristics

1. **Requirements traceability** - verify every acceptance criterion is implemented
2. **Design compliance** - ensure implementation matches technical specifications
3. **Scope adherence** - confirm work stayed within defined boundaries
4. **User story validation** - validate implementation solves the original user need
5. **Quality standards** - verify code quality, testing, and error handling
6. **Pattern consistency** - ensure implementation follows existing codebase conventions
7. **Completeness check** - confirm nothing important was missed or overlooked
8. **Documentation review** - ensure any documentation updates are complete