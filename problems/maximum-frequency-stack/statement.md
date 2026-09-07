Design a stack-like data structure to push elements and pop the most frequent
element.

`operations[i]` is `push` or `pop`. The aligned value `values[i]` is used
only by `push`; it is ignored for `pop`. Return an array containing the result
of each `pop` operation, in order. `push` does not add anything to the
returned array. When frequencies tie, the element closest to the top is
popped.

Every trace is valid: `pop` is never called on an empty stack.

**Constraints:**

- `0 <= values[i] <= 10^9` when `operations[i]` is `push`.
- `1 <= operations.length == values.length <= 20000`
- At most `2 * 10^4` calls are made in one trace.
