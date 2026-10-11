## Approach

Scan for the rightmost non-nine digit. When one exists, bump it by one and zero out its suffix; the prefix stays untouched. When every digit is nine, place a fresh leading one in front and turn the whole tail to zeros.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes, for the right-to-left carry pass.
- **Space Complexity:** O(1) extra besides the possible new head node (O(n) with a recursive carry).

## Implementation

```python
class Solution:
    def plusOne(self, head):
        carry = self._add(head)
        if carry:
            n = ListNode(1)
            n.next = head
            return n
        return head

    def _add(self, node):
        if node is None:
            return 1
        c = self._add(node.next)
        s = node.val + c
        node.val = s % 10
        return s // 10
```
