This is an offline adaptation of a design task. Instead of writing a class, you write one function that replays a whole session:

```
runBstIterator(root, operations)
```

`root` is the binary search tree to walk (level-order form such as `[7,3,15,null,null,9,20]`), and `operations` holds only `"next"` or `"hasNext"`, in the order they are called. The iterator visits values in ascending order:

- `"next"` returns the next smallest value and moves forward.
- `"hasNext"` returns `1` when values remain and `0` otherwise.

Return the answers for every operation in order, encoding `"hasNext"` as `1` or `0`.

**Constraints:**
- `0 <= number of nodes <= 10^4`
- `-10^5 <= Node.val <= 10^5`
- `"next"` is only called when `"hasNext"` would be true.
