An N-ary tree and a binary tree can stand in for each other through the left-child right-sibling encoding: a node's first child becomes its left link, and each sibling becomes the previous sibling's right link.

Implement a `Codec` class with two methods that work on level-order text:

- `encode(naryData)` parses an N-ary tree from breadth-first text (`null` separates sibling groups, e.g. `[1,null,3,2,4,null,5,6]`) and returns the converted binary tree as level-order text with `null` placeholders for missing children and trailing nulls trimmed (e.g. `[1,3,null,5,2,null,6,null,4]`). An empty tree encodes to `[]`.
- `decode(binaryData)` parses that binary level-order text and returns the canonical N-ary breadth-first text (trailing empty groups dropped, `[]` for empty).

The judge creates one `Codec` per test case, encodes the input twice, decodes the first binary string, and checks that both encodes agree, the decoded text equals the canonical N-ary form, and the binary text parses to exactly the left-child right-sibling structure of the input. Inputs are already canonical; your binary text must still earn its structure — echoing the input fails the structural check.

**Constraints:**
- Node count lies in `[0, 10^4]`.
- Values are integers.
