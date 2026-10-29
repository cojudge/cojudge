You are given the roots of two binary trees. Overlay them into one tree by the following rule applied at every overlapping position:

- When both nodes exist, the new value is their sum.
- When only one side exists, that whole subtree is kept unchanged.
- When neither exists, nothing is placed.

Recurse the same way on left children and on right children, then return the root of the combined tree.

**Constraints:**
- Each tree holds between 0 and 2000 nodes.
- Values stay within a small integer range; sums fit in a 32-bit signed integer.
