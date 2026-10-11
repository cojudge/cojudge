You are given a binary tree `root` and a number `targetSum`. Count the downward paths whose node values add up to `targetSum`. A path may begin at any node and finish at any descendant of that start (the start and end may coincide); it must follow parent-to-child links only.

**Constraints:**
- Node count lies in `[0, 1000]`.
- Node values and `targetSum` fit the stated ranges; sums may exceed 32-bit during accumulation, so use 64-bit counters internally.
