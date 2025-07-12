---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Revise and iterate on the technical approach and architecture
---

## Context

- Current directory: !`pwd`
- Git repository: !`git remote -v 2>/dev/null | head -1 || echo "Not a git repository"`
- Existing projects: !`ls -la .codeloops/ 2>/dev/null | grep "^d" | awk '{print $9}' | grep -v "^\." || echo "No existing projects"`
- Codebase patterns: !`find . -name "*.ts" -o -name "*.js" -o -name "*.py" | head -5`

## Task

Revise technical approach for: $ARGUMENTS

Analyze existing technical.json file, review codebase patterns, and update with improved technical design based on the user input.

## JSON-Based Workflow

```bash
# Validate arguments
if [ -z "$ARGUMENTS" ]; then
    echo "Error: Please provide feature/task/bugfix name"
    echo "Usage: revise-technical <feature_or_task_or_bugfix>"
    echo "Example: revise-technical 'user-authentication-feature'"
    exit 1
fi

# Extract feature name
FEATURE_NAME=$(echo "$ARGUMENTS" | awk '{print $1}' | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')

# Check if project directory and files exist
PROJECT_DIR=".codeloops/$FEATURE_NAME"
if [ ! -f "$PROJECT_DIR/technical.json" ]; then
    echo "⚠️  Technical approach not found: $PROJECT_DIR/technical.json"
    echo "Run 'plan-technical $FEATURE_NAME' first"
    exit 1
fi

echo "🏗️ Revising technical approach for: $FEATURE_NAME"
echo ""

# Display current technical approach
echo "📄 Current technical approach:"
jq -r '
"Language: " + .technologyStack.language + "\n" +
"Framework: " + .technologyStack.framework + "\n" +
"Dependencies: " + (.technologyStack.dependencies | join(", ")) + "\n" +
"Data Models: " + (.dataModels | length | tostring) + " defined\n" +
"API Endpoints: " + (.architecture.apiEndpoints | length | tostring) + " planned"
' "$PROJECT_DIR/technical.json"

echo ""
echo "💡 What would you like to revise?"
echo "1. Technology stack"
echo "2. Data models"
echo "3. Architecture components"
echo "4. API endpoints"
echo "5. Security approach"
echo "6. Open JSON file in editor"

read -p "Enter choice (1-6): " choice

case $choice in
    1)
        echo "Current tech stack:"
        jq -r '.technologyStack | "Language: " + .language + "\nFramework: " + .framework + "\nDependencies: " + (.dependencies | join(", "))' "$PROJECT_DIR/technical.json"
        echo ""
        read -p "New dependencies (comma-separated): " new_deps
        IFS=',' read -ra deps_array <<< "$new_deps"
        deps_json=$(printf '%s\n' "${deps_array[@]}" | sed 's/^[[:space:]]*//' | jq -R . | jq -s .)
        jq --argjson deps "$deps_json" '.technologyStack.dependencies = $deps | .metadata.updated = now' "$PROJECT_DIR/technical.json" > "$PROJECT_DIR/technical.json.tmp" && mv "$PROJECT_DIR/technical.json.tmp" "$PROJECT_DIR/technical.json"
        echo "✅ Updated dependencies"
        ;;
    2)
        echo "Current data models:"
        jq -r '.dataModels[] | "- " + .name + ": " + .schema' "$PROJECT_DIR/technical.json"
        echo ""
        read -p "Model name: " model_name
        read -p "Schema: " model_schema
        read -p "Validation rules: " validation_rules
        jq --arg name "$model_name" --arg schema "$model_schema" --arg validation "$validation_rules" \
           '.dataModels += [{"name": $name, "schema": $schema, "validationRules": $validation}] | .metadata.updated = now' \
           "$PROJECT_DIR/technical.json" > "$PROJECT_DIR/technical.json.tmp" && mv "$PROJECT_DIR/technical.json.tmp" "$PROJECT_DIR/technical.json"
        echo "✅ Added data model"
        ;;
    6)
        ${EDITOR:-nano} "$PROJECT_DIR/technical.json"
        jq '.metadata.updated = now' "$PROJECT_DIR/technical.json" > "$PROJECT_DIR/technical.json.tmp" && mv "$PROJECT_DIR/technical.json.tmp" "$PROJECT_DIR/technical.json"
        echo "✅ Manual editing complete"
        ;;
    *)
        echo "Feature not yet implemented. Use option 6 for manual editing."
        ;;
esac

echo ""
echo "✅ Technical approach revision complete!"
echo "📁 File location: $PROJECT_DIR/technical.json"
```

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
