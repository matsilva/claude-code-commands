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
- **Dependencies:** New libraries needed? (ensure Zod is available for TypeScript projects)
- **Schema validation:** Use Zod for all data validation and type derivation
- **Database:** Schema changes or new tables needed?
- **Infrastructure:** Deployment, scaling, monitoring considerations

### Data Models  
- **Core entities:** What are the main data objects?
- **Relationships:** How do entities connect?
- **Schema design:** Database tables/collections with fields
- **Validation rules:** Required fields, constraints, business rules
- **TypeScript schemas:** Use Zod for schema definition, derive types with z.infer (never standalone types)

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
import { z } from 'zod';

// Define schema with Zod (validation + structure)
const EntityNameSchema = z.object({
  id: z.string().uuid(),
  field1: z.string().min(1),
  field2: z.number().positive(),
  // ... other fields with validation
});

// Derive type from schema
type EntityName = z.infer<typeof EntityNameSchema>;

// Use for validation
const validatedData = EntityNameSchema.parse(rawData);
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
3. **Zod-first TypeScript** - define schemas with Zod, derive types with z.infer, never standalone types
4. **Design for change** - build flexible, extensible interfaces
5. **Security first** - validate all inputs, authorize all actions
6. **Performance aware** - consider scale, caching, database efficiency
7. **Priority-driven design** - focus on implementation order and dependencies, not timelines or schedules