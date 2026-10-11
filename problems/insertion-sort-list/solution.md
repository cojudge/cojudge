## Approach

Maintain a dummy-headed sorted prefix. Repeatedly detach the next input node and walk the prefix until the following value would exceed it, then splice the node there. Because the prefix stays sorted, each insertion lands in the correct spot.

## Complexity Analysis

- **Time Complexity:** O(n^2) in the worst case, where n is the list length. Each insertion scans the sorted prefix.
- **Space Complexity:** O(1) extra, rewiring nodes in place.

## Implementation

```python
class Solution:
    def insertionSortList(self, head):
        dummy = ListNode(-1)
        cur = head
        while cur:
            nxt = cur.next
            p = dummy
            while p.next and p.next.val < cur.val:
                p = p.next
            cur.next = p.next
            p.next = cur
            cur = nxt
        return dummy.next
```
