## Approach

Use DFS with backtracking from each cell, marking visited cells with a temporary placeholder to avoid reuse, and exploring all four directions.

## Complexity Analysis

- **Time Complexity:** O(m×n×4^L)
- **Space Complexity:** O(L)

## Implementation

```python
from typing import List
class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        m, n = len(board), len(board[0])
        def dfs(i, j, k):
            if k == len(word):
                return True
            if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != word[k]:
                return False
            tmp = board[i][j]
            board[i][j] = '#'
            if dfs(i+1,j,k+1) or dfs(i-1,j,k+1) or dfs(i,j+1,k+1) or dfs(i,j-1,k+1):
                return True
            board[i][j] = tmp
            return False
        for i in range(m):
            for j in range(n):
                if dfs(i, j, 0):
                    return True
        return False
```
