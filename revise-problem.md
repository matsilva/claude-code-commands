---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Revise and iterate on the problem definition and user research
---

## Context

- Current directory: !`pwd`
- Git repository: !`git remote -v 2>/dev/null | head -1 || echo "Not a git repository"`
- Existing projects: !`ls -la .codeloops/ 2>/dev/null | grep "^d" | awk '{print $9}' | grep -v "^\." || echo "No existing projects"`

## Task

Revise problem definition for: $ARGUMENTS

Analyze existing problem.json file, gather additional context as needed, and update with improved content based on the user input.

## JSON-Based Workflow

```bash
# Validate arguments
if [ -z "$ARGUMENTS" ]; then
    echo "Error: Please provide feature/task/bugfix name and revision details"
    echo "Usage: revise-problem <feature_or_task_or_bugfix> [revision_notes]"
    echo "Example: revise-problem 'user-authentication-feature' 'Add social login requirements'"
    exit 1
fi

# Extract feature name (first argument)
FEATURE_NAME=$(echo "$ARGUMENTS" | awk '{print $1}' | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')

# Check if project directory exists
PROJECT_DIR=".codeloops/$FEATURE_NAME"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "⚠️  Project directory does not exist: $PROJECT_DIR"
    echo "Available projects:"
    ls -1 .codeloops/ 2>/dev/null || echo "No projects found"
    exit 1
fi

# Check if problem.json exists
if [ ! -f "$PROJECT_DIR/problem.json" ]; then
    echo "⚠️  Problem definition not found: $PROJECT_DIR/problem.json"
    echo "Run 'plan-problem $FEATURE_NAME' first to create the problem definition"
    exit 1
fi

echo "📋 Revising problem definition for: $FEATURE_NAME"
echo "Project directory: $PROJECT_DIR"
echo ""

# Display current problem definition
echo "📄 Current problem definition:"
echo "=============================="
jq -r '
"Problem: " + .problemStatement + "\n" +
"Why: " + .why + "\n" +
"Success Criteria: " + (.successCriteria | join(", ")) + "\n" +
"Users: " + (.users | length | tostring) + " personas defined\n" +
"Constraints: " + .constraints.scope
' "$PROJECT_DIR/problem.json" 2>/dev/null

echo ""
echo "💡 What would you like to revise?"
echo "1. Problem statement"
echo "2. Success criteria"
echo "3. User personas"
echo "4. Constraints"
echo "5. Open JSON file in editor for manual editing"
echo "6. Show detailed current content"

read -p "Enter choice (1-6): " choice

case $choice in
    1)
        echo "Current problem statement:"
        jq -r '.problemStatement' "$PROJECT_DIR/problem.json"
        echo ""
        read -p "Enter new problem statement: " new_problem
        jq --arg problem "$new_problem" '.problemStatement = $problem | .metadata.updated = now | .metadata.version = (.metadata.version | split(".") | .[2] = (.[2] | tonumber + 1 | tostring) | join("."))' "$PROJECT_DIR/problem.json" > "$PROJECT_DIR/problem.json.tmp" && mv "$PROJECT_DIR/problem.json.tmp" "$PROJECT_DIR/problem.json"
        echo "✅ Updated problem statement"
        ;;
    2)
        echo "Current success criteria:"
        jq -r '.successCriteria[]' "$PROJECT_DIR/problem.json"
        echo ""
        echo "Enter new success criteria (one per line, empty line to finish):"
        criteria=()
        while IFS= read -r line; do
            [ -z "$line" ] && break
            criteria+=("$line")
        done
        
        # Convert bash array to JSON array
        criteria_json=$(printf '%s\n' "${criteria[@]}" | jq -R . | jq -s .)
        jq --argjson criteria "$criteria_json" '.successCriteria = $criteria | .metadata.updated = now | .metadata.version = (.metadata.version | split(".") | .[2] = (.[2] | tonumber + 1 | tostring) | join("."))' "$PROJECT_DIR/problem.json" > "$PROJECT_DIR/problem.json.tmp" && mv "$PROJECT_DIR/problem.json.tmp" "$PROJECT_DIR/problem.json"
        echo "✅ Updated success criteria"
        ;;
    3)
        echo "Current user personas:"
        jq -r '.users[] | "- " + .persona + ": " + (.goals | join(", "))' "$PROJECT_DIR/problem.json"
        echo ""
        echo "Add new user persona:"
        read -p "Persona name: " persona_name
        read -p "Goals (comma-separated): " goals_input
        read -p "Pain points (comma-separated): " pain_points_input
        read -p "User story: " user_story
        
        # Convert comma-separated strings to JSON arrays
        IFS=',' read -ra goals_array <<< "$goals_input"
        IFS=',' read -ra pain_points_array <<< "$pain_points_input"
        
        goals_json=$(printf '%s\n' "${goals_array[@]}" | sed 's/^[[:space:]]*//' | jq -R . | jq -s .)
        pain_points_json=$(printf '%s\n' "${pain_points_array[@]}" | sed 's/^[[:space:]]*//' | jq -R . | jq -s .)
        
        jq --arg persona "$persona_name" \
           --argjson goals "$goals_json" \
           --argjson pain_points "$pain_points_json" \
           --arg story "$user_story" \
           '.users += [{"persona": $persona, "goals": $goals, "painPoints": $pain_points, "stories": [$story]}] | .metadata.updated = now | .metadata.version = (.metadata.version | split(".") | .[2] = (.[2] | tonumber + 1 | tostring) | join("."))' \
           "$PROJECT_DIR/problem.json" > "$PROJECT_DIR/problem.json.tmp" && mv "$PROJECT_DIR/problem.json.tmp" "$PROJECT_DIR/problem.json"
        echo "✅ Added new user persona"
        ;;
    4)
        echo "Current constraints:"
        jq -r '.constraints | "Technical: " + .technical + "\nBusiness: " + .business + "\nScope: " + .scope + "\nNon-goals: " + .nonGoals' "$PROJECT_DIR/problem.json"
        echo ""
        read -p "Technical constraints: " tech_constraints
        read -p "Business constraints: " biz_constraints
        read -p "Scope definition: " scope_def
        read -p "Non-goals: " non_goals
        
        jq --arg tech "$tech_constraints" \
           --arg biz "$biz_constraints" \
           --arg scope "$scope_def" \
           --arg nongoals "$non_goals" \
           '.constraints.technical = $tech | .constraints.business = $biz | .constraints.scope = $scope | .constraints.nonGoals = $nongoals | .metadata.updated = now | .metadata.version = (.metadata.version | split(".") | .[2] = (.[2] | tonumber + 1 | tostring) | join("."))' \
           "$PROJECT_DIR/problem.json" > "$PROJECT_DIR/problem.json.tmp" && mv "$PROJECT_DIR/problem.json.tmp" "$PROJECT_DIR/problem.json"
        echo "✅ Updated constraints"
        ;;
    5)
        echo "Opening $PROJECT_DIR/problem.json in default editor..."
        ${EDITOR:-nano} "$PROJECT_DIR/problem.json"
        # Update timestamp after manual edit
        jq '.metadata.updated = now | .metadata.version = (.metadata.version | split(".") | .[2] = (.[2] | tonumber + 1 | tostring) | join("."))' "$PROJECT_DIR/problem.json" > "$PROJECT_DIR/problem.json.tmp" && mv "$PROJECT_DIR/problem.json.tmp" "$PROJECT_DIR/problem.json"
        echo "✅ Manual editing complete"
        ;;
    6)
        echo "📄 Detailed current content:"
        echo "============================"
        jq . "$PROJECT_DIR/problem.json"
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "📋 Revision Summary:"
echo "==================="
jq -r '
"Feature: " + .metadata.featureName + "\n" +
"Version: " + .metadata.version + "\n" +
"Updated: " + .metadata.updated + "\n" +
"Problem: " + .problemStatement + "\n" +
"Users: " + (.users | length | tostring) + " personas\n" +
"Success Criteria: " + (.successCriteria | length | tostring) + " items"
' "$PROJECT_DIR/problem.json"

echo ""
echo "✅ Problem definition revision complete!"
echo "📁 File location: $PROJECT_DIR/problem.json"
echo "🔄 Next: Use 'revise-technical $FEATURE_NAME' if technical approach needs updates"
```

## Output

Update the existing problem.json file with revised content incorporating the requested changes.

## Revision Heuristics

1. **Question assumptions** - challenge what you thought you knew
2. **Validate with users** - get real feedback, not assumptions
3. **Refine success criteria** - make them more specific and measurable
4. **Clarify boundaries** - be explicit about what's in/out of scope
5. **Use codeloops** - leverage actor-critic for iterative improvement
6. **Document changes** - version tracking in metadata shows evolution
7. **Priority over time** - focus on what's most important, ignore temporal constraints
8. **Preserve history** - JSON versioning maintains change tracking
9. **Interactive editing** - menu-driven interface for common revisions
10. **Manual override** - direct JSON editing for complex changes

## Revision Benefits

- **Version tracking**: Each revision increments version number automatically
- **Timestamp accuracy**: Updated field shows exact revision time
- **Structured changes**: Menu options ensure consistent data format
- **Editor integration**: Direct file editing for complex revisions
- **Change visibility**: Clear before/after comparison in terminal
- **Dependency awareness**: Technical and task files can reference updated problem definition