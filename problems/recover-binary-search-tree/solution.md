## Approach

Collect the inorder sequence, which should be sorted in a correct search tree. Comparing it against its sorted copy exposes exactly the two swapped values (the mismatched positions). A second inorder walk exchanges those two values wherever they occur, restoring order without touching the shape.

## Complexity Analysis

- **Time Complexity:** O(n log n) with sorting, or O(n) with a direct violation scan.
- **Space Complexity:** O(n) for the collected values.

## Implementation

```python
class Solution:
    def recoverTree(self, root):
        vals = []
        def collect(n):
            if not n:
                return
            collect(n.left)
            vals.append(n.val)
            collect(n.right)
        collect(root)
        s = sorted(vals)
        x = y = None
        for v, w in zip(vals, s):
            if v != w:
                if x is None:
                    x = v
                else:
                    y = v
                    break
        # adjacent swap still yields exactly two mismatches, so x,y suffice
        def fix(n):
            if not n:
                return
            fix(n.left)
            if n.val == x:
                n.val = y
            elif n.val == y:
                n.val = x
            fix(n.right)
        fix(root)
        return root
```
