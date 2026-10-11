You stack colored blocks into a centered pyramid. The bottom row is the string `bottom`, and every row above holds one fewer block than the row below it.

A block resting on two neighbors is allowed only when the triple (left base, right base, top) appears in the list `allowed`. Each entry of `allowed` is a three-letter string where the first two letters are the base pair and the third is the block they support. Order matters: `ABC` differs from `BAC`.

Decide whether the bottom row can grow all the way to a single top block using only allowed triples.

Adaptation for this judge: the original input gives `allowed` as a list of strings; here it arrives as a string array with the same contents.

**Constraints:**
- `2 <= bottom.length <= 6`
- `0 <= allowed.length <= 216`
- Each entry of `allowed` has length 3.
- All letters come from `A` through `F`.
- All entries of `allowed` are distinct.
