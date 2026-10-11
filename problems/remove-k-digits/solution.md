## Approach

Grow a monotonic stack of kept digits: while the last kept digit exceeds the incoming digit and deletions remain, pop it — removing a larger earlier digit always improves the outcome. Append the current digit, and after the scan drop any leftover deletions from the right. Finally strip leading zeros, returning `"0"` when nothing significant remains.

## Complexity Analysis

- **Time Complexity:** O(n), each digit pushed and popped at most once.
- **Space Complexity:** O(n) for the stack.

## Implementation

```python
class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        st = []
        for c in num:
            while st and k > 0 and st[-1] > c:
                st.pop()
                k -= 1
            st.append(c)
        while k > 0 and st:
            st.pop()
            k -= 1
        res = ''.join(st).lstrip('0')
        return res if res else '0'
```
