## Approach

Anchor a dummy node before the head and keep a predecessor pointer. Whenever the next two values agree, skip the whole run of that value without moving the predecessor; otherwise the next node is unique and the predecessor advances. The dummy handles deletions at the front uniformly.

## Complexity Analysis

- **Time Complexity:** O(n), each node visited a constant number of times.
- **Space Complexity:** O(1), only pointer rewiring.

## Implementation

```python
class Solution:
    def deleteDuplicates(self, head):
        dummy = ListNode(0, head)
        prev = dummy
        while prev.next and prev.next.next:
            if prev.next.val == prev.next.next.val:
                dup = prev.next.val
                while prev.next and prev.next.val == dup:
                    prev.next = prev.next.next
            else:
                prev = prev.next
        return dummy.next
```
