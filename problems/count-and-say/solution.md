## Approach

Start from `"1"` and iterate: each step walks the current term once, measures every maximal block of identical digits, and writes the block length followed by the digit. Repeating this transformation `n - 1` times produces exactly the nth term.

## Complexity Analysis

- **Time Complexity:** O(3^n) in the worst case, since term lengths grow by roughly 30% per step (the 30th term has 4462 characters).
- **Space Complexity:** O(L) for the current term of length L.

## Implementation

```python
class Solution:
    def countAndSay(self, n: int) -> str:
        cur = "1"
        for _ in range(1, n):
            nxt = []
            count = 1
            for j in range(1, len(cur) + 1):
                if j < len(cur) and cur[j] == cur[j - 1]:
                    count += 1
                else:
                    nxt.append(str(count) + cur[j - 1])
                    count = 1
            cur = "".join(nxt)
        return cur
```
