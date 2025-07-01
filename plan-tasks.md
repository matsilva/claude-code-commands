---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Break down feature into prioritized, actionable tasks with comprehensive context analysis
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`
- Codebase patterns: !`find . -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.md" | head -15`
- Package files: !`find . -name "package.json" -o -name "Cargo.toml" -o -name "requirements.txt" -o -name "go.mod" | head -5`
- Problem definition: Check existing "📋 Problem & Users" project item
- Technical design: Check existing "🏗️ Technical Approach" project item

## Task

Break down implementation plan for: $ARGUMENTS

**IMPORTANT: Analyze ALL available context - problem definition, technical approach, codebase patterns, external docs, and dependencies. Create specific, actionable tasks with detailed implementation guidance.**

**CRITICAL: Each task must be small batch (1-4 hours), have clear scope boundaries with explicit "Out of Scope" sections, and include specific file changes, API endpoints, and constraints.**

Create comprehensive task breakdown with full context integration:

### Context Analysis Strategy
1. **Problem & User Context** - Extract user stories, success criteria, and constraints from problem definition
2. **Technical Context** - Leverage architecture, data models, and tech stack from technical approach
3. **Codebase Context** - Analyze existing patterns, file structures, naming conventions, and dependencies
4. **External Context** - Review README, docs, configuration files for additional constraints
5. **Integration Context** - Identify existing systems, APIs, and components that must be preserved
6. **Scope Context** - Define clear boundaries of what IS and IS NOT included

### Task Specification Requirements
Each task must include:
- **Focused Scope:** Single-sentence summary of exactly what this task accomplishes
- **User Story:** "As a [user], I want [goal], so that [benefit]" from problem definition
- **Context Analysis:** What already exists vs what's missing, based on full codebase analysis
- **File Structure Changes:** Explicit before/after showing NEW/MODIFIED/MOVED files with paths
- **Implementation Details:** Exact files, functions, components, API endpoints to create/modify
- **Technical Specifications:** Code patterns, data structures, schemas following existing conventions
- **Implementation Constraints:** Clear list of what NOT to change or reimplement
- **External Dependencies:** Required libraries, services, or external integrations
- **Integration Points:** How this connects to existing systems and components
- **Acceptance Criteria:** Granular, testable conditions (not high-level outcomes)
- **Success Definition:** Clear definition of what completion looks like and how to verify
- **Out of Scope:** Explicit boundaries listing what NOT to implement
- **Batch Size:** Ensure 1-4 hours of focused work per task
- **Dependencies:** What must be completed first
- **Priority:** P0/P1/P2 based on user impact and dependencies

### Priority Guidelines
- **P0 (Must Have):** Core functionality, blocks other work, user-critical features
- **P1 (Should Have):** Important but not blocking, clear user value, enhances core features  
- **P2 (Nice to Have):** Polish, optimization, future enhancements, non-critical features

## Output

1. **Comprehensive context analysis** - full understanding of problem, technical approach, and codebase
2. Create GitHub project item titled "📝 [Feature Name] - Tasks & Priority" with task breakdown overview
3. **Create individual GitHub project items for EACH implementation task** with full specifications
4. Each task includes complete context analysis, specific implementation details, and clear scope boundaries
5. Set Priority field for each task item

## Comprehensive Workflow

