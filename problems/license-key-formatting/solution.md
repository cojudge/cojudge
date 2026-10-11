## Approach

Remove all dashes while uppercasing letters, leaving a plain alphanumeric run. If nothing remains, return empty. Otherwise walk that run from the end, emitting `k` characters at a time and inserting a dash between groups; building backwards guarantees every group except the first is full. Reverse the built buffer to obtain the final key.

## Complexity Analysis

- **Time Complexity:** O(n) where n is the length of `s`.
- **Space Complexity:** O(n) for the cleaned and output buffers.

## Implementation

```python
class Solution:
    def licenseKeyFormatting(self, s: str, k: int) -> str:
        clean = [c.upper() for c in s if c != "-"]
        if not clean:
            return ""
        parts = []
        count = 0
        for i in range(len(clean) - 1, -1, -1):
            parts.append(clean[i])
            count += 1
            if count == k and i != 0:
                parts.append("-")
                count = 0
        return "".join(reversed(parts))
```
