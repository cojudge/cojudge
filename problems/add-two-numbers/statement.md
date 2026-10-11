Two non-negative integers are handed to you, each encoded as a non-empty linked list with the least significant digit first: every node stores a single decimal digit, so the head holds the ones place, the next node the tens place, and so on. Compute the arithmetic total of the two encoded integers and hand it back encoded the same way, least significant digit first.

Written out normally, neither input carries a leading zero, apart from the value zero itself, which is written as the lone digit zero.

**Constraints:**

- Each list contains between `1` and `100` nodes.
- `0 <= node.val <= 9`
- Each list represents a number without leading zeros, except the single-node
  list `[0]`.
