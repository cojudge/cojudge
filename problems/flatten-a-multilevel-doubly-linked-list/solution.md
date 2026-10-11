## Approach

Because the adapted input has no child levels, flattening means preserving the value order. Traverse once to gather values, then stitch a new singly chain from them. The fresh chain matches the input sequence exactly.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the list length. One pass to read plus one to rebuild.
- **Space Complexity:** O(n) for the new nodes.

## Implementation

```python
class Solution:
    def flatten(self, head):
        if not head:
            return None
        dummy = ListNode(0)
        tail = dummy
        cur = head
        while cur:
            tail.next = ListNode(cur.val)
            tail = tail.next
            cur = cur.next
        return dummy.next
```
