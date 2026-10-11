## Approach

Sort the tokens. Repeatedly play the cheapest affordable token face-up for a point; when nothing is affordable, trade one point for the most expensive remaining token's power. Because cheap wins cost the least and rich trades refuel the most, this two-pointer routine reaches every worthwhile state. The peak score met along the way is the answer.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting, then linear play.
- **Space Complexity:** O(n) for the sorted copy.

## Implementation

```python
from typing import List
class Solution:
    def bagOfTokensScore(self, tokens: List[int], power: int) -> int:
        t = sorted(tokens)
        l, r = 0, len(t) - 1
        score = best = 0
        while l <= r:
            if power >= t[l]:
                power -= t[l]
                l += 1
                score += 1
                best = max(best, score)
            elif score > 0:
                power += t[r]
                r -= 1
                score -= 1
            else:
                break
        return best
```
