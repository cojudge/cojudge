## Approach

Floyd's cycle detection (tortoise and hare) using two pointers moving at different speeds. If they meet, a cycle exists; if the fast pointer reaches the end, there is no cycle.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes.
- **Space Complexity:** O(1), using only two pointers.

## Implementation

```python
from typing import Optional
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                return True
        return False
```
