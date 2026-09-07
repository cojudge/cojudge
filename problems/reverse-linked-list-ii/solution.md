## Approach

Use a dummy node so a reversal starting at position `1` needs no special case.
Advance `prev` to the node just before `left`, then repeatedly take `cur.next`
and move it to immediately after `prev`. After `right - left` moves the
segment `[left, right]` is reversed in place with `O(1)` extra pointers.

## Complexity Analysis

- **Time Complexity:** `O(n)`, one pass to reach `left` plus the segment length.
- **Space Complexity:** `O(1)` extra pointers (excluding the list itself).

## Implementation

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseBetween(self, head, left: int, right: int):
        dummy = ListNode(0, head)
        prev = dummy
        for _ in range(1, left):
            prev = prev.next
        cur = prev.next
        for _ in range(right - left):
            nxt = cur.next
            cur.next = nxt.next
            nxt.next = prev.next
            prev.next = nxt
        return dummy.next
```
