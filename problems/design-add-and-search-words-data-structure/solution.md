## Approach

Use a trie where each node stores children characters and an end-of-word flag. The search method handles `.` wildcards by recursively trying all child nodes at that position.

## Complexity Analysis

- **Time Complexity:** O(n) for addWord, O(26^m) worst-case for search with wildcards where m is word length and n is word length.
- **Space Complexity:** O(total characters stored across all words)

## Implementation

```python
from typing import List
class WordDictionary:
    def __init__(self):
        self.children = {}
        self.is_end = False
    def addWord(self, word: str) -> None:
        node = self
        for c in word:
            if c not in node.children:
                node.children[c] = WordDictionary()
            node = node.children[c]
        node.is_end = True
    def search(self, word: str) -> bool:
        return self._search(word, 0)
    def _search(self, word: str, i: int) -> bool:
        node = self
        for j in range(i, len(word)):
            c = word[j]
            if c == '.':
                for child in node.children.values():
                    if child._search(word, j + 1):
                        return True
                return False
            if c not in node.children:
                return False
            node = node.children[c]
        return node.is_end
class Solution:
    def solve(self, operations: List[str], values: List[str]) -> List[str]:
        result = []
        obj = None
        for i, op in enumerate(operations):
            if op == "WordDictionary":
                obj = WordDictionary()
                result.append("null")
            elif op == "addWord":
                obj.addWord(values[i])
                result.append("null")
            elif op == "search":
                result.append(str(obj.search(values[i])).lower())
        return result
```
