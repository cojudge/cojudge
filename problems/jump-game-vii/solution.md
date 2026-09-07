## Approach

Use a boolean `reachable` array where `reachable[j]` is true when index `j` can be reached. Index `j` is reachable if `s[j] == '0'` and at least one reachable index lies in the window `[j - maxJump, j - minJump]`. Instead of scanning that window for every index, maintain a running count of reachable indices inside it, sliding it one position at a time — O(n) overall.

## Complexity Analysis

- **Time Complexity:** O(n), where `n` is `s.length`.
- **Space Complexity:** O(n) for the reachability array.

## Implementation

```python
class Solution:
    def canReach(self, s: str, minJump: int, maxJump: int) -> bool:
        n = len(s)
        if s[0] == "1":
            return False
        reachable = [False] * n
        reachable[0] = True
        window = 0
        for i in range(1, n):
            if i - minJump >= 0 and reachable[i - minJump]:
                window += 1
            if i - maxJump - 1 >= 0 and reachable[i - maxJump - 1]:
                window -= 1
            if s[i] == "0" and window > 0:
                reachable[i] = True
        return reachable[n - 1]
```