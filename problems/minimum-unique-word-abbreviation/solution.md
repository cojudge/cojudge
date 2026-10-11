## Approach

Every abbreviation pattern corresponds to a bitmask choosing which positions to hide. Building the shorthand for each mask and testing it against same-length dictionary words (via the standard abbreviation matcher that rejects leading zeros) reveals all unique candidates. The shortest such candidate — breaking ties lexicographically for determinism — is the answer.

## Complexity Analysis

- **Time Complexity:** O(2^n * (n + d)), where n is the target length and d the filtered dictionary size.
- **Space Complexity:** O(n + d).

## Implementation

```python
from typing import List

class Solution:
    def minAbbreviation(self, target: str, dictionary: List[str]) -> str:
        n = len(target)
        filt = [w for w in dictionary if len(w) == n]
        if not filt:
            return str(n)

        def to_abbr(mask: int) -> str:
            out = []
            cnt = 0
            for i, ch in enumerate(target):
                if (mask >> i) & 1:
                    cnt += 1
                else:
                    if cnt:
                        out.append(str(cnt))
                        cnt = 0
                    out.append(ch)
            if cnt:
                out.append(str(cnt))
            return "".join(out)

        def matches(abbr: str, word: str) -> bool:
            i = j = 0
            while j < len(abbr):
                c = abbr[j]
                if c.isdigit():
                    if c == "0":
                        return False
                    num = 0
                    while j < len(abbr) and abbr[j].isdigit():
                        num = num * 10 + int(abbr[j])
                        j += 1
                    i += num
                    if i > len(word):
                        return False
                else:
                    if i >= len(word) or word[i] != c:
                        return False
                    i += 1
                    j += 1
            return i == len(word) and j == len(abbr)

        best = target
        for mask in range(1 << n):
            ab = to_abbr(mask)
            if len(ab) >= len(best):
                continue
            if any(matches(ab, w) for w in filt):
                continue
            if len(ab) < len(best) or (len(ab) == len(best) and ab < best):
                best = ab
        return best
```
