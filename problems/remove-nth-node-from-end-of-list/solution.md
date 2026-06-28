## Approach

Use a dummy node and two pointers. Move the fast pointer n+1 steps ahead, then advance both until fast reaches the end. The slow pointer is now just before the node to remove.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import Optional
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        fast = slow = dummy
        for _ in range(n + 1):
            fast = fast.next
        while fast:
            slow = slow.next
            fast = fast.next
        slow.next = slow.next.next
        return dummy.next
```
