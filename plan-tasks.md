---
allowed-tools: TodoWrite, TodoRead, Write, Read, Edit, MultiEdit, Bash(git *), Bash(gh *), Glob, Grep, LS, WebFetch, WebSearch, Task, mcp__codeloops__*
description: Break down feature into prioritized, actionable tasks with dependencies
---

## Context

- Current directory: !`pwd`
- Git repository: !`gh repo view --json name 2>/dev/null || echo "Not a GitHub repository"`
- GitHub Projects: !`gh project list --owner="@me" 2>/dev/null || echo "No GitHub Projects found"`
- GitHub auth: !`gh auth status 2>/dev/null || echo "Not authenticated - run: gh auth login --with-token < ~/.config/gh/my_token.txt"`
- Problem definition: Check existing "📋 Problem & Users" project item
- Technical design: Check existing "🏗️ Technical Approach" project item

## Task

Break down implementation plan for: $ARGUMENTS

**IMPORTANT: Focus on priority and execution order, NOT temporal planning. Time estimates and deadlines are irrelevant - only priority (P0/P1/P2) and task dependencies matter.**

**CRITICAL: Before creating tasks, analyze the existing codebase to understand what already exists, what patterns to follow, and what constraints to respect. Each task must specify exactly what to reuse vs what to build new.**

Create specific, actionable tasks based on problem definition, technical design, and codebase analysis:

### Task Breakdown Strategy
1. **Analyze existing codebase** - understand what already exists vs what needs to be built
2. **Identify reusable patterns** - find existing code patterns, libraries, and conventions to follow
3. **Define implementation constraints** - what should NOT be changed or reimplemented
4. **Plan file structure changes** - show before/after directory structure with NEW/MODIFIED indicators
5. **Start with user stories** from problem definition
6. **Map to technical components** from technical design
7. **Break into granular implementation steps** - each task should be 1-4 hours of focused work
8. **Specify exact implementation details** - which files, functions, components to create/modify
9. **Identify dependencies** - what blocks what?
10. **Prioritize ruthlessly** - P0 (must have), P1 (should have), P2 (nice to have)

### Task Format
Each task becomes its own GitHub project item with:
- **Title:** "TASK-XXX: [Specific implementation action - Create/Modify/Implement X]"
- **Focused scope:** Clear statement of exactly what this task accomplishes
- **User story format:** "As a [user], I want [goal], so that [benefit]"
- **Analysis of current state:** What already exists vs what's missing for this task
- **File structure changes:** Explicit before/after showing NEW/MODIFIED/MOVED files
- **Implementation details:** Exactly which files, functions, components to create or modify
- **Technical specifications:** Specific code patterns, data structures, API contracts with code examples
- **Implementation constraints:** Clear list of what NOT to change or reimplement
- **Reuse existing patterns:** Specific guidance on following existing code patterns
- **Acceptance criteria:** Granular, testable implementation conditions (not high-level outcomes)
- **Success definition:** Clear definition of what successful completion looks like
- **Explicit scope boundaries:** Clear "Out of Scope" section listing what NOT to implement
- **Proper priority:** P0/P1/P2 based on user impact and dependencies
- **Dependencies noted:** What must be completed first?

### Priority Guidelines
- **P0 (Must Have):** Core functionality, blocks other work, user-critical
- **P1 (Should Have):** Important but not blocking, clear user value
- **P2 (Nice to Have):** Polish, optimization, future enhancement

## Output

1. **Analyze existing codebase** - understand current state, patterns, and constraints before task creation
2. Create GitHub project item titled "📝 [Feature Name] - Tasks & Priority" with task breakdown overview (use actual feature name)
3. **Create individual GitHub project items for EACH implementation task** (every task becomes its own project item)
4. Each task must include codebase analysis, file structure changes, implementation constraints, and code examples
5. Set Priority field for each task item

## Simple Workflow

