You are given the head of a singly linked-list. The list can be represented as:

L0 → L1 → … → Ln - 1 → Ln

Reorder the list to be on the following form:

L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …

You may not modify the values in the list's nodes. Only nodes themselves may be changed.

Return the head of the reordered list.

**Constraints:**
- The number of nodes in the list is in the range `[0, 5 * 10^4]`.
- `1 <= Node.val <= 1000`
