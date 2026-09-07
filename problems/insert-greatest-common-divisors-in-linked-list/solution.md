## Approach

Walk the list with a pointer `cur`. While `cur` has a next node, create a new node whose value is `gcd(cur.val, cur.next.val)`, link it between `cur` and `cur.next`, then advance `cur` past the inserted node so each original adjacent pair is processed exactly once. A list with a single node is returned unchanged.

## Complexity Analysis

- **Time Complexity:** O(n), where `n` is the number of nodes, since each pair's gcd is computed once and each gcd is O(log(max value)).
- **Space Complexity:** O(1) besides the output nodes created.

## Implementation

```python
from typing import Optional
from math import gcd

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def insertGreatestCommonDivisors(self, head: Optional[ListNode]) -> Optional[ListNode]:
        cur = head
        while cur and cur.next:
            gcd_node = ListNode(gcd(cur.val, cur.next.val), cur.next)
            cur.next = gcd_node
            cur = gcd_node.next
        return head
```