You are given the root of a binary tree and an integer array `voyage` that lists node values in some desired preorder order.

A flip operation swaps the left and right child of a chosen node. Performing any number of flips (each node flipped at most once conceptually) changes the preorder visit order of the tree.

Return the values of the flipped nodes in the order they are flipped. When several answers exist the preorder walk described below yields the canonical one. When the voyage cannot be achieved, return `[-1]`. When no flip is needed, return an empty list.

To determine the flips, traverse the tree in preorder while reading `voyage` from left to right with a single position pointer:

- Each visited node must equal the current voyage entry; otherwise the task is impossible.
- If the node has a left child and that child does not equal the next voyage entry, flip the node (record its value) and traverse the right child before the left child.
- Otherwise traverse left before right as usual.

**Constraints:**
- `1 <= number of nodes <= 100`
- `1 <= node values, voyage[i] <= 100`
- `voyage.length == number of nodes`
- Values in the tree are unique.
