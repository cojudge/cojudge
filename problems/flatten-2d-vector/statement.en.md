This is an offline adaptation of a design task. Instead of writing a class, you write one function that replays a whole session:

```
runVector2D(vec, operations)
```

`vec` is a 2D integer array such as `[[1,2],[3],[4]]`, and `operations` holds only `"next"` or `"hasNext"`, in the order they are called. The flattened view visits every integer row by row from left to right, skipping empty rows:

- `"next"` returns the next integer in flattened order and moves forward.
- `"hasNext"` returns `1` when integers remain and `0` otherwise.

Return the answers for every operation in order, encoding `"hasNext"` as `1` or `0`.

**Constraints:**
- `0 <= vec.length <= 100`
- `0 <= vec[i].length <= 100`
- `-10^4 <= vec[i][j] <= 10^4`
- `1 <= operations.length <= 10^4`
- Each operation is `"next"` or `"hasNext"`.
- `"next"` is only called when `"hasNext"` would be true.
