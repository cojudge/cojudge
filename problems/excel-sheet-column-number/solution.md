## Approach

Read the label left to right like a base-26 number with digits 1 through 26. Start at zero; for each letter, multiply the running total by 26 and add the letter value (A as 1 through Z as 26).

## Complexity Analysis

- **Time Complexity:** O(n), where n is the label length.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def titleToNumber(self, columnTitle: str) -> int:
        res = 0
        for c in columnTitle:
            res = res * 26 + (ord(c) - ord("A") + 1)
        return res
```
