## Approach

Parse each log into its numeric count and domain string. Split the domain on dots and rebuild every suffix from right to left, adding the count to a dictionary entry for that suffix. Finally emit one `"count domain"` string per dictionary key. Output order does not matter because the judge sorts before comparing.

## Complexity Analysis

- **Time Complexity:** O(total characters across all domains).
- **Space Complexity:** O(total distinct suffixes).

## Implementation

```python
from typing import List
class Solution:
    def subdomainVisits(self, cpdomains: List[str]) -> List[str]:
        totals = {}
        for entry in cpdomains:
            cnt_s, dom = entry.split(" ", 1)
            cnt = int(cnt_s)
            labels = dom.split(".")
            for i in range(len(labels)):
                suffix = ".".join(labels[i:])
                totals[suffix] = totals.get(suffix, 0) + cnt
        return [f"{v} {k}" for k, v in totals.items()]
```
