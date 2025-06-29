---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Design technical approach, architecture, and data models for a feature
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`
- Existing codebase patterns: !`find . -name "*.ts" -o -name "*.js" -o -name "*.py" | head -10`

## Task

Design technical approach for: $ARGUMENTS

Research existing codebase and design:

### Technology Stack
- **Language/Framework:** What and why? (align with existing)
- **Dependencies:** New libraries needed? (minimize additions)
- **Database:** Schema changes or new tables needed?
- **Infrastructure:** Deployment, scaling, monitoring considerations

### Data Models  
- **Core entities:** What are the main data objects?
- **Relationships:** How do entities connect?
- **Schema design:** Database tables/collections with fields
- **Validation rules:** Required fields, constraints, business rules

### Architecture
- **Component structure:** How does this fit into existing architecture?
- **API endpoints:** New routes needed? Request/response schemas?
- **Integration points:** What existing systems/services are affected?
- **File organization:** Where does new code live?

### Security & Quality
- **Authentication:** Who can access this feature?
- **Authorization:** What permissions are needed?
- **Data validation:** Input sanitization and business rule enforcement
- **Error handling:** Edge cases and failure scenarios

## Output

Create GitHub project item titled "🏗️ Technical Approach" with detailed technical design.

## Simple Workflow

```bash
# Find or create project
PROJECT_ID=$(gh project list --owner="@me" --format=json | jq -r '.[0].id' 2>/dev/null)

# Create technical approach item
gh project item-create $PROJECT_ID \
  --title "🏗️ Technical Approach" \
  --body "$(cat <<'EOF'
## Technology Stack
**Framework:** [choice and rationale]
**New Dependencies:** [list with justification]
**Database Changes:** [schema updates needed]

## Data Models
```typescript
interface EntityName {
  id: string;
  field1: string;
  field2: number;
  // ... other fields
}
```

## Architecture
**API Endpoints:**
- GET /api/endpoint - [purpose]
- POST /api/endpoint - [purpose]

**File Structure:**
- src/components/NewFeature/
- src/api/newFeature.ts  
- src/types/newFeature.ts

## Security
- Authentication: [requirements]
- Validation: [rules]
- Error handling: [approach]
EOF
)"
```

## Design Heuristics

1. **Follow existing patterns** - use current codebase conventions and structures
2. **Minimize dependencies** - prefer existing libraries over new ones
3. **Design for change** - build flexible, extensible interfaces
4. **Security first** - validate all inputs, authorize all actions
5. **Performance aware** - consider scale, caching, database efficiency