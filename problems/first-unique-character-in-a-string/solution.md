## Approach

Count occurrences of each letter in a first pass over the string, then walk the string a second time and return the first index whose letter has count one. If the second walk finishes without a hit, no letter is unique. Two linear scans with a 26-slot table keep the work proportional to the string length.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`.
- **Space Complexity:** O(1), a fixed 26-entry frequency table.

## Implementation

```python
class Solution:
    def firstUniqChar(self, s: str) -> int:
        cnt = [0] * 26
        for c in s:
            cnt[ord(c) - ord('a')] += 1
        for i, c in enumerate(s):
            if cnt[ord(c) - ord('a')] == 1:
                return i
        return -1
```