```bash
# Find or create project  
PROJECT_NUMBER=$(gh project list --owner="@me" --format=json | jq -r '.[0].number' 2>/dev/null)
PROJECT_ID=$(gh project list --owner="@me" --format=json | jq -r '.[0].id' 2>/dev/null)

# Add Priority field if not exists
gh project field-create $PROJECT_ID --name "Priority" --type "single_select" --options "P0,P1,P2" 2>/dev/null || true

# Create tasks overview item content (use actual feature name from $ARGUMENTS)
OVERVIEW_CONTENT="## Task Breakdown

### P0 Tasks (Must Have)
- TASK-001: Create User database schema and migration
- TASK-002: Implement password hashing utility functions
- TASK-003: Create user registration API endpoint
- TASK-004: Create user login API endpoint  
- TASK-005: Build registration form component
- TASK-006: Build login form component
- TASK-007: Implement client-side auth state management
- TASK-008: Create protected route wrapper component

### P1 Tasks (Should Have)  
- TASK-009: Create user profile view component
- TASK-010: Create user profile edit form component
- TASK-011: Implement profile update API endpoint

### P2 Tasks (Nice to Have)
- TASK-012: Create date range filter component
- TASK-013: Implement category filter dropdown
- TASK-014: Create status filter toggle component
- TASK-015: Build combined filter logic and state

### Dependencies
- TASK-003 depends on TASK-001, TASK-002
- TASK-004 depends on TASK-001, TASK-002
- TASK-005 depends on TASK-003
- TASK-006 depends on TASK-004
- TASK-007 depends on TASK-004
- TASK-008 depends on TASK-007
- TASK-009 depends on TASK-001, TASK-004
- TASK-010 depends on TASK-009
- TASK-011 depends on TASK-001
- TASK-012,013,014,015 depend on TASK-008"

# Create tasks overview item
gh project item-create $PROJECT_NUMBER \
  --owner "@me" \
  --title "📝 User Authentication System - Tasks & Priority" \
  --body "$OVERVIEW_CONTENT"

# Create individual GitHub project items for EACH task
# IMPORTANT: Every implementation task must be its own GitHub project item

# Task 1 (P0) - Very specific implementation task with full context
TASK1_CONTENT="**Focused Scope:** Create User database schema as foundation for authentication system without profile or advanced features

**User Story:** As a developer, I need a User database schema, so that user registration and login can store data

**Analysis of Current State:**
✅ **What Already Exists:**
- Database connection and migration system
- Existing table patterns in migrations/ directory
- UUID extension and timestamp handling

❌ **What's Missing:**
- User table schema
- Email indexing for login performance
- User-specific constraints and validations

**File Structure Changes:**
```
database/
├── migrations/
│   ├── 000_initial.sql (EXISTS)
│   └── 001_create_users_table.sql (NEW)
└── schema.sql (MODIFIED - add users table)
```

**Implementation Details:**
- Create database migration file: migrations/001_create_users_table.sql
- Define User schema with: id (UUID), email (unique), password_hash, created_at, updated_at
- Add proper indexes on email field for login performance
- Include database constraints for email uniqueness and required fields

**Technical Specifications with Code Examples:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

**Implementation Constraints:**
❌ **Do NOT implement:**
- User profile fields beyond email (follow existing pattern of separate profile tables)
- Email verification workflow (separate feature)
- Soft delete functionality (not needed for MVP)
- Audit trails (existing pattern uses separate audit tables)

**Reuse Existing Patterns:**
- Follow existing migration file naming: ###_description.sql
- Use same UUID generation pattern as other tables
- Follow existing timestamp pattern with created_at/updated_at
- Use same indexing conventions as existing tables

**Acceptance Criteria:**
- [ ] Migration file creates users table with exact schema above
- [ ] Email field has unique constraint that prevents duplicate emails
- [ ] All required fields (email, password_hash) have NOT NULL constraints
- [ ] UUID primary key is properly configured
- [ ] Email index exists for query performance
- [ ] Migration runs successfully without errors
- [ ] Can insert and query user records via database client

**Success Definition:**
A working users table that serves as the foundation for authentication, following existing database patterns and ready for registration/login endpoints.

**Out of Scope:**
- User profile fields (name, avatar, etc.)
- Email verification columns
- Password reset token fields
- User roles or permissions columns
- Soft delete functionality
- Audit trail columns

**Dependencies:** None (foundational database schema)
**Priority:** P0"

gh project item-create $PROJECT_NUMBER \
  --owner "@me" \
  --title "TASK-001: Create user authentication system" \
  --body "$TASK1_CONTENT"

# Task 2 (P0) - Very specific implementation task with full context
TASK2_CONTENT="**Focused Scope:** Create password hashing utilities following existing crypto patterns without additional security features

**User Story:** As a developer, I need password hashing utilities, so that user passwords are securely stored

**Analysis of Current State:**
✅ **What Already Exists:**
- bcrypt dependency in package.json
- Existing crypto utilities in src/utils/
- TypeScript configuration and error handling patterns
- Unit testing setup with Jest

❌ **What's Missing:**
- Password hashing utility functions
- Password validation logic
- Tests for password utilities

**File Structure Changes:**
```
src/
├── utils/
│   ├── crypto.ts (EXISTS - existing crypto utilities)
│   ├── password.ts (NEW - password-specific utilities)
│   └── validation.ts (MODIFIED - add password validation)
└── tests/
    └── utils/
        └── password.test.ts (NEW)
