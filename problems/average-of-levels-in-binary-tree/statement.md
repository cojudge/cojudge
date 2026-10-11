For every depth of a binary tree, compute the mean of the node values sitting on that depth. The root is depth 0, its children depth 1, and so on.

Because this judge only handles portable value types, averages travel as decimal strings: parse each output entry as a double. An answer is accepted when every level's parsed value sits within `1e-5` of the true mean (relative or absolute). Return the levels top-down.

**Example 1:**
```
Input: root = [3,9,20,null,null,15,7]
Output: ["3.0","14.5","11.0"]
Explanation: Level 0 holds [3]; level 1 holds [9,20] with mean 14.5; level 2 holds [15,7] with mean 11.0.
```

**Example 2:**
```
Input: root = [3,9,20,15,7]
Output: ["3.0","14.5","11.0"]
Explanation: Level 0 is [3]; level 1 is [9,20]; level 2 is [15,7].
```

**Example 3:**
```
Input: root = [1]
Output: ["1.0"]
```

**Constraints:**
- The tree has `1..10^4` nodes.
- `-10^5 <= Node.val <= 10^5`
- Outputs are finite decimal strings parseable as doubles.
