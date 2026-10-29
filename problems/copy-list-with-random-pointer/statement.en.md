You are given a linked list in a portable serialized form. Each row of `nodes` is
`[value, randomIndex]` for one node:

- Node `i` has value `value`.
- Its `next` pointer targets node `i + 1`, or `null` for the final node.
- Its `random` pointer targets node `randomIndex`, or is `null` when
  `randomIndex` is `-1`.

Return the same structural encoding for a **deep copy** of the list. Conceptually,
every returned node must be newly allocated, and both `next` and `random` pointers
must refer only to copied nodes.

This `int[][]` interface is a portable serialization adaptation of the usual
node-based random-pointer-list API. Because object identity cannot be represented
in the returned JSON value, the judge compares the copied list's serialized
structure.

**Constraints:**

- `0 <= nodes.length <= 1000`
- `nodes[i].length == 2`
- `-10^4 <= nodes[i][0] <= 10^4`
- `nodes[i][1] == -1` or `0 <= nodes[i][1] < nodes.length`
