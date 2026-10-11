## Approach

Send two pointers down the list together: a slow one advancing one node at a time and a fast one advancing two nodes at a time. Because the fast pointer covers ground twice as quickly, it reaches the end exactly when the slow pointer arrives at the middle. For even-length lists this landing spot is the second of the two central nodes, as required.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. The list is traversed once.
- **Space Complexity:** O(1); only two pointers are used.

## Implementation

```python
class Solution:
    def middleNode(self, head):
        slow = fast = head
        while fast is not None and fast.next is not None:
            slow = slow.next
            fast = fast.next.next
        return slow
```
