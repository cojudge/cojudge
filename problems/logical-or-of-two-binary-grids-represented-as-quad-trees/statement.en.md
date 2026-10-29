Two binary grids of equal size are each given as a quad tree. Combine them with a cell-wise logical OR and return the quad tree of the resulting grid.

Representation used here (matching the Construct Quad Tree problem): each tree is serialized as a breadth-first list of `[isLeaf, val]` pairs with `1/0` integers. Leaves carry the cell value and have no entries for children; every internal node is followed by its four children in topLeft, topRight, bottomLeft, bottomRight order. Internal nodes always store `val` 1 in outputs.

Merging follows two simplifications: OR-ing anything with a leaf `1` gives a leaf `1`, and OR-ing anything with a leaf `0` gives the other side unchanged. After merging children, an internal node whose four children are all leaves holding the same value collapses into a single leaf.

**Constraints:**
- Each input is a valid minimal quad-tree serialization with at most a few hundred nodes.
- Both trees describe the same grid size (a power-of-two square).
