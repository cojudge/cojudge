## Approach

Parse every folder line into its directory plus file tokens. For each token, cut at the opening parenthesis to separate the file name from the stored text (dropping the final closing parenthesis), then join directory and name into a full path. File the path in a hash bucket keyed by the stored text. After all lines are scanned, emit only buckets with two or more entries, since singletons have no duplicate partner.

## Complexity Analysis

- **Time Complexity:** O(S), where S is the total character count across all descriptions. Each character is scanned once.
- **Space Complexity:** O(S) for the buckets holding every full path.

## Implementation

```python
from typing import List
class Solution:
    def findDuplicate(self, paths: List[str]) -> List[List[str]]:
        groups = {}
        for entry in paths:
            parts = entry.split(" ")
            d = parts[0]
            for token in parts[1:]:
                lp = token.index("(")
                name = token[:lp]
                content = token[lp + 1:-1]
                groups.setdefault(content, []).append(d + "/" + name)
        return [g for g in groups.values() if len(g) >= 2]
```
