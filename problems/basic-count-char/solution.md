## Approach

Take the target character from the one-letter string. Scan the text and count every position holding that character.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def countChar(self, s: str, ch: str) -> int:
        count = 0
        for c in s:
            if c == ch:
                count += 1
        return count
```
