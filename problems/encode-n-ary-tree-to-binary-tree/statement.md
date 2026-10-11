An N-ary tree and a binary tree can stand in for each other through the left-child right-sibling encoding: a node's first child becomes its left link, and each sibling becomes the previous sibling's right link. Your adapted task round-trips an N-ary tree through that binary form using only strings.

The N-ary tree arrives as a string `data` in breadth order with `null` separating sibling groups (for example `[1,null,3,2,4,null,5,6]`). Write `encodeDecode`, which parses that string into an N-ary tree, converts it to binary via the encoding above, converts back to N-ary, and returns the canonical N-ary string. Correct code returns the canonical form of its input.

**Constraints:**
- Node count lies in `[0, 10^4]`.
- Values are integers.

Adaptation: the source defines a `Codec` over N-ary `Node` and binary `TreeNode`; here both sides are modeled as `string` with the binary step hidden inside the reference. Document the left-child right-sibling rule in your reasoning.
