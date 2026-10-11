## Approach

Apply merge sort directly on the links. Find the midpoint with slow/fast pointers, sever the list, recursively sort both halves, and stitch them with a linear merge that always takes the smaller front node.

## Complexity Analysis

- **Time Complexity:** O(n log n), where n is the list length. Each level processes all nodes once.
- **Space Complexity:** O(log n) recursion stack for the top-down split (O(1) link space).

## Implementation

```python
class Solution:
    def sortList(self, head):
        if not head or not head.next:
            return head
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        mid = slow.next
        slow.next = None
        a = self.sortList(head)
        b = self.sortList(mid)
        return self._merge(a, b)

    def _merge(self, a, b):
        dummy = ListNode(0)
        p = dummy
        while a and b:
            if a.val <= b.val:
                p.next, a = a, a.next
            else:
                p.next, b = b, b.next
            p = p.next
        p.next = a or b
        return dummy.next
```
