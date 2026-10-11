## Approach

Collect both lists into arrays and walk backwards from the tails while the values agree. The number of matching steps is the length of the shared ending; rebuilding that suffix gives the intersecting tail. If nothing matches, the answer is null. Comparing from the back directly yields the longest common ending without extra alignment work.

## Complexity Analysis

- **Time Complexity:** O(m + n), where m and n are the list lengths.
- **Space Complexity:** O(m + n) for the collected values and the rebuilt suffix.

## Implementation

```python
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def getIntersectionNode(self, headA, headB):
        a, b = [], []
        p = headA
        while p:
            a.append(p.val)
            p = p.next
        p = headB
        while p:
            b.append(p.val)
            p = p.next
        i, j = len(a) - 1, len(b) - 1
        match = 0
        while i >= 0 and j >= 0 and a[i] == b[j]:
            match += 1
            i -= 1
            j -= 1
        if match == 0:
            return None
        dummy = ListNode(0)
        cur = dummy
        for v in a[len(a) - match:]:
            cur.next = ListNode(v)
            cur = cur.next
        return dummy.next
```
