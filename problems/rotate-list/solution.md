## Approach

Measure the list length and close it into a ring by pointing the tail at the head. Reducing the shift with modulo gives the effective rotation; walking length minus that many steps from the head finds the new tail. Cutting the ring there yields the rotated list.

## Complexity Analysis

- **Time Complexity:** O(n), one pass to measure and one to find the split.
- **Space Complexity:** O(1), only pointer rewiring.

## Implementation

```python
class Solution:
    def rotateRight(self, head, k: int):
        if not head or not head.next or k == 0:
            return head
        length = 1
        tail = head
        while tail.next:
            tail = tail.next
            length += 1
        k %= length
        if k == 0:
            return head
        tail.next = head
        new_tail = head
        for _ in range(length - k - 1):
            new_tail = new_tail.next
        new_head = new_tail.next
        new_tail.next = None
        return new_head
```
