Check whether a pop order could have come from a push order through one stack.

Items are pushed onto an empty stack in the order listed by `pushed`, and at any moment the top item may be popped. The popped items, in order, should equal `popped`. All values are distinct and `popped` is a rearrangement of `pushed`.

Given both orders, return `true` when the pop sequence is achievable and `false` otherwise.

**Constraints:**
- `1 <= pushed.length <= 1000`
- `0 <= pushed[i] <= 1000`
- Values in `pushed` are pairwise distinct.
- `popped` holds exactly the same values in some order.
