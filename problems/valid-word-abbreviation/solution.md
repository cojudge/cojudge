## Approach

Scan the word and the shorthand together. Digits accumulate into a skip count (rejecting any number that starts with zero), which advances the word pointer without consuming shorthand letters beyond the number; letters must match the current word character. Skips that run past the end fail at once. Success needs both pointers to land exactly at their ends.

## Complexity Analysis

- **Time Complexity:** O(n + m), where n and m are the two lengths.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def validWordAbbreviation(self, word: str, abbr: str) -> bool:
        i = j = 0
        n, m = len(word), len(abbr)
        while j < m:
            c = abbr[j]
            if c.isdigit():
                if c == "0":
                    return False
                num = 0
                while j < m and abbr[j].isdigit():
                    num = num * 10 + int(abbr[j])
                    j += 1
                i += num
                if i > n:
                    return False
            else:
                if i >= n or word[i] != c:
                    return False
                i += 1
                j += 1
        return i == n and j == m
```
