## Approach

Count characters; more than one odd count means no palindrome exists. Otherwise split the counts into a middle character and half the pairs. Every distinct permutation of the half mirrors into a full palindrome, generated with duplicate-skipping backtracking so repeated letters produce each result once.

## Complexity Analysis

- **Time Complexity:** O(m * p), where p is the number of distinct palindromes and m is half the string length.
- **Space Complexity:** O(m) recursion depth plus the output.

## Implementation

```python
from typing import List
from collections import Counter

class Solution:
    def generatePalindromes(self, s: str) -> List[str]:
        freq = Counter(s)
        mid = ""
        half: List[str] = []
        for c in sorted(freq):
            cnt = freq[c]
            if cnt % 2 == 1:
                if mid:
                    return []
                mid = c
            half.extend([c] * (cnt // 2))
        res: List[str] = []
        used = [False] * len(half)
        def permute(cur: List[str]) -> None:
            if len(cur) == len(half):
                h = "".join(cur)
                res.append(h + mid + h[::-1])
                return
            for i in range(len(half)):
                if used[i]:
                    continue
                if i > 0 and half[i] == half[i - 1] and not used[i - 1]:
                    continue
                used[i] = True
                cur.append(half[i])
                permute(cur)
                cur.pop()
                used[i] = False
        permute([])
        return res
```
