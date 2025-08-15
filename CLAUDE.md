# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Subscription Helper** - A Vue 3 application for managing subscription services with a calendar view. All data is stored locally in the browser's LocalStorage.

## Development Commands

```bash
# Install dependencies (using pnpm)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

**Note**: This project currently has no test infrastructure or linting setup.

## Architecture

### Technology Stack
- **Vue 3.5.13** with Composition API
- **Vite 6.0.5** for build tooling
- **Tailwind CSS 3.4.17** for styling
- **LocalStorage** for data persistence

### Key Components

1. **`src/composables/useSubscriptions.js`** - Core state management
   - Manages subscriptions and charges arrays
   - Handles LocalStorage persistence
   - Generates payment records based on subscription cycles

2. **`src/components/CalendarView.vue`** - Main calendar display
   - Monthly grid view showing payment dates
   - Displays subscription emojis and amounts
   - Click handler for day details

3. **`src/components/SubscriptionModal.vue`** - Add/edit form
   - Handles subscription CRUD operations
   - Supports weekly/monthly/yearly/custom cycles
   - Trial period and pause functionality

4. **`src/components/DayDetailModal.vue`** - Daily view modal
   - Shows all subscriptions due on selected date
   - Displays total amount for the day

### Data Structure

#### Subscription Object
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Service name
  emoji: string,        // Visual identifier
  startDate: string,    // ISO date string
  cycle: 'weekly'|'monthly'|'yearly'|'custom',
  customInterval: number, // Days (only for custom cycle)
  status: 'active'|'paused'|'canceled'|'trial',
  endDate: string,      // ISO date (optional, for canceled)
  amount: number,       // Payment amount
  trialEndDate: string  // ISO date (optional, for trials)
}
```

#### LocalStorage Keys
- `subscriptions` - Array of subscription configurations
- `charges` - Array of generated payment records

## Development Guidelines

### Philosophy

#### Core Beliefs

- **Incremental progress over big bangs** - Small changes that compile and pass tests
- **Learning from existing code** - Study and plan before implementing
- **Pragmatic over dogmatic** - Adapt to project reality
- **Clear intent over clever code** - Be boring and obvious

#### Simplicity Means

- Single responsibility per function/class
- Avoid premature abstractions
- No clever tricks - choose the boring solution
- If you need to explain it, it's too complex

### Process

#### 1. Planning & Staging

Break complex work into 3-5 stages. Document in `IMPLEMENTATION_PLAN.md`:

```markdown
## Stage N: [Name]

**Goal**: [Specific deliverable]
**Success Criteria**: [Testable outcomes]
**Tests**: [Specific test cases]
**Status**: [Not Started|In Progress|Complete]
```

- Update status as you progress
- Remove file when all stages are done

#### 2. Implementation Flow

1. **Understand** - Study existing patterns in codebase
2. **Test** - Write test first (red) *Note: No test infrastructure exists yet*
3. **Implement** - Minimal code to pass (green)
4. **Refactor** - Clean up with tests passing
5. **Commit** - With clear message linking to plan

#### 3. When Stuck (After 3 Attempts)

**CRITICAL**: Maximum 3 attempts per issue, then STOP.

1. **Document what failed**:
   - What you tried
   - Specific error messages
   - Why you think it failed

2. **Research alternatives**:
   - Find 2-3 similar implementations
   - Note different approaches used

3. **Question fundamentals**:
   - Is this the right abstraction level?
   - Can this be split into smaller problems?
   - Is there a simpler approach entirely?

4. **Try different angle**:
   - Different library/framework feature?
   - Different architectural pattern?
   - Remove abstraction instead of adding?

### Technical Standards

#### Vue 3 Patterns

- Use Composition API with `<script setup>`
- Prefer composables for shared logic
- Keep components focused and single-purpose
- Use reactive/ref appropriately

#### Styling

- Use Tailwind CSS utility classes
- Maintain consistent spacing and color usage
- Follow existing component patterns for modals and forms

#### State Management

- LocalStorage operations are centralized in `useSubscriptions`
- Avoid direct LocalStorage access in components
- Use computed properties for derived state

### Code Quality

- **Every commit must**:
  - Build successfully (`pnpm build`)
  - Maintain existing functionality
  - Follow Vue 3 best practices

- **Before committing**:
  - Test manually in browser
  - Verify LocalStorage persistence
  - Check console for errors

### Error Handling

- Validate user inputs (especially dates and amounts)
- Handle edge cases in cycle calculations
- Provide user-friendly error messages in Chinese

## Important Project Context

1. **Language**: All UI text is in Traditional Chinese (Taiwan market)
2. **No Backend**: Pure client-side application
3. **No Tests**: Testing infrastructure not yet implemented
4. **No Linting**: No ESLint/Prettier configuration exists
5. **Package Manager**: Uses pnpm (not npm or yarn)

## Common Tasks

### Adding a New Subscription Field
1. Update data structure in `useSubscriptions.js`
2. Add form field in `SubscriptionModal.vue`
3. Update display in relevant components
4. Handle data migration for existing LocalStorage data

### Modifying Calendar Display
1. Main logic is in `CalendarView.vue`
2. Day rendering uses `getDayData()` computed property
3. Style changes use Tailwind classes

### Debugging LocalStorage Issues
1. Check browser DevTools > Application > Local Storage
2. Look for `subscriptions` and `charges` keys
3. Validate JSON structure matches expected format

## Important Reminders

**NEVER**:
- Use `--no-verify` to bypass commit hooks
- Commit code that doesn't compile
- Make assumptions - verify with existing code
- Access LocalStorage directly outside of composables

**ALWAYS**:
- Commit working code incrementally
- Update plan documentation as you go
- Learn from existing implementations
- Stop after 3 failed attempts and reassess
- Test LocalStorage persistence manually