You are given the roots of two binary trees. Overlay them into one tree by the following rule applied at every overlapping position:

- When both nodes exist, the new value is their sum.
- When only one side exists, that whole subtree is kept unchanged.
- When neither exists, nothing is placed.

Recurse the same way on left children and on right children, then return the root of the combined tree.

**Example 1:**
```
Input: root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]
Output: [3,4,5,5,4,null,7]
Explanation: 1+2=3 at the root; left 3+1=4 with children 5 and 4; right 2+3=5 with child 7.
```

**Example 2:**
```
Input: root1 = [1], root2 = [1,2]
Output: [2,2]
```

**Example 3:**
```
Input: root1 = [], root2 = []
Output: []
```

**Constraints:**
- Each tree holds between 0 and 2000 nodes.
- Values stay within a small integer range; sums fit in a 32-bit signed integer.
