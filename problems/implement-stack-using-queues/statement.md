Implement a last-in-first-out (LIFO) stack using only standard queue operations.

`operations[i]` is one of `push`, `pop`, `top`, or `empty`. The aligned value
`values[i]` is used only by `push`; it is ignored for every other operation.
Return an array containing the result of each `pop`, `top`, and `empty`
operation, in the order those queries occur. `push` does not add anything to
the returned array. Encode `empty` as `1` for true and `0` for false.

Every trace is valid: `pop` and `top` are never called on an empty stack.

**Constraints:**

- `1 <= operations.length == values.length <= 100`
- `operations[i]` is `push`, `pop`, `top`, or `empty`.
- `1 <= values[i] <= 9` when `operations[i]` is `push`.
- At most 100 calls are made in one trace.
