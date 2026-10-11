## Approach

Count letters of `p` once, then slide a fixed-size window over `s` while maintaining its 26 counts. Adding the entering character and removing the leaving one keeps the update constant time; whenever the two count tables agree, the window's start index is recorded.

## Complexity Analysis

- **Time Complexity:** O(n + m), where n is the length of `s` and m of `p`. Each character enters and leaves the window once.
- **Space Complexity:** O(1) for the two fixed alphabets plus output.

## Implementation

```python
class Solution:
    def findAnagrams(self, s: str, p: str):
        m, n = len(p), len(s)
        if m > n:
            return []
        from collections import Counter
        need = [0] * 26
        win = [0] * 26
        for c in p:
            need[ord(c) - 97] += 1
        ans = []
        for i, c in enumerate(s):
            win[ord(c) - 97] += 1
            if i >= m:
                win[ord(s[i - m]) - 97] -= 1
            if i >= m - 1 and win == need:
                ans.append(i - m + 1)
        return ans
```
