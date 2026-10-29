Build a fixed-capacity double-ended queue that supports insertion and removal at both ends in constant time.

This task uses a portable function adaptation instead of a class. Implement:

```
runCircularDeque(operations, values)
```

The two arrays are parallel. `operations[i]` is one of `"MyCircularDeque"`, `"insertFront"`, `"insertLast"`, `"deleteFront"`, `"deleteLast"`, `"getFront"`, `"getRear"`, `"isEmpty"`, `"isFull"`, and `values[i]` carries that call's integer argument:

- `"MyCircularDeque"` with `k` creates a deque of capacity `k` and is always first.
- `"insertFront"` / `"insertLast"` with `v` insert `v` at that end; answer `1` on success, `0` when full.
- `"deleteFront"` / `"deleteLast"` with `0` remove that end; answer `1` on success, `0` when empty.
- `"getFront"` / `"getRear"` with `0` answer the end value, or `-1` when empty.
- `"isEmpty"` / `"isFull"` with `0` answer `1` for true and `0` for false.

Return one integer per operation after the constructor, in call order. There is intentionally no class wrapper.

**Constraints:**
- `1 <= operations.length == values.length <= 3000`
- The first operation is `"MyCircularDeque"` with `1 <= k <= 1000`.
- Inserted values satisfy `0 <= v <= 1000`; other calls carry `0`.
