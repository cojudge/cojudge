Design a stack that can also report and remove its maximum in addition to the usual push, pop and top.

Implement the `MaxStack` class:

- `MaxStack()` Initializes the stack object.
- `void push(int x)` Pushes `x` onto the stack.
- `int pop()` Removes the element on top of the stack and returns it.
- `int top()` Returns the element on top of the stack without removing it.
- `int peekMax()` Returns the maximum element in the stack without removing it.
- `int popMax()` Returns the maximum element in the stack and removes it. If there are multiple copies of the maximum, only the one closest to the top is removed.

The class keeps its LeetCode name `MaxStack` (the harness reserves `Solution` for the driver); the constructor and methods match the original.

**Constraints:**
- Values fit in a 32-bit signed integer.
- At most `10^4` calls will be made to `push`, `pop`, `top`, `peekMax` and `popMax` in total.
- Every `pop`, `top`, `peekMax` or `popMax` call has at least one element present; every trace begins with `MaxStack`.
