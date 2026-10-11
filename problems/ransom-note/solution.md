## Approach

Tally the magazine's letters into 26 counters. Then consume one counter per ransom-note letter; running below zero means the source is short, while surviving the whole scan means construction works.

## Complexity Analysis

- **Time Complexity:** O(n + m), where n and m are the two string lengths.
- **Space Complexity:** O(1) for the fixed alphabet table.

## Implementation

```python
class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        cnt = [0] * 26
        for c in magazine:
            cnt[ord(c) - 97] += 1
        for c in ransomNote:
            cnt[ord(c) - 97] -= 1
            if cnt[ord(c) - 97] < 0:
                return False
        return True
```
