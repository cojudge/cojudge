## Approach

Use two pointers `i` for `word1` and `j` for `word2`. Alternately append one character from each string while either pointer is in range. When one string is exhausted, append the remainder of the other string.

## Complexity Analysis

- **Time Complexity:** O(n + m), where n and m are the lengths of the two strings.
- **Space Complexity:** O(n + m) for the merged result.

## Implementation

```python
class Solution:
    def mergeAlternately(self, word1: str, word2: str) -> str:
        res = []
        i = j = 0
        while i < len(word1) or j < len(word2):
            if i < len(word1):
                res.append(word1[i])
                i += 1
            if j < len(word2):
                res.append(word2[j])
                j += 1
        return "".join(res)
```
