In a binary tree, look at the deepest level that contains any node and pick the leftmost node sitting on that level. Return its value.

**Example 1:**
```
Input: root = [2,1,3]
Output: 1
Explanation: The deepest level holds 1 and 3; the leftmost of the two is 1.
```

**Example 2:**
```
Input: root = [1,2,3,4,null,5,6,null,null,7]
Output: 7
Explanation: Level by level the tree has [1], [2,3], [4,5,6], [7]; the bottom row's only entry is 7.
```

**Example 3:**
```
Input: root = [1]
Output: 1
Explanation: A single node is both the top and the bottom-left choice.
```

**Constraints:**
- The number of nodes is in the range `[1, 10^4]`
- `-2^31 <= Node.val <= 2^31 - 1`