```

**Implementation Details:**
- Create utility file: src/utils/password.ts
- Implement hashPassword(plaintext: string): Promise<string> function
- Implement verifyPassword(plaintext: string, hash: string): Promise<boolean> function
- Use bcrypt library with salt rounds = 12
- Add proper error handling and type safety

**Technical Specifications with Code Examples:**
```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(plaintext: string): Promise<string> {
  if (plaintext.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

export async function verifyPassword(
  plaintext: string, 
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}
```

**Implementation Constraints:**
❌ **Do NOT implement:**
- Password strength requirements beyond length (follow existing validation patterns)
- Password history tracking (separate feature)
- Rate limiting (handled at middleware level)
- JWT token generation (separate auth utility)

**Reuse Existing Patterns:**
- Follow existing error handling pattern from src/utils/crypto.ts
- Use same TypeScript types and JSDoc patterns
- Follow existing unit test structure and naming
- Use same async/await patterns as other utilities

**Acceptance Criteria:**
- [ ] hashPassword() produces bcrypt hash with salt rounds 12
- [ ] verifyPassword() correctly validates correct passwords
- [ ] verifyPassword() rejects incorrect passwords
- [ ] Functions handle errors gracefully (throw/return appropriate errors)
- [ ] Password validation rejects passwords under 8 characters
- [ ] Unit tests verify hashing and verification work correctly
- [ ] Same password produces different hashes (due to salt)
- [ ] Hash format matches bcrypt standard $2b$12$...

**Success Definition:**
Reusable password utilities that integrate with existing codebase patterns and provide secure foundation for authentication endpoints.

**Out of Scope:**
- Password strength requirements beyond length
- Password history tracking
- Password expiration logic
- Rate limiting for password attempts
- Password reset token generation
- JWT token generation

**Dependencies:** TASK-001 (users table must exist for context)
**Priority:** P0"

gh project item-create $PROJECT_NUMBER \
  --owner "@me" \
  --title "TASK-002: Implement user dashboard UI" \
  --body "$TASK2_CONTENT"

# Task 3 (P0) - Very specific implementation task
TASK3_CONTENT="**User Story:** As a new user, I want to register for an account, so that I can access the application

**Implementation Details:**
- Create API endpoint: POST /api/auth/register
- Create route handler in: src/routes/auth.ts (or routes/auth.py)
- Implement request validation using schema validation library
- Connect to database to insert new user record
- Return appropriate success/error responses

**Technical Specifications:**
- Endpoint: POST /api/auth/register
- Request body: { email: string, password: string }
- Validation: email format, password min 8 chars, email uniqueness
- Use password hashing utility from TASK-002
- Response: 201 Created with { id, email } or 400/409 with error
- Proper HTTP status codes and error messages

**Acceptance Criteria:**
- [ ] POST /api/auth/register endpoint exists and responds
- [ ] Validates email format using proper regex/library
- [ ] Validates password minimum 8 characters
- [ ] Checks email uniqueness in database
- [ ] Returns 409 Conflict if email already exists
- [ ] Hashes password using TASK-002 utility before storing
- [ ] Inserts user record with hashed password
- [ ] Returns 201 with user id and email on success
- [ ] Returns 400 with validation errors for invalid input
- [ ] Handles database errors gracefully

**Out of Scope:**
- Email verification after registration
- User profile fields beyond email
- Account activation workflow
- Welcome emails or notifications
- Social registration (Google, etc.)
- Username field (only email)

**Dependencies:** TASK-001 (database schema), TASK-002 (password hashing)
**Priority:** P0"

gh project item-create $PROJECT_NUMBER \
  --owner "@me" \
  --title "TASK-003: Add user profile management" \
  --body "$TASK3_CONTENT"

# Task 4 (P0) - Very specific implementation task
TASK4_CONTENT="**User Story:** As a registered user, I want to login to my account, so that I can access protected features

**Implementation Details:**
- Create API endpoint: POST /api/auth/login
- Create route handler in: src/routes/auth.ts (same file as register)
- Implement email/password validation against database
- Generate and return JWT token on successful login
- Set up JWT configuration and signing

**Technical Specifications:**
- Endpoint: POST /api/auth/login
- Request body: { email: string, password: string }
- Look up user by email in database
- Use verifyPassword utility from TASK-002 to check password
- Generate JWT with user ID and email, 24h expiration
- Response: 200 with { token, user: {id, email} } or 401 with error

**Acceptance Criteria:**
- [ ] POST /api/auth/login endpoint exists and responds
- [ ] Looks up user by email in users table
- [ ] Returns 401 if email not found in database
- [ ] Uses verifyPassword utility to check password hash
- [ ] Returns 401 if password verification fails
- [ ] Generates JWT token with user payload (id, email)
- [ ] JWT token expires in 24 hours
- [ ] Returns 200 with token and user info on success
- [ ] Returns 401 with error message for invalid credentials
- [ ] JWT token can be decoded and verified

**Out of Scope:**
- Remember me functionality
- Session persistence beyond JWT
- Multi-device login tracking
- Login attempt rate limiting
- Account lockout after failed attempts
- OAuth or social login

**Dependencies:** TASK-001 (database schema), TASK-002 (password verification), TASK-003 (user registration for test data)
**Priority:** P0"

gh project item-create $PROJECT_NUMBER \
  --owner "@me" \
  --title "TASK-004: Implement advanced search filters" \
  --body "$TASK4_CONTENT"

# Set priority field for each task item (Note: Field operations may require project admin access)
PRIORITY_FIELD_ID=$(gh project field-list $PROJECT_ID --format=json 2>/dev/null | jq -r '.[] | select(.name=="Priority") | .id' || echo "")

if [ -n "$PRIORITY_FIELD_ID" ]; then
  # Set priority for each task
  # P0 tasks (foundational implementation tasks)
  for task_title in "TASK-001" "TASK-002" "TASK-003" "TASK-004" "TASK-005" "TASK-006" "TASK-007" "TASK-008"; do
    ITEM_ID=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json | jq -r --arg title "$task_title" '.[] | select(.title | contains($title)) | .id')
    if [ -n "$ITEM_ID" ]; then
      gh project item-edit --id $ITEM_ID --field-id $PRIORITY_FIELD_ID --project-id $PROJECT_ID --single-select-option-id "P0" 2>/dev/null || true
    fi
  done

  # P1 tasks (profile management features)
  for task_title in "TASK-009" "TASK-010" "TASK-011"; do
    ITEM_ID=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json | jq -r --arg title "$task_title" '.[] | select(.title | contains($title)) | .id')
    if [ -n "$ITEM_ID" ]; then
      gh project item-edit --id $ITEM_ID --field-id $PRIORITY_FIELD_ID --project-id $PROJECT_ID --single-select-option-id "P1" 2>/dev/null || true
    fi
  done

  # P2 tasks (filtering features)
  for task_title in "TASK-012" "TASK-013" "TASK-014" "TASK-015"; do
    ITEM_ID=$(gh project item-list $PROJECT_NUMBER --owner="@me" --format=json | jq -r --arg title "$task_title" '.[] | select(.title | contains($title)) | .id')
    if [ -n "$ITEM_ID" ]; then
      gh project item-edit --id $ITEM_ID --field-id $PRIORITY_FIELD_ID --project-id $PROJECT_ID --single-select-option-id "P2" 2>/dev/null || true
    fi
  done
else
  echo "Priority field not found or not accessible. Tasks created with priorities in body content."
fi
```

## Task Planning Heuristics

1. **Context analysis first** - always analyze existing codebase before creating tasks
2. **Pattern recognition** - identify existing code patterns, libraries, and conventions to follow
3. **Constraint identification** - define what should NOT be changed or reimplemented
4. **File structure planning** - show explicit before/after directory changes
5. **One task, one project item** - every implementation task must be its own GitHub project item
6. **User value first** - prioritize by user impact, not technical complexity
7. **Priority over time** - use P0/P1/P2 rankings, never time estimates or deadlines
8. **Execution order only** - focus on what must be done before what, ignore temporal planning
9. **Granular implementation steps** - each task should be 1-4 hours of focused coding work
10. **Clear done criteria** - acceptance criteria should be specific and testable
11. **Explicit scope boundaries** - always include "Out of Scope" section to prevent feature creep
12. **Dependency aware** - identify and call out blocking relationships
13. **Iterate and refine** - tasks will evolve as you learn more during implementation
14. **Constraint enforcement** - use scope boundaries to keep implementation focused
15. **Implementation specificity** - specify exact files, functions, and code to write
16. **Technical precision** - include data types, API contracts, and code patterns with examples
17. **Success definition** - clear definition of what successful completion looks like
18. **Reuse over rebuild** - always prefer extending existing patterns over creating new ones