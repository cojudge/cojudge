## Approach

Split the list into a before-chain and an after-chain with two dummy heads, appending each visited node to whichever tail matches the threshold. Close the after-chain, then splice it after the before-chain so both groups keep their original order.

## Complexity Analysis

- **Time Complexity:** O(n), one pass over the list.
- **Space Complexity:** O(1), only dummy nodes and rewired links.

## Implementation

```python
class Solution:
    def partition(self, head, x: int):
        before_head = ListNode(0)
        after_head = ListNode(0)
        before, after = before_head, after_head
        cur = head
        while cur:
            nxt = cur.next
            cur.next = None
            if cur.val < x:
                before.next = cur
                before = before.next
            else:
                after.next = cur
                after = after.next
            cur = nxt
        before.next = after_head.next
        return before_head.next
```
