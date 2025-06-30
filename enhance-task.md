---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Enhance existing task with detailed context and implementation structure
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`
- Target task: $ARGUMENTS (project-number item-id format)

## Task

Enhance vague task with structured implementation details: $ARGUMENTS

**IMPORTANT: Transform minimal task descriptions into comprehensive, actionable tasks following the established template structure. Add missing context without changing the original intent.**

**CRITICAL: Preserve the original task scope and requirements. Enhancement means adding structure and details, not expanding functionality or changing objectives.**

Transform existing GitHub project item by adding:

### Enhancement Strategy
1. **Read current task content** - extract existing description and requirements
2. **Analyze codebase context** - identify relevant patterns and constraints 
3. **Generate structured content** - apply standard task template format
4. **Update with enhanced version** - replace minimal description with full structure
5. **Preserve original scope** - ensure enhancement doesn't change core requirements

### Enhancement Template
Each enhanced task will include:
- **Focused Scope:** Single-sentence summary of exactly what this task accomplishes
- **User Story:** "As a [user], I want [goal], so that [benefit]" format
- **Analysis of Current State:** What already exists vs what's missing for this task
- **File Structure Changes:** Explicit before/after showing NEW/MODIFIED files
- **Implementation Details:** Exactly which files, functions, components to create or modify
- **Technical Specifications:** Specific code patterns and examples following existing conventions
- **Implementation Constraints:** Clear list of what NOT to change or reimplement
- **Reuse Existing Patterns:** Guidance on following established codebase conventions
- **Acceptance Criteria:** Granular, testable implementation conditions
- **Success Definition:** Clear definition of what successful completion looks like
- **Out of Scope:** Explicit boundaries listing what NOT to implement
- **Dependencies:** What must be completed first
- **Priority:** P0/P1/P2 classification

## Output

Enhanced GitHub project item with comprehensive structure while preserving original requirements and scope.

## Simple Workflow

```bash
# Validate arguments
if [[ "$ARGUMENTS" != *" "* ]]; then
    echo "Error: Please provide project number and item ID"
    echo "Usage: enhance-task <project-number> <item-id>"
    echo "Example: enhance-task 9 PVTI_lAHOAETY5M4A8tSbzgcDLP4"
    exit 1
fi

# Parse arguments
PROJECT_NUMBER=$(echo "$ARGUMENTS" | cut -d' ' -f1)
ITEM_ID=$(echo "$ARGUMENTS" | cut -d' ' -f2)

# Validate GitHub authentication
if ! gh auth status >/dev/null 2>&1; then
    echo "Error: Not authenticated with GitHub"
    echo "Run: gh auth login --with-token < ~/.config/gh/my_token.txt"
    exit 1
fi

# Read current task content
echo "Reading current task content..."
CURRENT_TASK=$(gh project item-view $PROJECT_NUMBER --owner="@me" --item-id $ITEM_ID --format json 2>/dev/null)

if [ $? -ne 0 ] || [ -z "$CURRENT_TASK" ]; then
    echo "Error: Project item not found or insufficient permissions"
    echo "Project: $PROJECT_NUMBER, Item: $ITEM_ID"
    exit 1
fi

CURRENT_TITLE=$(echo "$CURRENT_TASK" | jq -r '.title // "No title"')
CURRENT_BODY=$(echo "$CURRENT_TASK" | jq -r '.body // "No description"')

echo "Current task: $CURRENT_TITLE"
echo "Current description length: $(echo "$CURRENT_BODY" | wc -c) characters"

# Check if task is already enhanced (has structured format)
if echo "$CURRENT_BODY" | grep -q "**Focused Scope:**"; then
    echo "Task appears to already be enhanced (contains structured format)"
    echo "Current content:"
    echo "$CURRENT_BODY"
    read -p "Continue with re-enhancement? (y/N): " confirm
    if [[ $confirm != [yY] ]]; then
        echo "Enhancement cancelled"
        exit 0
    fi
fi

