## Approach
Use a min-heap to store the head of each non-empty linked list. Repeatedly pop the smallest node, append it to the result, and push its next node back into the heap. Continue until the heap is empty.

## Complexity Analysis
- **Time Complexity:** O(n log k)
- **Space Complexity:** O(k)

## Implementation
```python
from typing import List, Optional
import heapq
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        heap = []
        for i, node in enumerate(lists):
            if node:
                heapq.heappush(heap, (node.val, i, node))
        dummy = ListNode(0)
        cur = dummy
        while heap:
            val, i, node = heapq.heappop(heap)
            cur.next = node
            cur = cur.next
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next
```
