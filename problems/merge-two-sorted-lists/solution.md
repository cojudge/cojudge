## Approach
Use a dummy head to simplify pointer manipulation. Compare the heads of both lists, attach the smaller node to the result, and advance the corresponding pointer. Once one list is exhausted, attach the remainder of the other list.

## Complexity Analysis
- **Time Complexity:** O(n + m)
- **Space Complexity:** O(1)

## Implementation
```python
from typing import Optional
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        cur = dummy
        while list1 and list2:
            if list1.val <= list2.val:
                cur.next = list1
                list1 = list1.next
            else:
                cur.next = list2
                list2 = list2.next
            cur = cur.next
        cur.next = list1 or list2
        return dummy.next
```