# Analyze codebase for context (simple pattern detection)
echo "Analyzing codebase context..."
CODEBASE_PATTERNS=""
if [ -f "package.json" ]; then
    CODEBASE_PATTERNS="$CODEBASE_PATTERNS\n- TypeScript/JavaScript project with package.json"
fi
if [ -d "src/" ]; then
    CODEBASE_PATTERNS="$CODEBASE_PATTERNS\n- Source code in src/ directory"
fi
if [ -f "README.md" ]; then
    CODEBASE_PATTERNS="$CODEBASE_PATTERNS\n- Documentation in README.md"
fi

# Generate enhanced content with structured template
ENHANCED_CONTENT="**Focused Scope:** [Enhanced from: $CURRENT_TITLE]

$CURRENT_BODY

**User Story:** As a [user type], I want [specific goal], so that [clear benefit]

**Analysis of Current State:**
✅ **What Already Exists:**
- [List existing relevant code, patterns, or infrastructure]
- [Identify reusable components or utilities]

❌ **What's Missing:**
- [Specific gaps that this task addresses]
- [Missing functionality or components]

**File Structure Changes:**
\`\`\`
[Show before/after directory structure]
├── existing-file.ext (EXISTS)
├── modified-file.ext (MODIFIED)
└── new-file.ext (NEW)
\`\`\`

**Implementation Details:**
- [Specific files to create or modify]
- [Exact functions, components, or modules to implement]
- [Integration points with existing code]

**Technical Specifications:**
[Include relevant code examples and patterns]
\`\`\`
// Example code following existing patterns
// Show data structures, API contracts, etc.
\`\`\`

**Implementation Constraints:**
❌ **Do NOT implement:**
- [List what should NOT be changed]
- [Features explicitly out of scope]
- [Existing patterns that should not be modified]

**Reuse Existing Patterns:**
- [Specific guidance on following established conventions]
- [Reference existing similar implementations]
- [Code style and architecture guidelines to follow]

**Acceptance Criteria:**
- [ ] [Specific, testable condition 1]
- [ ] [Specific, testable condition 2]
- [ ] [Specific, testable condition 3]
- [ ] [Additional measurable outcomes]

**Success Definition:**
[Clear description of what successful completion looks like and how to verify it]

**Out of Scope:**
- [Explicit list of what NOT to implement]
- [Features that would be separate tasks]
- [Future enhancements not part of this task]

**Dependencies:** [List any blocking tasks or requirements]
**Priority:** [P0/P1/P2 based on criticality and user impact]

---
*Enhanced on $(date) from original task description*"

# Update the project item with enhanced content
echo "Updating project item with enhanced content..."
gh project item-edit $PROJECT_NUMBER --owner="@me" --item-id $ITEM_ID --body "$ENHANCED_CONTENT"

if [ $? -eq 0 ]; then
    echo "✅ Task successfully enhanced!"
    echo "Project: $PROJECT_NUMBER"
    echo "Item: $ITEM_ID"
    echo "Enhanced task now includes structured format with:"
    echo "- User story and focused scope"
    echo "- Current state analysis"
    echo "- File structure changes"
    echo "- Technical specifications"
    echo "- Clear acceptance criteria"
    echo "- Explicit scope boundaries"
else
    echo "❌ Failed to update project item"
    echo "Check permissions and try again"
    exit 1
fi
```

## Enhancement Heuristics

1. **Preserve original intent** - enhancement adds structure, not new requirements
2. **Add missing context** - fill gaps in implementation details and technical specs
3. **Follow existing patterns** - use established codebase conventions and structures
4. **Clear scope boundaries** - explicitly define what is and isn't included
5. **Granular acceptance criteria** - make success measurable and testable
6. **Implementation specificity** - provide exact file and function details
7. **Constraint awareness** - identify what should NOT be changed or rebuilt
8. **Dependency identification** - call out blocking relationships clearly
9. **Priority-based classification** - assign P0/P1/P2 based on impact and dependencies
10. **Template consistency** - use standard format for all enhanced tasks