There are `n` people labeled `0` to `n - 1`. A celebrity knows nobody but is known by everybody else.

**Adaptation:** instead of a `knows` API plus `n`, you receive an adjacency
matrix `graph` where `graph[i][j] == 1` means person `i` knows person `j`
(diagonal entries are ignored). Implement `findCelebrity(graph)` returning
the celebrity label, or `-1` when none exists.

**Examples:**
```
Input: graph = [[1,1,0],[0,1,0],[1,1,1]]
Output: 1
```
```
Input: graph = [[1,0,1],[1,1,0],[0,1,1]]
Output: -1
```
```
Input: graph = [[1,0],[1,1]]
Output: 0
```

**Constraints:**
- `1 <= n <= 100`
- `graph` is `n x n` with entries `0` or `1`.
