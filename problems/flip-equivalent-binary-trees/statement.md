Test whether two binary trees can be made identical by swapping child pairs.

One flip picks any node and exchanges its left and right subtrees. Applying flips anywhere, any number of times, reshapes a tree without changing its values.

Given the roots `root1` and `root2`, return `true` when the first tree can be turned into the second through flips, else `false`. An empty tree is written `[]`.

**Example 1:**
```
Input: root1 = [1,2,3,4,5,6,null,null,null,7,8], root2 = [1,3,2,null,6,4,5,null,null,null,null,8,7]
Output: true
Explanation: Flipping nodes 1, 3 and 5 of the first tree lines every node up with the second tree.
```

**Example 2:**
```
Input: root1 = [], root2 = []
Output: true
Explanation: Two empty trees already match.
```

**Example 3:**
```
Input: root1 = [], root2 = [1]
Output: false
Explanation: No flip can create a missing node.
```

**Constraints:**
- Each tree holds between 0 and 100 nodes.
- Node values lie in `0..99` and are unique within a tree.
