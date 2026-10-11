## Approach

Split both versions on dots and walk the revisions pairwise, treating a missing revision as zero. Parse each piece as an integer so leading zeros vanish, then return the first non-equal comparison. When every pair matches, the versions are equal.

## Complexity Analysis

- **Time Complexity:** O(m + n), where m and n are the version string lengths.
- **Space Complexity:** O(m + n) for the split pieces.

## Implementation

```python
class Solution:
    def compareVersion(self, version1: str, version2: str) -> int:
        a = version1.split(".")
        b = version2.split(".")
        n = max(len(a), len(b))
        for i in range(n):
            x = int(a[i]) if i < len(a) else 0
            y = int(b[i]) if i < len(b) else 0
            if x < y:
                return -1
            if x > y:
                return 1
        return 0
```
