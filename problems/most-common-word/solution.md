## Approach

Lowercase the paragraph and scan it, accumulating letter runs as words and treating anything else as a boundary. Look up each word in the banned set; survivors increment a frequency map that also remembers first-seen order for deterministic ties. A final pass picks the highest count (earliest on ties), which matches the unique-answer guarantee.

## Complexity Analysis

- **Time Complexity:** O(n + m) for paragraph length n and banned size m.
- **Space Complexity:** O(n) for the word counts in the worst case.

## Implementation

```python
from typing import List
class Solution:
    def mostCommonWord(self, paragraph: str, banned: List[str]) -> str:
        ban = set(w.lower() for w in banned)
        counts: dict[str, int] = {}
        cur: list[str] = []
        best, best_c = "", 0
        def flush():
            nonlocal best, best_c
            if cur:
                w = "".join(cur)
                del cur[:]
                if w not in ban:
                    counts[w] = counts.get(w, 0) + 1
                    if counts[w] > best_c:
                        best_c = counts[w]
                        best = w
        for ch in paragraph.lower() + " ":
            if 'a' <= ch <= 'z':
                cur.append(ch)
            else:
                flush()
        return best
```
