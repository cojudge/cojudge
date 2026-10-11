## Approach

Rebuild the ring from the linear encoding and walk it once from the given head. A new value belongs between two neighbours when it lies inside their interval, or at the single high-to-low turnover when it extends beyond the current span. Falling through the whole loop (possible only with uniform values) inserts right after the head. The resulting ring is then unwrapped into a linear chain that starts at the original head, preserving the required representation.

## Complexity Analysis

- **Time Complexity:** O(n) for one ring traversal.
- **Space Complexity:** O(n) for the rebuilt chain.

## Implementation

```python
class Solution:
    def insert(self, head, insertVal: int):
        vals = []
        p = head
        while p:
            vals.append(p.val)
            p = p.next
        if not vals:
            return ListNode(insertVal)
        n = len(vals)
        idx = None
        for i in range(n):
            cur = vals[i]
            nxt = vals[(i + 1) % n]
            if cur <= insertVal <= nxt:
                idx = i + 1
                break
            if cur > nxt and (insertVal >= cur or insertVal <= nxt):
                idx = i + 1
                break
        if idx is None:
            idx = 1
        new_vals = vals[:idx] + [insertVal] + vals[idx:]
        dummy = ListNode(0)
        cur = dummy
        for v in new_vals:
            cur.next = ListNode(v)
            cur = cur.next
        return dummy.next
```
