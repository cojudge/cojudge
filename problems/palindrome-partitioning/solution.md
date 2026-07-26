## Approach

Precompute whether every substring is a palindrome with dynamic programming. Then backtrack from the beginning of the string, choosing only end positions whose substring is marked as a palindrome. Reaching the end means the current choices form one complete partition.

## Complexity Analysis

- **Time Complexity:** O(n^2 + n * P), where `P` is the number of valid partitions; the second term accounts for constructing the output.
- **Space Complexity:** O(n^2 + n) auxiliary space for the palindrome table and recursion path, excluding the O(n * P) output.

## Implementation

```python
from typing import List


class Solution:
    def partition(self, s: str) -> List[List[str]]:
        n = len(s)
        palindrome = [[False] * n for _ in range(n)]
        for left in range(n - 1, -1, -1):
            for right in range(left, n):
                palindrome[left][right] = (
                    s[left] == s[right]
                    and (right - left < 2 or palindrome[left + 1][right - 1])
                )

        result: List[List[str]] = []
        current: List[str] = []

        def backtrack(start: int) -> None:
            if start == n:
                result.append(current.copy())
                return
            for end in range(start, n):
                if not palindrome[start][end]:
                    continue
                current.append(s[start : end + 1])
                backtrack(end + 1)
                current.pop()

        backtrack(0)
        return result
```
