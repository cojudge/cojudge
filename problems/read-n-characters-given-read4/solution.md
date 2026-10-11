## Approach

Simulating `read4` still amounts to taking a prefix: copy at most four characters per step until `n` characters are collected or the file is exhausted. The result is the first `min(n, length)` characters.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of characters returned.
- **Space Complexity:** O(n) for the output string.

## Implementation

```python
class Solution:
    def read(self, file: str, n: int) -> str:
        return file[:max(n, 0)]
```
