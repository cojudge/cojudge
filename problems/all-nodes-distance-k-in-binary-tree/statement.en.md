You are given the root of a binary tree in level-order form, an integer `target` identifying a node by its value, and an integer `k`. All node values in the tree are unique.

Treat the tree as an undirected graph where each parent-child link can be walked in either direction. The distance between two nodes is the number of edges on the shortest such walk.

Return the values of all nodes that sit exactly `k` edges away from the node holding `target`, sorted in ascending order.

Adaptation note: the original task passes a node reference and accepts any order; here the target is given by value (values are unique) and the answer is required sorted so every language can be checked deterministically.

**Constraints:**
- The tree holds `1 <= n <= 500` nodes.
- `0 <= node.val <= 500`
- All values are unique.
- `0 <= k <= 1000`
- `target` appears exactly once in the tree.
