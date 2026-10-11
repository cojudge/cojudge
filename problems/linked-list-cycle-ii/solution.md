## Approach

Use Floyd's two-pointer race: a slow pointer moves one node per step while a fast pointer moves two. If they ever coincide, a cycle exists. To locate its start, place one pointer back at the head and advance both singly; their next meeting is the entry node, whose index is counted from the head.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each pointer traverses at most a few passes.
- **Space Complexity:** O(1), using two pointers.

## Implementation

```python
class Solution:
    def detectCycle(self, head) -> int:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                break
        else:
            return -1
        entry = head
        while entry is not slow:
            entry = entry.next
            slow = slow.next
        # count index of entry from head
        cur = head
        pos = 0
        while cur is not entry:
            cur = cur.next
            pos += 1
        return pos
```
