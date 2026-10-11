## Approach

Build a binary trie holding every number's bits from high to low. For each value, walk the trie preferring the child with the opposite bit at every level, accumulating the XOR obtained along that greedy path. The best over all starting values is the optimum, because any bit that can be set while staying consistent with some stored number should be set.

## Complexity Analysis

- **Time Complexity:** O(31 * n), where n is the length of `nums`. Each insert and each query touches a constant number of bit levels.
- **Space Complexity:** O(31 * n) for trie nodes in the worst case.

## Implementation

```python
class Solution:
    def findMaximumXOR(self, nums):
        root = {}
        for v in nums:
            cur = root
            for b in range(30, -1, -1):
                bit = (v >> b) & 1
                cur = cur.setdefault(bit, {})
        best = 0
        for v in nums:
            cur = root
            cur_xor = 0
            for b in range(30, -1, -1):
                bit = (v >> b) & 1
                want = bit ^ 1
                if want in cur:
                    cur_xor |= (1 << b)
                    cur = cur[want]
                else:
                    cur = cur[bit]
            best = max(best, cur_xor)
        return best
```
