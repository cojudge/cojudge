## Approach

Walk from the head until the node holding `val` is found. Because that node is never the tail, it has a successor whose value and link can be borrowed: overwrite the target's value with the successor's value and skip over the successor. The list keeps its order with one fewer node.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes, for the search walk.
- **Space Complexity:** O(1), only pointer updates.

## Implementation

```python
class Solution:
    def deleteNode(self, head, val: int):
        cur = head
        while cur and cur.val != val:
            cur = cur.next
        if cur and cur.next:
            cur.val = cur.next.val
            cur.next = cur.next.next
        return head
```
