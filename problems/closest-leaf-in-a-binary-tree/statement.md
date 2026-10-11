You are given the root of a binary tree in which every node holds a distinct integer, plus a target value `k` that appears somewhere in the tree.

A leaf is a node with no children at all. You may travel along parent-child links in either direction, and the length of a route is the number of edges used.

Return the value stored in a leaf that is as close as possible to the node holding `k`. When several leaves tie for the shortest distance, any one of them is accepted.

**Example 1:**
```
Input: root = [1,3,2], k = 1
Output: 2
Explanation: The node holding 1 connects directly to leaves 3 and 2, both one edge away. Either answer counts; here 2 is shown.
```

**Example 2:**
```
Input: root = [1], k = 1
Output: 1
Explanation: The single node is itself a leaf, at distance zero.
```

**Example 3:**
```
Input: root = [1,2,3,4,null,null,null,5,null,6], k = 2
Output: 3
Explanation: From the node holding 2, the leaf holding 3 is one edge up and over, while the leaf holding 6 is several edges down the left chain. So 3 is nearer.
```

**Constraints:**
- `1 <= number of nodes <= 1000`
- `1 <= Node.val <= 1000`
- Every value in the tree is unique.
- Some node holds the value `k`.
