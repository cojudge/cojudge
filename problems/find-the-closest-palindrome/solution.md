## Approach

Build a small candidate set: mirror the leading half for the prefixes `p-1`, `p`, and `p+1`, and add the two length-change neighbors `10^len + 1` and `10^(len-1) - 1`. Mirroring copies the first `len // 2` characters of the prefix string in reverse, which naturally handles prefixes that grew or shrank. Remove the input itself, then choose the candidate with the smallest absolute gap, breaking ties toward the smaller value.

## Complexity Analysis

- **Time Complexity:** O(len), proportional to the digit count (at most 18).
- **Space Complexity:** O(len) for the candidate strings.

## Implementation

```python
class Solution:
    def nearestPalindromic(self, n: str) -> str:
        ln = len(n)
        self_val = int(n)
        cands = set()
        cands.add(10 ** ln + 1)
        cands.add(10 ** (ln - 1) - 1 if ln > 1 else 0)
        half = (ln + 1) // 2
        prefix = int(n[:half])
        for p in (prefix - 1, prefix, prefix + 1):
            if p < 0:
                continue
            s = str(p)
            cands.add(int(s + s[:ln // 2][::-1]))
        cands.discard(self_val)
        return str(min(cands, key=lambda c: (abs(c - self_val), c)))
```
