In a binary tree, two nodes are cousins when they sit at the same depth but have
different parents. The root is at depth 0, its children at depth 1, and so on.
Each value in the tree appears exactly once.

Given the `root` of a binary tree and two distinct values `x` and `y`, return
`true` if the nodes holding `x` and `y` are cousins, and `false` otherwise.

**Example 1:**
```
Input: root = [1,2,3,4], x = 4, y = 3
Output: false
Explanation: Node 4 is at depth 2 while node 3 is at depth 1.
```

**Example 2:**
```
Input: root = [1,2,3,null,4,null,5], x = 5, y = 4
Output: true
Explanation: Both nodes are at depth 2 with different parents.
```

**Example 3:**
```
Input: root = [1,2,3,null,4], x = 2, y = 3
Output: false
Explanation: Same depth, but they share parent 1, so they are siblings.
```

**Constraints:**
- The number of nodes is between `2` and `100`.
- `1 <= Node.val <= 100`
- All node values are distinct.
- `x != y` and both values occur in the tree.
