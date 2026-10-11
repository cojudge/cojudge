A binary tree is univalued when every node in it stores the same value. Given the level-order serialization `root`, return whether the described tree is univalued. An empty tree counts as univalued.

**Example 1:**
```
Input: root = [1,1,1,1,1,null,1]
Output: true
Explanation: Every node present in the tree carries the value 1.
```

**Example 2:**
```
Input: root = [1,1,1,1,1,null,2]
Output: false
Explanation: The rightmost leaf holds a 2 while the rest hold 1, so the tree is not univalued.
```

**Example 3:**
```
Input: root = [1]
Output: true
Explanation: A single node is trivially uniform.
```

**Constraints:**
- The tree holds between 0 and 100 nodes.
- Node values are integers fitting in a 32-bit signed range.
