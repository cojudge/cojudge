You receive the head of a linked list and must return the head of its flattened form: the same values in the same order, with every node linked through `next`.

**Constraints:**
- Node count lies in `[0, 1000]`.
- `1 <= Node.val <= 10^5`.

Adaptation: the source uses a multilevel doubly node with `prev`, `next` and `child` links, which this judge cannot express (only singly `list_node` exists). Child and previous links are therefore omitted: input is a single-level chain modeled as `list_node`, and flattening preserves its order. Implement a faithful copy that keeps the value sequence.
