## Approach

Use the first string as the initial prefix. For each remaining string, shrink the prefix from the end until the string starts with it. If the prefix becomes empty, no common prefix exists. This compares characters column by column and stops early on mismatch.

## Complexity Analysis

- **Time Complexity:** O(S), where S is the total number of characters across all strings. Each character comparison is done at most once per string.
- **Space Complexity:** O(1) extra (excluding the returned prefix, which is a substring of the first string).

## Implementation

```python
from typing import List
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        if not strs:
            return ""
        prefix = strs[0]
        for s in strs[1:]:
            while not s.startswith(prefix):
                prefix = prefix[:-1]
                if not prefix:
                    return ""
        return prefix
```
