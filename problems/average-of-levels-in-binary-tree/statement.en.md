For every depth of a binary tree, compute the mean of the node values sitting on that depth. The root is depth 0, its children depth 1, and so on.

Because this judge only handles portable value types, averages travel as decimal strings: parse each output entry as a double. An answer is accepted when every level's parsed value sits within `1e-5` of the true mean (relative or absolute). Return the levels top-down.

**Constraints:**
- The tree has `1..10^4` nodes.
- `-10^5 <= Node.val <= 10^5`
- Outputs are finite decimal strings parseable as doubles.
