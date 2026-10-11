Turning a data structure into a bit stream so it can be saved to a file or buffer, or sent over a link and rebuilt later on the same or another machine, is called serialization.

Build a pair of routines for a **binary tree**: one that flattens a tree into a string, and one that rebuilds the starting tree shape from that string. You may pick any string layout you like, as long as a round trip restores the original tree.

**Note on the judge:** The harness reads and displays trees with the same level-order listing style that LeetCode uses. Your internal encoding does not have to copy that style — feel free to invent your own scheme.

**Constraints:**
- The number of nodes in the tree is in the range `[0, 10^4]`.
- `-1000 <= Node.val <= 1000`
