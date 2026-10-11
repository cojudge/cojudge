## Approach

Group dictionary words by abbreviation. For each query compute its abbreviation: if the group is missing, answer 1; if the group holds exactly the query word, answer 1; otherwise answer 0.

## Complexity Analysis

- **Time Complexity:** O(D * L + Q * L) for dictionary and query lengths.
- **Space Complexity:** O(D * L) for the map.

## Implementation

```python
from typing import List
class Solution:
    def checkAbbr(self, dictionary: List[str], words: List[str]) -> List[int]:
        def abbr(w: str) -> str:
            if len(w) <= 2:
                return w
            return f"{w[0]}{len(w) - 2}{w[-1]}"
        groups: dict[str, set[str]] = {}
        for w in dictionary:
            groups.setdefault(abbr(w), set()).add(w)
        ans = []
        for q in words:
            a = abbr(q)
            if a not in groups:
                ans.append(1)
            else:
                s = groups[a]
                ans.append(1 if len(s) == 1 and q in s else 0)
        return ans
```
