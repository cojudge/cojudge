Process a trace of operations on a stack that supports retrieving its minimum
element in constant time.

`operations[i]` is one of `push`, `pop`, `top`, or `getMin`. The aligned value
`values[i]` is used only by `push`; it is ignored for every other operation.
Return an array containing the result of each `top` and `getMin` operation, in
the order those queries occur. `push` and `pop` do not add anything to the
returned array.

Every trace is valid: `pop`, `top`, and `getMin` are never called on an empty
stack.

**Constraints:**

- `1 <= operations.length == values.length <= 30000`
- `operations[i]` is `push`, `pop`, `top`, or `getMin`.
- Push values fit in a signed 32-bit integer.
