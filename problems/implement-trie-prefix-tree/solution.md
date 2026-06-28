## Approach

A trie (prefix tree) where each node holds a map of child characters and a boolean end-of-word flag. Insert traverses character by character, creating nodes as needed. Search and startsWith traverse similarly, checking existence.

## Complexity Analysis

- **Time Complexity:** O(n) per operation, where n is the word length.
- **Space Complexity:** O(total number of characters inserted across all words).

## Implementation

```python
from typing import List
class Trie:
    def __init__(self):
        self.children = {}
        self.is_end = False
    def insert(self, word: str) -> None:
        node = self
        for c in word:
            if c not in node.children:
                node.children[c] = Trie()
            node = node.children[c]
        node.is_end = True
    def search(self, word: str) -> bool:
        node = self
        for c in word:
            if c not in node.children:
                return False
            node = node.children[c]
        return node.is_end
    def startsWith(self, prefix: str) -> bool:
        node = self
        for c in prefix:
            if c not in node.children:
                return False
            node = node.children[c]
        return True
class Solution:
    def solve(self, operations: List[str], values: List[str]) -> List[str]:
        result = []
        obj = None
        for i, op in enumerate(operations):
            if op == "Trie":
                obj = Trie()
                result.append("null")
            elif op == "insert":
                obj.insert(values[i])
                result.append("null")
            elif op == "search":
                result.append(str(obj.search(values[i])).lower())
            elif op == "startsWith":
                result.append(str(obj.startsWith(values[i])).lower())
        return result
```
