## Approach

Examine each character in lowercase form. Whenever it matches one of the five vowel letters, increment the counter.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def countVowels(self, s: str) -> int:
        count = 0
        for ch in s.lower():
            if ch in 'aeiou':
                count += 1
        return count
```
