## Approach

Use two pointers starting at opposite ends. Advance either pointer past non-letters, and swap whenever both point at letters. Each position is visited once, letters land in reverse order, and everything else is untouched.

## Complexity Analysis

- **Time Complexity:** O(n) for a string of length n.
- **Space Complexity:** O(n) for the mutable character array (O(1) besides the output).

## Implementation

```python
class Solution:
    def reverseOnlyLetters(self, s: str) -> str:
        def is_letter(c: str) -> bool:
            return ('a' <= c <= 'z') or ('A' <= c <= 'Z')
        a = list(s)
        i, j = 0, len(a) - 1
        while i < j:
            if not is_letter(a[i]):
                i += 1
            elif not is_letter(a[j]):
                j -= 1
            else:
                a[i], a[j] = a[j], a[i]
                i += 1
                j -= 1
        return "".join(a)
```
