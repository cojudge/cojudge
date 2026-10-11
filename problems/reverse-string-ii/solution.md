## Approach

Scan start positions 0, 2k, 4k and reverse the window of up to k characters beginning there with an in-place two-pointer swap. Characters outside those windows are never touched.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n) for the mutable character array.

## Implementation

```python
class Solution:
    def reverseStr(self, s: str, k: int) -> str:
        a = list(s)
        for start in range(0, len(a), 2 * k):
            i, j = start, min(start + k - 1, len(a) - 1)
            while i < j:
                a[i], a[j] = a[j], a[i]
                i += 1
                j -= 1
        return "".join(a)
```
