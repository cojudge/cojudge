## Approach

Walk the list with two cursors: one chaining the odd-positioned nodes and one chaining the even-positioned nodes. Each step links each cursor to the node after its successor. Finally attach the even chain behind the odd chain's tail.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited once.
- **Space Complexity:** O(1) extra space; only pointers are rewired.

## Implementation

```python
from typing import Optional
class Solution:
    def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return head
        odd, even = head, head.next
        even_head = even
        while even and even.next:
            odd.next = even.next
            odd = odd.next
            even.next = odd.next
            even = even.next
        odd.next = even_head
        return head
```
