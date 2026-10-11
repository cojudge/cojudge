Two entries of a binary search tree have had their values exchanged by accident. Restore the tree so it satisfies the search-tree ordering again, without altering its shape.

In a valid search tree, every node's left descendants hold smaller values and right descendants hold larger values. Equivalently, an inorder walk visits values in strictly ascending order. Exactly two nodes violate this order; find them and swap their values back.

Return the root of the repaired tree.

**Example 1:**
```
Input: root = [1,3,null,null,2]
Output: [3,1,null,null,2]
Explanation: Nodes holding 1 and 3 were exchanged. Swapping them back fixes the ordering.
```

**Example 2:**
```
Input: root = [3,1,4,null,null,2]
Output: [2,1,4,null,null,3]
Explanation: Nodes holding 3 and 2 were exchanged. Swapping them back fixes the ordering.
```

**Constraints:**
- `2 <= number of nodes <= 1000`
- `-2^31 <= Node.val <= 2^31 - 1`
- The input tree is guaranteed to become a valid search tree after swapping exactly two node values.

**Adaptation note:** The classic formulation modifies the tree in place with no return value. This version returns the repaired `TreeNode` root so outputs can be serialized and checked.
