You receive the head of a singly linked chain. Number its nodes from the front as:

L0 → L1 → … → Ln - 1 → Ln

Weave the chain into this alternating pattern:

L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …

The values held by the nodes must stay put; only the links between nodes may be rewired.

Hand back the head of the woven chain.

**Constraints:**
- The number of nodes in the list is in the range `[0, 5 * 10^4]`.
- `1 <= Node.val <= 1000`
