You are given the root of a binary tree in level-order form, an integer `target` identifying a node by its value, and an integer `k`. All node values in the tree are unique.

Treat the tree as an undirected graph where each parent-child link can be walked in either direction. The distance between two nodes is the number of edges on the shortest such walk.

Return the values of all nodes that sit exactly `k` edges away from the node holding `target`, sorted in ascending order.

Adaptation note: the original task passes a node reference and accepts any order; here the target is given by value (values are unique) and the answer is required sorted so every language can be checked deterministically.

**Example 1:**
```
Input: root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2
Output: [1,4,7]
Explanation: Nodes 7, 4 and 1 are each two steps from 5; sorted they are 1, 4, 7.
```

**Example 2:**
```
Input: root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 0
Output: [5]
Explanation: Distance zero means the target itself.
```

**Example 3:**
```
Input: root = [1], target = 1, k = 3
Output: []
Explanation: No node is three steps away in a single-node tree.
```

**Constraints:**
- The tree holds `1 <= n <= 500` nodes.
- `0 <= node.val <= 500`
- All values are unique.
- `0 <= k <= 1000`
- `target` appears exactly once in the tree.
