## Approach

Build a trie of all target words, then perform DFS from each cell on the board, pruning the search when the current path no longer matches any prefix in the trie.

## Complexity Analysis

- **Time Complexity:** O(m×n×4^L)
- **Space Complexity:** O(total characters in words)

## Implementation

```python
from typing import List
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None
class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        root = TrieNode()
        for w in words:
            node = root
            for c in w:
                if c not in node.children:
                    node.children[c] = TrieNode()
                node = node.children[c]
            node.word = w
        m, n = len(board), len(board[0])
        res = set()
        def dfs(i, j, node):
            if i < 0 or i >= m or j < 0 or j >= n:
                return
            c = board[i][j]
            if c not in node.children:
                return
            node = node.children[c]
            if node.word:
                res.add(node.word)
            board[i][j] = '#'
            for di, dj in ((1,0),(-1,0),(0,1),(0,-1)):
                dfs(i + di, j + dj, node)
            board[i][j] = c
        for i in range(m):
            for j in range(n):
                dfs(i, j, root)
        return list(res)
```
