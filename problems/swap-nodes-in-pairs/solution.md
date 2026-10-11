## Approach

Anchor a dummy node ahead of the head so every pair, including the first, has a predecessor to rewire. Repeatedly take the next two nodes `a` and `b`, splice them in as `prev -> b -> a`, reconnect `a` to the remainder, and step `prev` forward past the swapped pair. A leftover single node is simply never touched.

## Complexity Analysis

- **Time Complexity:** O(n), one pass over the list.
- **Space Complexity:** O(1) extra space besides a few pointers.

## Implementation

```python
class Solution:
    def swapPairs(self, head):
        dummy = ListNode(0, head)
        prev = dummy
        while prev.next and prev.next.next:
            a = prev.next
            b = a.next
            a.next = b.next
            b.next = a
            prev.next = b
            prev = a
        return dummy.next
```
