# Design — Fix Form Value Refs

## 1. Problem Analysis

### Root Cause

The `Form.vue` component receives `ref` properties in its `fields` array. Parent components pass Vue 3 `ref()` objects (e.g., `const userNameRef = ref<HTMLInputElement | null>(null)`). The Form's template uses a function ref binding:

```vue
:ref="(el: any) => { if (field.ref && el) field.ref = el }"
```

**The bug:** `field.ref` is a Vue `Ref<HTMLInputElement | null>`, which is an object with a `.value` property. The code assigns `el` directly to `field.ref` (replacing the ref object with the DOM element) instead of assigning to `field.ref.value`. This means:

1. On first render, the Vue ref object gets replaced by the raw DOM element
2. On re-renders, `field.ref` is now the DOM element, not a ref, so the `if (field.ref && el)` check may behave inconsistently
3. Parent components read `userNameRef.value?.value` expecting a Vue ref, but the ref was overwritten

Additionally, the `FormField` interface types `ref` as `HTMLInputElement | null` instead of `Ref<HTMLInputElement | null>`, masking the type mismatch.

### Affected Components

| Component | Fields | Impact |
|---|---|---|
| `Login.vue` | `userNameRef`, `passwordRef` | Login fails — username is `undefined` |
| `SignUp.vue` | `userNameRef`, `emailRef`, `passwordRef`, `passwordTwodRef` | Registration fails |
| `CreateRoom.vue` | `roomNameRef`, `passwordRef`, `passwordTwodRef` | Room creation fails |
| `MissingEmail.vue` | `emailRef` | Email submission fails |
| `AdminView.vue` | `passRef`, `passTwoRef`, `modelRef`, `promptRef`, `roomNameRef`, `imgPathRef`, `framesRef`, `strengthRef`, `genStepsRef`, `cfgRef`, `endPercentRef` | Admin operations fail |
| `UserDetails.vue` | `userNameRef`, `emailRef`, `passRef`, `pass2Ref`, `colorRef`, `imageRef` | Profile updates fail |
| `Navigation.vue` → `AdminPanel.vue` | `passwordRef` | Admin login fails |
| `RoomNameEditForm.vue` | `roomNameRef` (uses `v-model` + ref) | Room name edit may have sync issues |

## 2. Proposed Solution

### 2.1 Fix Form.vue Template Ref Binding

Change the template ref assignment from:
```vue
:ref="(el: any) => { if (field.ref && el) field.ref = el }"
```

To:
```vue
:ref="(el: any) => { if (field.ref && el) field.ref.value = el }"
```

This correctly assigns the DOM element to the `.value` property of the Vue ref.

### 2.2 Fix Form.vue TypeScript Interface

Update the `FormField` interface:
```typescript
import type { Ref } from 'vue'

interface FormField {
  name: string
  placeholder?: string
  label?: string
  id?: string
  type?: string
  ref?: Ref<HTMLInputElement | null>
  required?: boolean
}
```

### 2.3 Add v-model Support to Form.vue (Alternative Binding)

For components that prefer two-way binding over refs, add optional `v-model` support:

- Add `modelValue` prop to `FormField` interface
- Bind `:value` and `@input` on inputs when `modelValue` is provided
- This enables cleaner patterns like `v-model="username"` instead of `ref="userNameRef"`

### 2.4 Component-Specific Changes

#### Login.vue
- No structural changes needed after Form.vue fix
- The `userNameRef.value?.value` pattern will work correctly once Form.vue assigns to `.value`

#### SignUp.vue
- No structural changes needed after Form.vue fix

#### CreateRoom.vue
- No structural changes needed after Form.vue fix

#### MissingEmail.vue
- No structural changes needed after Form.vue fix

#### AdminView.vue
- No structural changes needed after Form.vue fix
- Has 11 refs — all will work once Form.vue is fixed

#### UserDetails.vue
- No structural changes needed after Form.vue fix

#### Navigation.vue / AdminPanel.vue
- No structural changes needed after Form.vue fix
- `AdminPanel.vue` receives `refer: HTMLInputElement | null` prop — update type to `Ref<HTMLInputElement | null>`

#### RoomNameEditForm.vue
- Already uses `v-model="roomName"` + `ref="roomNameRef"` — this pattern is correct
- No changes needed

## 3. Files Modified

| File | Change |
|---|---|
| `src/components/Form/Form.vue` | Fix template ref binding, fix `FormField.ref` type |
| `src/components/AdminPanel/AdminPanel.vue` | Fix `refer` prop type |
| `tests/Form.test.ts` | Add tests for ref value capture |
| `tests/Login.test.ts` | New: test login form ref values |
| `tests/SignUp.test.ts` | New: test signup form ref values |
| `ARCHITECTURE.md` | Update if form architecture description changes |

## 4. Discarded Alternatives

### Alternative A: Replace all refs with v-model in parent components
- **Rejected** because it requires rewriting every form component's state management
- Higher risk of introducing new bugs
- The ref pattern is valid Vue 3 usage; only the Form component's binding was wrong

### Alternative B: Use `defineExpose` in Form.vue to expose internal input refs
- **Rejected** because it changes the public API of Form.vue
- Parent components would need to be rewritten to use `formRef.getInput('username')`
- More complex than the minimal fix

### Alternative C: Use `shallowRef` instead of `ref` for form values
- **Rejected** because `shallowRef` is for performance optimization, not correctness
- Does not address the root cause (assignment to ref object vs ref.value)

## 5. Test Strategy

### Unit Tests (Form component)
- Mount Form with fields that have `ref` props
- Simulate user input via `setValue()`
- Verify `ref.value?.value` equals the entered text
- Test password toggle preserves value
- Test multiple fields independently

### Integration Tests (View components)
- Login: type username + password, submit, verify values are captured
- SignUp: type all 4 fields, submit, verify values
- CreateRoom: type all 3 fields, submit, verify values
- Mock API calls to prevent real network requests

### Test Infrastructure
- Use `@vue/test-utils` with `mount()`
- Use `flushPromises()` for async operations
- Mock axios via `vi.mock('axios')`
- Use `jsdom` environment (already configured per-file)
