You are given the root of a binary tree. List the values on its outer edge in counter-clockwise order, starting at the root.

The required order is: the root first (unless the tree is empty), then the left edge from top to bottom excluding any leaves, then all leaves from left to right, then the right edge from bottom to top excluding any leaves. No node appears twice; when the root itself is a leaf it is listed once.

The left edge follows left children when possible, otherwise right children, down to but not including the leftmost leaf. The right edge mirrors this on the right side.

Return the collected values as a list.

**Example 1:**
```
Input: root = [1,null,2,3,4]
Output: [1,3,4,2]
Explanation: Root 1, leaves 3 and 4 left to right, then right edge 2 upward.
```

**Example 2:**
```
Input: root = [1,2,3,4,5,6,null,null,null,7,8,9,10]
Output: [1,2,4,7,8,9,10,6,3]
Explanation: Left edge 1,2,4 plus leaves plus reversed right edge 10,6,3 deduplicated.
```

**Example 3:**
```
Input: root = [1]
Output: [1]
Explanation: A lone root is both root and leaf.
```

**Constraints:**
- `0 <= number of nodes <= 10^4`
- `-1000 <= Node.val <= 1000`
