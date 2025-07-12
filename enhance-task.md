---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Enhance or expand a specific task with additional details and context
---

## Context

- Current directory: !`pwd`
- Git repository: !`git remote -v 2>/dev/null | head -1 || echo "Not a git repository"`
- Existing projects: !`ls -la .codeloops/ 2>/dev/null | grep "^d" | awk '{print $9}' | grep -v "^\." || echo "No existing projects"`

## Task

Enhance specific task: $ARGUMENTS

Analyze the specified task in tasks.json, gather additional context from problem.json and technical.json, and expand the task with comprehensive implementation details.

## JSON-Based Workflow

```bash
# Validate arguments
if [ -z "$ARGUMENTS" ]; then
    echo "Error: Please specify feature and task ID"
    echo "Usage: enhance-task <feature_or_task_or_bugfix> <task_id>"
    echo "Example: enhance-task 'user-authentication-feature' 'T1'"
    exit 1
fi

# Extract feature name and task ID
FEATURE_NAME=$(echo "$ARGUMENTS" | awk '{print $1}' | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
TASK_ID=$(echo "$ARGUMENTS" | awk '{print $2}')

# Check if project directory and files exist
PROJECT_DIR=".codeloops/$FEATURE_NAME"
if [ ! -f "$PROJECT_DIR/tasks.json" ]; then
    echo "⚠️  Task breakdown not found: $PROJECT_DIR/tasks.json"
    echo "Run 'plan-tasks $FEATURE_NAME' first"
    exit 1
fi

# Check if task exists
TASK_EXISTS=$(jq -r --arg id "$TASK_ID" '.tasks[] | select(.id == $id) | .id' "$PROJECT_DIR/tasks.json")
if [ -z "$TASK_EXISTS" ]; then
    echo "⚠️  Task $TASK_ID not found in $FEATURE_NAME"
    echo "Available tasks:"
    jq -r '.tasks[] | "- " + .id + ": " + .title' "$PROJECT_DIR/tasks.json"
    exit 1
fi

echo "📝 ENHANCING TASK: $TASK_ID in $FEATURE_NAME"
echo "============================================"
echo ""

# Display current task
echo "📄 Current task content:"
jq -r --arg id "$TASK_ID" '.tasks[] | select(.id == $id) | 
"Title: " + .title + "\n" +
"Description: " + .description + "\n" +
"Priority: " + .priority + "\n" +
"Status: " + .status + "\n" +
"Estimated Hours: " + (.estimatedHours | tostring)' "$PROJECT_DIR/tasks.json"

echo ""

# Get context from problem and technical files
if [ -f "$PROJECT_DIR/problem.json" ]; then
    echo "📋 Problem Context:"
    jq -r '"Problem: " + .problemStatement + "\nSuccess Criteria: " + (.successCriteria | join(", "))' "$PROJECT_DIR/problem.json"
    echo ""
fi

if [ -f "$PROJECT_DIR/technical.json" ]; then
    echo "🏗️ Technical Context:"
    jq -r '"Language: " + .technologyStack.language + "\nFramework: " + .technologyStack.framework' "$PROJECT_DIR/technical.json"
    echo ""
fi

echo "💡 What would you like to enhance?"
echo "1. User story and acceptance criteria"
echo "2. Implementation details"
echo "3. File structure changes"
echo "4. Technical specifications"
echo "5. Dependencies and constraints"
echo "6. Complete comprehensive enhancement"
echo "7. Open JSON file in editor"

read -p "Enter choice (1-7): " choice

case $choice in
    1)
        read -p "User story: " user_story
        echo "Enter acceptance criteria (one per line, empty line to finish):"
        criteria=()
        while IFS= read -r line; do
            [ -z "$line" ] && break
            criteria+=("$line")
        done
        criteria_json=$(printf '%s\n' "${criteria[@]}" | jq -R . | jq -s .)
        
        jq --arg id "$TASK_ID" --arg story "$user_story" --argjson criteria "$criteria_json" \
           '(.tasks[] | select(.id == $id) | .userStory) = $story |
            (.tasks[] | select(.id == $id) | .acceptanceCriteria) = $criteria |
            (.tasks[] | select(.id == $id) | .updatedDate) = now |
            .metadata.updated = now' \
           "$PROJECT_DIR/tasks.json" > "$PROJECT_DIR/tasks.json.tmp" && mv "$PROJECT_DIR/tasks.json.tmp" "$PROJECT_DIR/tasks.json"
        echo "✅ Enhanced user story and acceptance criteria"
        ;;
    2)
        echo "Current implementation details:"
        jq -r --arg id "$TASK_ID" '.tasks[] | select(.id == $id) | .implementationDetails | 
        "Files: " + (.files | join(", ")) + "\n" +
        "Functions: " + (.functions | join(", ")) + "\n" +
        "API Endpoints: " + (.apiEndpoints | join(", "))' "$PROJECT_DIR/tasks.json"
        echo ""
        
        read -p "Files to modify (comma-separated): " files_input
        read -p "Functions to implement (comma-separated): " functions_input
        read -p "API endpoints (comma-separated): " endpoints_input
        
        IFS=',' read -ra files_array <<< "$files_input"
        IFS=',' read -ra functions_array <<< "$functions_input"
        IFS=',' read -ra endpoints_array <<< "$endpoints_input"
        
        files_json=$(printf '%s\n' "${files_array[@]}" | sed 's/^[[:space:]]*//' | jq -R . | jq -s .)
        functions_json=$(printf '%s\n' "${functions_array[@]}" | sed 's/^[[:space:]]*//' | jq -R . | jq -s .)
        endpoints_json=$(printf '%s\n' "${endpoints_array[@]}" | sed 's/^[[:space:]]*//' | jq -R . | jq -s .)
        
        jq --arg id "$TASK_ID" \
           --argjson files "$files_json" \
           --argjson functions "$functions_json" \
           --argjson endpoints "$endpoints_json" \
           '(.tasks[] | select(.id == $id) | .implementationDetails.files) = $files |
            (.tasks[] | select(.id == $id) | .implementationDetails.functions) = $functions |
            (.tasks[] | select(.id == $id) | .implementationDetails.apiEndpoints) = $endpoints |
            (.tasks[] | select(.id == $id) | .updatedDate) = now |
            .metadata.updated = now' \
           "$PROJECT_DIR/tasks.json" > "$PROJECT_DIR/tasks.json.tmp" && mv "$PROJECT_DIR/tasks.json.tmp" "$PROJECT_DIR/tasks.json"
        echo "✅ Enhanced implementation details"
        ;;
    6)
        echo "🔧 Performing comprehensive enhancement..."
        read -p "Technical specifications: " tech_specs
        read -p "Success definition: " success_def
        echo "Enter out of scope items (one per line, empty line to finish):"
        out_of_scope=()
        while IFS= read -r line; do
            [ -z "$line" ] && break
            out_of_scope+=("$line")
        done
        out_of_scope_json=$(printf '%s\n' "${out_of_scope[@]}" | jq -R . | jq -s .)
        
        jq --arg id "$TASK_ID" \
           --arg specs "$tech_specs" \
           --arg success "$success_def" \
           --argjson scope "$out_of_scope_json" \
           '(.tasks[] | select(.id == $id) | .technicalSpecifications) = $specs |
            (.tasks[] | select(.id == $id) | .successDefinition) = $success |
            (.tasks[] | select(.id == $id) | .outOfScope) = $scope |
            (.tasks[] | select(.id == $id) | .updatedDate) = now |
            .metadata.updated = now' \
           "$PROJECT_DIR/tasks.json" > "$PROJECT_DIR/tasks.json.tmp" && mv "$PROJECT_DIR/tasks.json.tmp" "$PROJECT_DIR/tasks.json"
        echo "✅ Comprehensive enhancement complete"
        ;;
    7)
        ${EDITOR:-nano} "$PROJECT_DIR/tasks.json"
        jq '.metadata.updated = now' "$PROJECT_DIR/tasks.json" > "$PROJECT_DIR/tasks.json.tmp" && mv "$PROJECT_DIR/tasks.json.tmp" "$PROJECT_DIR/tasks.json"
        echo "✅ Manual editing complete"
        ;;
    *)
        echo "Feature not yet implemented. Use option 7 for manual editing."
        ;;
esac

echo ""
echo "📋 Enhanced task summary:"
jq -r --arg id "$TASK_ID" '.tasks[] | select(.id == $id) | 
"ID: " + .id + "\n" +
"Title: " + .title + "\n" +
"Priority: " + .priority + "\n" +
"Status: " + .status + "\n" +
"Updated: " + .updatedDate' "$PROJECT_DIR/tasks.json"

echo ""
echo "✅ Task enhancement complete!"
echo "📁 File location: $PROJECT_DIR/tasks.json"
```

## Output

Update the specified task in tasks.json with comprehensive enhancement including implementation details, context analysis, and clear scope boundaries.

## Enhancement Heuristics

1. **Preserve original scope** - enhancement adds detail, not functionality
2. **Context-driven details** - use problem.json and technical.json for guidance
3. **Structured approach** - menu-driven interface for specific enhancements
4. **Granular updates** - update specific fields without losing other data
5. **Version tracking** - automatic timestamp updates for audit trail
6. **Editor fallback** - direct JSON editing for complex changes