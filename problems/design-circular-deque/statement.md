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

**Example 1:**
```
Input: operations = ["MyCircularDeque","insertLast","insertLast","insertFront","insertFront","getRear","isFull","deleteLast","insertFront","getFront"], values = [3,1,2,3,4,0,0,0,4,0]
Output: [1,1,1,0,2,1,1,1,4]
Explanation: Capacity 3 fills with [3,1,2]; the second insertFront fails; rear is 2 and the deque is full; after deleting the rear, inserting 4 at the front gives [4,3,1].
```

**Example 2:**
```
Input: operations = ["MyCircularDeque","getFront","getRear","isEmpty","insertFront","isFull","deleteFront","isEmpty"], values = [2,0,0,0,9,0,0,0]
Output: [-1,-1,1,1,0,1,1]
Explanation: An empty deque reads -1 at both ends; after inserting 9 it is neither full nor empty.
```

**Example 3:**
```
Input: operations = ["MyCircularDeque","insertFront","getFront","deleteFront","isEmpty"], values = [1,5,0,0,0]
Output: [1,5,1,1]
```

**Constraints:**
- `1 <= operations.length == values.length <= 3000`
- The first operation is `"MyCircularDeque"` with `1 <= k <= 1000`.
- Inserted values satisfy `0 <= v <= 1000`; other calls carry `0`.
