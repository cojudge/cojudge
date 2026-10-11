## Approach

Split the sentence into words and require equal length to the pattern. Maintain forward and reverse maps while scanning pairs; any conflict means no bijection.

## Complexity Analysis

- **Time Complexity:** O(n) over pattern plus words.
- **Space Complexity:** O(k) for distinct symbols.

## Implementation

```python
class Solution:
    def wordPattern(self, pattern: str, s: str) -> bool:
        words = s.split(" ")
        if len(words) != len(pattern):
            return False
        c2w: dict[str, str] = {}
        w2c: dict[str, str] = {}
        for c, w in zip(pattern, words):
            if c in c2w and c2w[c] != w:
                return False
            if w in w2c and w2c[w] != c:
                return False
            c2w[c] = w
            w2c[w] = c
        return True
```
