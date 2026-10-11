## Approach

Record which digits occur in the input. Convert the time to minutes, then advance one minute at a time with wrap-around, formatting each candidate and accepting the first whose four digits all belong to the recorded set.

## Complexity Analysis

- **Time Complexity:** O(24*60) steps with constant work each.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def nextClosestTime(self, time: str) -> str:
        allowed = {c for c in time if c != ":"}
        cur = int(time[:2]) * 60 + int(time[3:])
        for d in range(1, 24 * 60 + 1):
            nxt = (cur + d) % (24 * 60)
            cand = f"{nxt // 60:02d}:{nxt % 60:02d}"
            if all(c in allowed or c == ":" for c in cand):
                return cand
        return time
```
