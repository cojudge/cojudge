## Approach

Identical strings share every subsequence, so nothing is uncommon and the answer is `-1`. When the strings differ, the longer one in full cannot fit inside the shorter one as a subsequence, making its whole length achievable; equal-length but differing strings likewise admit the full length from either side. Hence the answer is the larger of the two lengths.

## Complexity Analysis

- **Time Complexity:** O(min(len(a), len(b))) to test string equality.
- **Space Complexity:** O(1) extra memory.

## Implementation

```python
class Solution:
    def findLUSlength(self, a: str, b: str) -> int:
        if a == b:
            return -1
        return max(len(a), len(b))
```
