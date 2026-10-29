A binary tree is complete when every level except possibly the last is entirely filled, and all nodes of the last level sit as far left as possible. Equivalently, a level-order walk never meets a present node after the first missing slot.

Given the level-order serialization `root` of a binary tree, decide whether the tree is complete.

**Constraints:**
- The tree holds between 0 and 100 nodes.
- Node values are integers fitting in a 32-bit signed range.
