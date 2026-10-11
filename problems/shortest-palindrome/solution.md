## Approach

Everything except the longest palindromic prefix must be mirrored in front. That prefix length is the longest prefix of `s` matching a suffix of the reversed string, which is exactly what the KMP prefix function of `s + "#" + reverse(s)` computes. Prepending the mirror of the remaining suffix then yields the shortest possible palindrome.

## Complexity Analysis

- **Time Complexity:** O(n), dominated by the prefix-function scan.
- **Space Complexity:** O(n) for the combined string and table.

## Implementation

```python
class Solution:
    def shortestPalindrome(self, s: str) -> str:
        rev = s[::-1]
        combo = s + "#" + rev
        pi = [0] * len(combo)
        for i in range(1, len(combo)):
            j = pi[i - 1]
            while j > 0 and combo[i] != combo[j]:
                j = pi[j - 1]
            if combo[i] == combo[j]:
                j += 1
            pi[i] = j
        keep = pi[-1]
        return rev[:len(s) - keep] + s
```
