There are `n` people labeled `0` to `n - 1`. A celebrity knows nobody but is known by everybody else.

**Adaptation:** instead of a `knows` API plus `n`, you receive an adjacency
matrix `graph` where `graph[i][j] == 1` means person `i` knows person `j`
(diagonal entries are ignored). Implement `findCelebrity(graph)` returning
the celebrity label, or `-1` when none exists.

**Constraints:**
- `1 <= n <= 100`
- `graph` is `n x n` with entries `0` or `1`.
