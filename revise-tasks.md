---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Revise and iterate on task breakdown and priorities
---

## Context

- Current directory: !`pwd`
- Git repository: !`git remote -v 2>/dev/null | head -1 || echo "Not a git repository"`
- Existing projects: !`ls -la .codeloops/ 2>/dev/null | grep "^d" | awk '{print $9}' | grep -v "^\." || echo "No existing projects"`

## Task

Revise task breakdown for: $ARGUMENTS

Analyze existing tasks.json file and update task priorities, dependencies, or add new tasks based on user input.

## JSON-Based Workflow

```bash
# Validate arguments
if [ -z "$ARGUMENTS" ]; then
    echo "Error: Please provide feature/task/bugfix name"
    echo "Usage: revise-tasks <feature_or_task_or_bugfix>"
    echo "Example: revise-tasks 'user-authentication-feature'"
    exit 1
fi

# Extract feature name
FEATURE_NAME=$(echo "$ARGUMENTS" | awk '{print $1}' | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')

# Check if project directory and files exist
PROJECT_DIR=".codeloops/$FEATURE_NAME"
if [ ! -f "$PROJECT_DIR/tasks.json" ]; then
    echo "⚠️  Task breakdown not found: $PROJECT_DIR/tasks.json"
    echo "Run 'plan-tasks $FEATURE_NAME' first"
    exit 1
fi

echo "📝 Revising task breakdown for: $FEATURE_NAME"
echo ""

# Display current tasks summary
echo "📄 Current tasks:"
jq -r '.tasks[] | "- " + .id + ": " + .title + " (" + .priority + ", " + .status + ")"' "$PROJECT_DIR/tasks.json"

echo ""
echo "💡 What would you like to do?"
echo "1. Add new task"
echo "2. Update task priority"
echo "3. Update task status"
echo "4. Add task dependencies"
echo "5. Open JSON file in editor"
echo "6. Show detailed task list"

read -p "Enter choice (1-6): " choice

case $choice in
    1)
        echo "Adding new task..."
        read -p "Task ID: " task_id
        read -p "Task title: " task_title
        read -p "Description: " task_desc
        read -p "Priority (P0/P1/P2): " task_priority
        read -p "Estimated hours: " task_hours
        
        # Create new task object and add to tasks array
        jq --arg id "$task_id" \
           --arg title "$task_title" \
           --arg desc "$task_desc" \
           --arg priority "$task_priority" \
           --argjson hours "$task_hours" \
           '.tasks += [{
             "id": $id,
             "title": $title,
             "description": $desc,
             "priority": $priority,
             "status": "pending",
             "estimatedHours": $hours,
             "userStory": "",
             "contextAnalysis": {"whatExists": [], "whatsMissing": []},
             "fileStructureChanges": {"newFiles": [], "modifiedFiles": [], "movedFiles": []},
             "implementationDetails": {"files": [], "functions": [], "apiEndpoints": [], "databaseChanges": []},
             "technicalSpecifications": "",
             "implementationConstraints": [],
             "externalDependencies": [],
             "integrationPoints": [],
             "acceptanceCriteria": [],
             "successDefinition": "",
             "outOfScope": [],
             "dependencies": [],
             "createdDate": now,
             "updatedDate": now
           }] | .metadata.updated = now' \
           "$PROJECT_DIR/tasks.json" > "$PROJECT_DIR/tasks.json.tmp" && mv "$PROJECT_DIR/tasks.json.tmp" "$PROJECT_DIR/tasks.json"
        echo "✅ Added new task: $task_id"
        ;;
    2)
        echo "Current tasks:"
        jq -r '.tasks[] | .id + ": " + .title + " (current: " + .priority + ")"' "$PROJECT_DIR/tasks.json"
        echo ""
        read -p "Task ID to update: " task_id
        read -p "New priority (P0/P1/P2): " new_priority
        
        jq --arg id "$task_id" --arg priority "$new_priority" \
           '(.tasks[] | select(.id == $id) | .priority) = $priority | .metadata.updated = now' \
           "$PROJECT_DIR/tasks.json" > "$PROJECT_DIR/tasks.json.tmp" && mv "$PROJECT_DIR/tasks.json.tmp" "$PROJECT_DIR/tasks.json"
        echo "✅ Updated priority for task $task_id"
        ;;
    3)
        echo "Current tasks:"
        jq -r '.tasks[] | .id + ": " + .title + " (current: " + .status + ")"' "$PROJECT_DIR/tasks.json"
        echo ""
        read -p "Task ID to update: " task_id
        read -p "New status (pending/in_progress/completed/blocked): " new_status
        
        jq --arg id "$task_id" --arg status "$new_status" \
           '(.tasks[] | select(.id == $id) | .status) = $status | (.tasks[] | select(.id == $id) | .updatedDate) = now | .metadata.updated = now' \
           "$PROJECT_DIR/tasks.json" > "$PROJECT_DIR/tasks.json.tmp" && mv "$PROJECT_DIR/tasks.json.tmp" "$PROJECT_DIR/tasks.json"
        echo "✅ Updated status for task $task_id"
        ;;
    5)
        ${EDITOR:-nano} "$PROJECT_DIR/tasks.json"
        jq '.metadata.updated = now' "$PROJECT_DIR/tasks.json" > "$PROJECT_DIR/tasks.json.tmp" && mv "$PROJECT_DIR/tasks.json.tmp" "$PROJECT_DIR/tasks.json"
        echo "✅ Manual editing complete"
        ;;
    6)
        echo "📄 Detailed task list:"
        jq . "$PROJECT_DIR/tasks.json"
        ;;
    *)
        echo "Feature not yet implemented. Use option 5 for manual editing."
        ;;
esac

echo ""
echo "✅ Task breakdown revision complete!"
echo "📁 File location: $PROJECT_DIR/tasks.json"
```

## Output

Update the existing tasks.json file with revised task priorities, statuses, or new tasks based on user input.

Revise task breakdown based on: $ARGUMENTS

**IMPORTANT: Focus on priority and execution order, NOT temporal planning.**

Analyze existing "📝 [Feature Name] - Tasks & Priority" project item and individual task items, then update with improved breakdown based on the user input.

## Output

Update the existing "📝 [Feature Name] - Tasks & Priority" GitHub project item and revise individual task items as needed to incorporate the requested changes.

## Revision Heuristics

1. **User value first** - prioritize by real user impact, not technical ease
2. **Priority over time** - use P0/P1/P2 rankings, never time estimates
3. **Execution order only** - focus on dependencies, ignore temporal planning
4. **Right-size tasks** - not too big (unmanageable) or too small (overhead)
5. **Clear done criteria** - acceptance criteria should be specific and testable
6. **Dependency accuracy** - ensure blocking relationships are correct
7. **Use codeloops** - leverage actor-critic for iterative task refinement
8. **Document changes** - explain what was revised and why
9. **Validate with stakeholders** - ensure priorities align with user needs