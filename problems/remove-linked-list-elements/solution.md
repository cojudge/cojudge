## Approach

Anchor a dummy node before the head so deletions at the front look like any other deletion. Sweep a cursor forward: whenever the next node carries `val`, bypass it, otherwise step past it. Bypassing without advancing handles runs of matching values, and the dummy's successor is the filtered head.

## Complexity Analysis

- **Time Complexity:** O(n), a single pass over the list.
- **Space Complexity:** O(1) besides the output linkage.

## Implementation

```python
class Solution:
    def removeElements(self, head, val):
        dummy = ListNode(0, head)
        cur = dummy
        while cur.next is not None:
            if cur.next.val == val:
                cur.next = cur.next.next
            else:
                cur = cur.next
        return dummy.next
```
