---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Define problem statement, users, and success criteria for a feature request
---

## Context

- Current directory: !`pwd`
- Git repository: !`git remote -v 2>/dev/null | head -1 || echo "Not a git repository"`
- Existing projects: !`ls -la .codeloops/ 2>/dev/null | grep "^d" | awk '{print $9}' | grep -v "^\." || echo "No existing projects"`

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

Create local JSON file at `.codeloops/<feature_or_task_or_bugfix>/problem.json` with comprehensive problem definition and user research.

## JSON-Based Workflow

```bash
# Validate arguments
if [ -z "$ARGUMENTS" ]; then
    echo "Error: Please provide feature/task/bugfix name"
    echo "Usage: plan-problem <feature_or_task_or_bugfix>"
    echo "Example: plan-problem 'user-authentication-feature'"
    exit 1
fi

# Sanitize feature name for directory
FEATURE_NAME=$(echo "$ARGUMENTS" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')

# Create .codeloops directory if it doesn't exist
mkdir -p .codeloops

# Create project directory
PROJECT_DIR=".codeloops/$FEATURE_NAME"
mkdir -p "$PROJECT_DIR"

# Check if problem.json already exists
if [ -f "$PROJECT_DIR/problem.json" ]; then
    echo "⚠️  Problem definition already exists for '$FEATURE_NAME'"
    echo "📄 Current content preview:"
    head -20 "$PROJECT_DIR/problem.json"
    echo ""
    echo "Choose action:"
    echo "1. Continue to update existing definition"
    echo "2. Exit and use revise-problem command instead"
    read -p "Enter choice (1-2): " choice
    
    if [ "$choice" != "1" ]; then
        echo "Exiting. Use 'revise-problem $FEATURE_NAME' to modify existing definition."
        exit 0
    fi
fi

echo "📋 Creating problem definition for: $FEATURE_NAME"
echo "Project directory: $PROJECT_DIR"
echo ""

# Create problem.json structure
cat > "$PROJECT_DIR/problem.json" << 'EOF'
{
  "metadata": {
    "created": "",
    "updated": "",
    "version": "1.0.0",
    "featureName": ""
  },
  "problemStatement": "",
  "why": "",
  "successCriteria": [],
  "constraints": {
    "technical": "",
    "business": "",
    "scope": "",
    "nonGoals": ""
  },
  "users": []
}
EOF

# Update metadata with current timestamp and feature name
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
jq --arg timestamp "$TIMESTAMP" --arg feature "$FEATURE_NAME" '
  .metadata.created = $timestamp |
  .metadata.updated = $timestamp |
  .metadata.featureName = $feature
' "$PROJECT_DIR/problem.json" > "$PROJECT_DIR/problem.json.tmp" && mv "$PROJECT_DIR/problem.json.tmp" "$PROJECT_DIR/problem.json"

echo "✅ Created problem definition template at: $PROJECT_DIR/problem.json"
echo ""
echo "📝 Next steps:"
echo "1. Open the file in your editor to complete the definition"
echo "2. Fill in the problem statement, success criteria, and user personas"
echo "3. Run 'plan-technical $FEATURE_NAME' when ready for technical approach"
echo ""
echo "📄 File structure:"
echo "$PROJECT_DIR/"
echo "├── problem.json (created)"
echo "├── technical.json (pending)"
echo "└── tasks.json (pending)"
```

## Research Heuristics

1. **Start with why** - understand the underlying business/user need
2. **Talk to users** - validate assumptions with real user feedback
3. **Quantify success** - define measurable outcomes, not just features
4. **Scope tightly** - better to solve one problem well than many poorly
5. **Use existing patterns** - research current codebase and similar solutions
6. **Priority over time** - focus on what's most important, ignore temporal estimates and deadlines
7. **Structured data** - JSON format enables automation and integration with other tools
8. **Iterative refinement** - use revise-problem command for updates and improvements
9. **Project isolation** - each feature/task/bugfix gets its own .codeloops directory

## JSON Structure Guide

The problem.json file should contain:

```json
{
  "metadata": {
    "created": "2024-01-01T00:00:00.000Z",
    "updated": "2024-01-01T00:00:00.000Z", 
    "version": "1.0.0",
    "featureName": "user-authentication-feature"
  },
  "problemStatement": "Clear, specific description of the problem",
  "why": "Business/user impact and urgency explanation",
  "successCriteria": [
    "Measurable outcome 1",
    "Measurable outcome 2"
  ],
  "constraints": {
    "technical": "Technical limitations",
    "business": "Business constraints",
    "scope": "What's included/excluded",
    "nonGoals": "What we're explicitly NOT doing"
  },
  "users": [
    {
      "persona": "Primary User Type",
      "goals": ["Goal 1", "Goal 2"],
      "painPoints": ["Pain point 1", "Pain point 2"], 
      "stories": [
        "As a [user], I want [goal], so that [benefit]"
      ]
    }
  ]
}
```

## Tips for Effective Problem Definition

- **Be specific**: Avoid vague language like "improve user experience"
- **Include metrics**: Define how you'll measure success quantitatively
- **Consider edge cases**: Think about unusual scenarios and constraints
- **Validate assumptions**: Test your understanding with actual users when possible
- **Keep it focused**: One clear problem is better than multiple fuzzy ones