```bash
# Validate arguments
if [ -z "$ARGUMENTS" ]; then
    echo "Error: Please provide feature name"
    echo "Usage: plan-tasks <feature-name>"
    echo "Example: plan-tasks 'User Authentication System'"
    exit 1
fi

# Get project details
PROJECT_NUMBER=$(gh project list --owner="@me" --format=json | jq -r '.[0].number' 2>/dev/null)
PROJECT_ID=$(gh project list --owner="@me" --format=json | jq -r '.[0].id' 2>/dev/null)

# Validate GitHub authentication
if ! gh auth status >/dev/null 2>&1; then
    echo "Error: Not authenticated with GitHub"
    echo "Run: gh auth login --with-token < ~/.config/gh/my_token.txt"
    exit 1
fi

# Add Priority field if not exists
gh project field-create $PROJECT_ID --name "Priority" --type "single_select" --options "P0,P1,P2" 2>/dev/null || true

echo "🔍 COMPREHENSIVE CONTEXT ANALYSIS FOR: $ARGUMENTS"
echo "=================================================="
echo ""

# 1. PROBLEM & USER CONTEXT ANALYSIS
echo "📋 ANALYZING PROBLEM DEFINITION & USER CONTEXT"
echo "----------------------------------------------"
PROBLEM_DEFINITION=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json 2>/dev/null | \
  jq -r '.[] | select(.title | startswith("📋") and (.title | contains("Problem"))) | .content.body' || echo "")

if [ -n "$PROBLEM_DEFINITION" ]; then
  echo "✅ Found problem definition"
  echo "Extracting user stories and success criteria..."
  USER_STORIES=$(echo "$PROBLEM_DEFINITION" | grep -A 10 "User Stories" || echo "No user stories found")
  SUCCESS_CRITERIA=$(echo "$PROBLEM_DEFINITION" | grep -A 10 "Success Criteria" || echo "No success criteria found")
  CONSTRAINTS=$(echo "$PROBLEM_DEFINITION" | grep -A 10 "Constraints" || echo "No constraints found")
else
  echo "⚠️  No problem definition found - create with plan-problem command first"
  USER_STORIES="No user stories available"
  SUCCESS_CRITERIA="No success criteria available"
  CONSTRAINTS="No constraints available"
fi
echo ""

# 2. TECHNICAL CONTEXT ANALYSIS
echo "🏗️ ANALYZING TECHNICAL APPROACH & ARCHITECTURE"
echo "----------------------------------------------"
TECHNICAL_APPROACH=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json 2>/dev/null | \
  jq -r '.[] | select(.title | startswith("🏗️") and (.title | contains("Technical"))) | .content.body' || echo "")

if [ -n "$TECHNICAL_APPROACH" ]; then
  echo "✅ Found technical approach"
  echo "Extracting technology stack and architecture..."
  TECH_STACK=$(echo "$TECHNICAL_APPROACH" | grep -A 10 "Technology Stack" || echo "No tech stack found")
  DATA_MODELS=$(echo "$TECHNICAL_APPROACH" | grep -A 10 "Data Models" || echo "No data models found")
  ARCHITECTURE=$(echo "$TECHNICAL_APPROACH" | grep -A 10 "Architecture" || echo "No architecture found")
else
  echo "⚠️  No technical approach found - create with plan-technical command first"
  TECH_STACK="No tech stack available"
  DATA_MODELS="No data models available"
  ARCHITECTURE="No architecture available"
fi
echo ""

# 3. CODEBASE CONTEXT ANALYSIS
echo "💻 ANALYZING EXISTING CODEBASE PATTERNS"
echo "--------------------------------------"
echo "Analyzing file structure and patterns..."

# Detect project type and patterns
PROJECT_TYPE="unknown"
MAIN_LANGUAGE="unknown"
FRAMEWORK="unknown"

if [ -f "package.json" ]; then
  PROJECT_TYPE="javascript/typescript"
  echo "✅ Found JavaScript/TypeScript project"
  FRAMEWORK=$(cat package.json | jq -r '.dependencies | keys[]' | grep -E 'react|vue|angular|express|next' | head -1 || echo "vanilla")
  if find . -name "*.ts" -not -path "./node_modules/*" | head -1 >/dev/null 2>&1; then
    MAIN_LANGUAGE="typescript"
  else
    MAIN_LANGUAGE="javascript"
  fi
elif [ -f "Cargo.toml" ]; then
  PROJECT_TYPE="rust"
  MAIN_LANGUAGE="rust"
  echo "✅ Found Rust project"
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
  PROJECT_TYPE="python"
  MAIN_LANGUAGE="python"
  echo "✅ Found Python project"
elif [ -f "go.mod" ]; then
  PROJECT_TYPE="go"
  MAIN_LANGUAGE="go"
  echo "✅ Found Go project"
fi

# Analyze directory structure
SRC_STRUCTURE=""
if [ -d "src" ]; then
  SRC_STRUCTURE=$(find src -type d | head -10 | sed 's/^/  /')
  echo "✅ Found src/ directory structure:"
  echo "$SRC_STRUCTURE"
fi

# Analyze existing API patterns
API_PATTERNS=""
if find . -name "*.ts" -o -name "*.js" | xargs grep -l "app\." 2>/dev/null | head -1 >/dev/null; then
  API_PATTERNS="Express.js patterns detected"
  echo "✅ Found Express.js API patterns"
elif find . -name "*.py" | xargs grep -l "FastAPI\|@app\." 2>/dev/null | head -1 >/dev/null; then
  API_PATTERNS="FastAPI patterns detected"
  echo "✅ Found FastAPI patterns"
elif find . -name "*.rs" | xargs grep -l "actix\|warp" 2>/dev/null | head -1 >/dev/null; then
  API_PATTERNS="Rust web framework detected"
  echo "✅ Found Rust web framework patterns"
fi

# Analyze database patterns
DB_PATTERNS=""
if find . -name "*.sql" 2>/dev/null | head -1 >/dev/null; then
  DB_PATTERNS="SQL database patterns"
  echo "✅ Found SQL database files"
elif find . -name "*.ts" -o -name "*.js" | xargs grep -l "mongoose\|Schema" 2>/dev/null | head -1 >/dev/null; then
  DB_PATTERNS="MongoDB/Mongoose patterns"
  echo "✅ Found MongoDB patterns"
elif find . -name "*.py" | xargs grep -l "SQLAlchemy\|models.Model" 2>/dev/null | head -1 >/dev/null; then
  DB_PATTERNS="SQLAlchemy patterns"
  echo "✅ Found SQLAlchemy patterns"
fi

echo ""

# 4. EXTERNAL DOCUMENTATION ANALYSIS
echo "📚 ANALYZING EXTERNAL DOCUMENTATION"
echo "----------------------------------"
README_CONTENT=""
if [ -f "README.md" ]; then
  echo "✅ Found README.md"
  README_CONTENT=$(head -50 README.md)
  echo "Extracted setup and usage patterns from README"
else
  echo "⚠️  No README.md found"
fi

# Analyze configuration files
CONFIG_PATTERNS=""
if [ -f ".env.example" ] || [ -f ".env" ]; then
  CONFIG_PATTERNS="Environment configuration patterns found"
  echo "✅ Found environment configuration"
fi
if [ -f "docker-compose.yml" ] || [ -f "Dockerfile" ]; then
  CONFIG_PATTERNS="$CONFIG_PATTERNS, Docker containerization"
  echo "✅ Found Docker configuration"
fi

echo ""
echo "🎯 CONTEXT ANALYSIS COMPLETE - CREATING SPECIFIC TASKS"
echo "====================================================="
echo ""

# Create comprehensive task breakdown overview
OVERVIEW_CONTENT="## Comprehensive Task Breakdown for $ARGUMENTS

### 📋 Context Summary
**Problem Definition:** $USER_STORIES
**Success Criteria:** $SUCCESS_CRITERIA
**Technical Stack:** $PROJECT_TYPE ($MAIN_LANGUAGE, $FRAMEWORK)
**Architecture Patterns:** $API_PATTERNS, $DB_PATTERNS
**Constraints:** $CONSTRAINTS

### 🎯 Task Breakdown Strategy
Based on comprehensive analysis of:
- Problem definition and user stories
- Technical approach and architecture
- Existing codebase patterns ($PROJECT_TYPE)
- External documentation and configuration
- Integration requirements and constraints

### P0 Tasks (Must Have - Core Functionality)
**Small batch work: 1-4 hours each, specific implementation details**

### P1 Tasks (Should Have - Important Features)  
**Well-scoped enhancements with clear boundaries**

### P2 Tasks (Nice to Have - Future Enhancements)
**Optional improvements with explicit scope limits**

### Dependencies & Integration
**Clear blocking relationships and integration points**

### Implementation Guidance
- Follow existing $MAIN_LANGUAGE patterns in codebase
- Integrate with $FRAMEWORK architecture
- Respect existing $API_PATTERNS and $DB_PATTERNS
- Maintain consistency with current file structure
- Consider $CONFIG_PATTERNS for deployment

---
*Created on $(date) with comprehensive context analysis*
*Each task includes specific implementation details and scope boundaries*"

# Create the comprehensive task breakdown overview
gh project item-create $PROJECT_NUMBER \
  --owner "@me" \
  --title "📝 $ARGUMENTS - Tasks & Priority" \
  --body "$OVERVIEW_CONTENT"

echo "📝 Created comprehensive task breakdown overview"
echo ""
echo "🔨 CREATING INDIVIDUAL DETAILED TASKS"
echo "====================================="
echo ""
echo "Note: This example shows the task creation pattern."
echo "In practice, create 3-7 specific tasks based on the actual feature requirements."
echo ""

# Example P0 Task Creation (create actual tasks based on specific feature)
TASK1_CONTENT="**Focused Scope:** [Specific implementation task based on problem definition analysis]

**User Story:** [Extract from problem definition] As a [specific user], I want [specific goal], so that [clear benefit]

**Context Analysis:**
✅ **What Already Exists:**
- Project Type: $PROJECT_TYPE with $MAIN_LANGUAGE
- Framework: $FRAMEWORK with $API_PATTERNS
- Database: $DB_PATTERNS
- File Structure: $SRC_STRUCTURE
- Configuration: $CONFIG_PATTERNS

❌ **What's Missing:**
- [Specific functionality gaps identified from technical approach]
- [Required integrations not yet implemented]
- [Missing data models or API endpoints]

**File Structure Changes:**
\`\`\`
[Current structure]
├── existing-file.ext (EXISTS)
├── modified-file.ext (MODIFIED - add specific functionality)
└── new-file.ext (NEW - create specific component)
\`\`\`

**Implementation Details:**
- Create/modify specific files: [exact file paths]
- Implement specific functions: [function signatures]
- Add specific API endpoints: [exact routes and methods]
- Database changes: [specific schema modifications]

**Technical Specifications:**
[Code examples following existing $MAIN_LANGUAGE patterns]
\`\`\`
// Example following detected patterns in codebase
// Show actual implementation structure
\`\`\`

**Implementation Constraints:**
❌ **Do NOT implement:**
- [Features explicitly out of scope from problem definition]
- [Changes that would break existing $API_PATTERNS]
- [Modifications to core $FRAMEWORK architecture]
- [Database changes outside defined scope]

**External Dependencies:**
- Required libraries: [specific versions]
- External services: [APIs or services needed]
- Configuration changes: [environment variables]

**Integration Points:**
- Existing APIs: [how this connects to current endpoints]
- Database: [how this integrates with $DB_PATTERNS]
- Frontend: [if applicable, how UI connects]

**Acceptance Criteria:**
- [ ] [Specific, testable condition based on success criteria]
- [ ] [Integration with existing $FRAMEWORK patterns verified]
- [ ] [Database changes work with $DB_PATTERNS]
- [ ] [API endpoints follow $API_PATTERNS conventions]
- [ ] [Code follows $MAIN_LANGUAGE best practices from codebase]

**Success Definition:**
[Clear description based on problem definition success criteria]

**Out of Scope:**
- [Explicit list from problem definition constraints]
- [Features that would be separate P1/P2 tasks]
- [Changes outside the 1-4 hour scope]

**Batch Size:** 1-4 hours of focused work
**Dependencies:** [List specific blocking tasks]
**Priority:** P0 (Core functionality required for success criteria)"

echo "Creating example detailed task structure..."
echo "✅ Task template ready for actual feature-specific implementation"

echo ""
echo "🎉 TASK BREAKDOWN COMPLETE"
echo "========================="
echo "✅ Comprehensive context analysis performed"
echo "✅ Task breakdown overview created"
echo "✅ Individual task template established"
echo ""
echo "Next Steps:"
echo "1. Review the task breakdown in your GitHub project"
echo "2. Create specific tasks based on your actual feature requirements"
echo "3. Start implementing P0 tasks in dependency order"
echo "4. Use the established patterns for consistent task creation"
```

## Comprehensive Planning Heuristics

1. **Context-driven analysis** - analyze ALL available context before creating tasks
2. **Full integration** - leverage problem definition, technical approach, and codebase patterns
3. **Specific implementation details** - include exact files, functions, API endpoints, and data models
4. **Small batch sizing** - ensure each task is 1-4 hours of focused work
5. **Clear scope boundaries** - explicit "Out of Scope" sections prevent feature creep
6. **Pattern consistency** - follow existing codebase conventions and architecture
7. **Dependency awareness** - identify and call out blocking relationships clearly
8. **External integration** - consider external docs, configuration, and deployment requirements
9. **User-centric focus** - tie each task back to user stories and success criteria
10. **Quality enforcement** - include acceptance criteria that verify integration and patterns
11. **Constraint respect** - honor limitations from problem definition and technical approach
12. **Priority-driven** - organize by user impact and dependencies, not time estimates
13. **Verification-ready** - include clear success definitions and testing approaches
14. **Architecture-aware** - ensure tasks fit within existing system design
15. **Documentation-informed** - use README and config files to understand deployment context