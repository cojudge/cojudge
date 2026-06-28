## Approach

Group strings by a canonical key derived from sorting each string's characters. Anagrams produce identical sorted strings, so they map to the same group.

## Complexity Analysis

- **Time Complexity:** O(n * k log k), where n is the number of strings and k is the maximum string length.
- **Space Complexity:** O(n * k) to store the groups.

## Implementation

```python
from typing import List
from collections import defaultdict
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)
        for s in strs:
            key = ''.join(sorted(s))
            groups[key].append(s)
        return list(groups.values())
```
