## Approach

Traverse with one pointer, always comparing the current node to its successor. Equal values mean the next node is a duplicate and gets bypassed; different values mean the run ended and the pointer moves on. The head never changes since its first copy survives.

## Complexity Analysis

- **Time Complexity:** O(n), a single linear walk.
- **Space Complexity:** O(1), only pointer updates.

## Implementation

```python
class Solution:
    def deleteDuplicates(self, head):
        cur = head
        while cur and cur.next:
            if cur.val == cur.next.val:
                cur.next = cur.next.next
            else:
                cur = cur.next
        return head
```
