Process a stream of point operations and report how many axis-aligned squares can be formed for each query.

An `add` operation stores one copy of its point. Duplicate points are allowed and are counted as distinct choices. For a `count` operation at `[x, y]`, count all ways to choose three stored points that, together with the query point, form an axis-aligned square with positive side length.

**Portable function adaptation:** Implement `runDetectSquares(operations, points)`. The arrays are aligned by index. The first operation is always `"DetectSquares"` with the ignored placeholder point `[0,0]`. Every later operation is `"add"` or `"count"`, with its point in the same row of `points`. Return an integer array containing one value for each `count` operation, in order. Do not return entries for the constructor or `add` operations, and do not implement a separate design-problem class.

**Constraints:**
- `operations.length == points.length`
- `1 <= operations.length <= 3001`
- `points[i]` contains exactly two integers in the range `0..1000`
- `operations[0] == "DetectSquares"` and `points[0] == [0,0]`
- Every later operation is `"add"` or `"count"`
- Each count result fits in a signed 32-bit integer
