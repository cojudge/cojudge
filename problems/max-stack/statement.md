Design a stack that can also report and remove its maximum in addition to the usual push, pop and top.

Supported steps, encoded as parallel lists `operations` and `values` (use `0` when a step takes no argument):

- `push(x)`: place `x` on top.
- `pop()`: remove and return the top value.
- `top()`: return the top value without removing it.
- `peekMax()`: return the largest value in the stack.
- `popMax()`: remove and return the largest value; when several copies share the maximum, remove the one nearest the top.

Only the last four actions produce output; collect those answers in call order.

*Adaptation note:* the entry point is `runMaxStack(operations, values)` returning the answer list.

**Constraints:**
- `1 <= operations.length <= 2000`
- Values fit in a 32-bit signed integer.
- Every pop, top, peekMax or popMax call has at least one element present.
