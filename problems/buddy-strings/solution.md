## Approach

Compare the two strings position by position. Different lengths can never work. When the strings are already equal, a swap is still required, so success needs a duplicated letter to exchange harmlessly. Otherwise collect mismatching indices: there must be exactly two, and the characters must cross-match so one swap fixes both.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the string length. Each position is examined once.
- **Space Complexity:** O(1) extra besides a small set for duplicate detection.

## Implementation

```python
class Solution:
    def buddyStrings(self, s: str, goal: str) -> bool:
        if len(s) != len(goal):
            return False
        if s == goal:
            return len(set(s)) < len(s)
        diffs = [i for i in range(len(s)) if s[i] != goal[i]]
        return len(diffs) == 2 and s[diffs[0]] == goal[diffs[1]] and s[diffs[1]] == goal[diffs[0]]
```
