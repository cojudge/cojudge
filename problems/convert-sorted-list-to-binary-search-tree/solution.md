## Approach

Drain the linked list into an array to get random access to the sorted values. Then apply the classic middle-as-root construction: the center entry becomes the root, the left slice builds the left subtree, and the right slice builds the right subtree. Recursion depth stays logarithmic because each step halves the range.

## Complexity Analysis

- **Time Complexity:** O(n), one pass over the list plus one node creation per value.
- **Space Complexity:** O(n) for the value array plus O(log n) recursion depth.

## Implementation

```python
class Solution:
    def sortedListToBST(self, head):
        vals = []
        p = head
        while p:
            vals.append(p.val)
            p = p.next
        def build(l, r):
            if l > r:
                return None
            m = (l + r) // 2
            n = TreeNode(vals[m])
            n.left = build(l, m - 1)
            n.right = build(m + 1, r)
            return n
        return build(0, len(vals) - 1)
```
