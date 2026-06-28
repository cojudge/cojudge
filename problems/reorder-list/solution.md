## Approach

Find the middle of the list, reverse the second half, then merge the two halves by alternating nodes.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import Optional
class Solution:
    def reorderList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head:
            return None
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        prev, cur = None, slow
        while cur:
            nxt = cur.next
            cur.next = prev
            prev = cur
            cur = nxt
        first, second = head, prev
        while second.next:
            tmp1, tmp2 = first.next, second.next
            first.next = second
            second.next = tmp1
            first, second = tmp1, tmp2
        return head
```
