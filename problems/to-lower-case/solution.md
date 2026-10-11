## Approach

Scan the string once. Whenever a character lies between `A` and `Z`, shift it by 32 positions to reach its lowercase partner; otherwise copy it unchanged. Building a fresh buffer keeps the input untouched.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`.
- **Space Complexity:** O(n) for the output string.

## Implementation

```python
class Solution:
    def toLowerCase(self, s: str) -> str:
        res = []
        for c in s:
            if 'A' <= c <= 'Z':
                res.append(chr(ord(c) + 32))
            else:
                res.append(c)
        return ''.join(res)
```
