## Approach

Walk the text block by block: extend a pointer while the letter stays the same to measure each run length. A run of `1` contributes one character; a run of `c > 1` contributes one plus the number of decimal digits in `c`. Summing over runs yields the squeezed length.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`. Each character is visited once.
- **Space Complexity:** O(1) extra memory.

## Implementation

```python
class Solution:
    def compress(self, s: str) -> int:
        n = len(s)
        total = 0
        j = 0
        while j < n:
            k = j
            while k < n and s[k] == s[j]:
                k += 1
            c = k - j
            total += 1
            if c > 1:
                total += len(str(c))
            j = k
        return total
```
