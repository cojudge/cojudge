## Approach

Place a dummy node before the list. For each group, first locate its kth node; if fewer than `k` nodes remain, return. Otherwise reverse links up to the saved next-group node, reconnect both ends, and continue from the old group start.

## Complexity Analysis

- **Time Complexity:** O(n), since every node is visited a constant number of times.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def reverseKGroup(self, head, k: int):
        dummy = ListNode(0, head)
        group_previous = dummy

        while True:
            kth = group_previous
            for _ in range(k):
                kth = kth.next
                if kth is None:
                    return dummy.next

            group_next = kth.next
            previous = group_next
            current = group_previous.next
            while current is not group_next:
                following = current.next
                current.next = previous
                previous = current
                current = following

            old_start = group_previous.next
            group_previous.next = kth
            group_previous = old_start
```
