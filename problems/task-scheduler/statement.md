You are given a string `tasks` whose uppercase letters represent CPU tasks and a nonnegative integer `n`. Each task takes one unit of time. Tasks may be executed in any order, but two executions of the same letter must be separated by at least `n` time units during which the CPU executes other tasks or is idle.

Return the minimum number of time units needed to execute every task.

This portable API adapts the original character-array input to a string. Each character of `tasks` is one task.

**Constraints:**

- `1 <= tasks.length <= 10^4`
- Every character in `tasks` is an uppercase English letter from `A` through `Z`.
- `0 <= n <= 100`
