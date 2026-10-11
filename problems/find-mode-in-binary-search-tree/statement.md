You are given the root of a binary search tree that may hold duplicate keys. Its ordering rule allows equality on either side: left subtree keys are less than or equal to the node, right subtree keys are greater than or equal to the node.

A mode is a value occurring more often than any other value in the tree. Collect every mode and return them in any order.

**Example 1:**
```
Input: root = [1,null,2,2]
Output: [2]
Explanation: The value 2 appears twice while 1 appears once.
```

**Example 2:**
```
Input: root = [0]
Output: [0]
Explanation: A single node is trivially the most frequent.
```

**Constraints:**
- The tree holds between 1 and 10^4 nodes
- `-10^5 <= Node.val <= 10^5`
