Implement a first-in-first-out (FIFO) queue using only standard stack operations.

`operations[i]` is one of `push`, `pop`, `peek`, or `empty`. The aligned value
`values[i]` is used only by `push`; it is ignored for every other operation.
Return an array containing the result of each `pop`, `peek`, and `empty`
operation, in the order those queries occur. `push` does not add anything to
the returned array. Encode `empty` as `1` for true and `0` for false.

Every trace is valid: `pop` and `peek` are never called on an empty queue.

**Constraints:**

- `1 <= operations.length == values.length <= 100`
- `operations[i]` is `push`, `pop`, `peek`, or `empty`.
- `1 <= values[i] <= 9` when `operations[i]` is `push`.
- At most 100 calls are made in one trace.
