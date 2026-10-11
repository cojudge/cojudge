This is an offline adaptation of a design task. Instead of writing a class, you write one function that replays a whole session:

```
runVector2D(vec, operations)
```

`vec` is a 2D integer array such as `[[1,2],[3],[4]]`, and `operations` holds only `"next"` or `"hasNext"`, in the order they are called. The flattened view visits every integer row by row from left to right, skipping empty rows:

- `"next"` returns the next integer in flattened order and moves forward.
- `"hasNext"` returns `1` when integers remain and `0` otherwise.

Return the answers for every operation in order, encoding `"hasNext"` as `1` or `0`.

**Example 1:**
```
Input: vec = [[1,2],[3],[4]], operations = ["next","next","next","hasNext","hasNext","next","hasNext"]
Output: [1,2,3,1,1,4,0]
Explanation: Flattened order is [1,2,3,4]. The first three calls give 1, 2 and 3; two values are still left check as 1; the next call gives 4; nothing remains so the last check is 0.
```

**Example 2:**
```
Input: vec = [[],[1],[],[2,3]], operations = ["hasNext","next","next","next","hasNext"]
Output: [1,1,2,3,0]
Explanation: Empty rows contribute nothing, so flattened order is [1,2,3]. One value is present at first, then each call consumes one value.
```

**Example 3:**
```
Input: vec = [[],[]], operations = ["hasNext","hasNext"]
Output: [0,0]
Explanation: Both rows are empty, so no value ever becomes available.
```

**Constraints:**
- `0 <= vec.length <= 100`
- `0 <= vec[i].length <= 100`
- `-10^4 <= vec[i][j] <= 10^4`
- `1 <= operations.length <= 10^4`
- Each operation is `"next"` or `"hasNext"`.
- `"next"` is only called when `"hasNext"` would be true.
