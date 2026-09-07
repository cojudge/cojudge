## Approach

Use two pointers starting at opposite ends of the string. Swap the characters at the two pointers and move them toward the center until they meet. This reverses the string in a single pass.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the string. Each character is visited once.
- **Space Complexity:** O(n) for the returned string (O(1) extra if reversing a mutable character array in place).

## Implementation

```python
class Solution:
    def reverseString(self, s: str) -> str:
        a = list(s)
        i, j = 0, len(a) - 1
        while i < j:
            a[i], a[j] = a[j], a[i]
            i += 1
            j -= 1
        return "".join(a)
```
