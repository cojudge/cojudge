Implement the behavior of a Least Recently Used (LRU) cache through one portable
batch function.

`operations` and `args` are parallel arrays. The first operation is always
`"LRUCache"` with one argument, the positive cache capacity. Every later operation
is one of:

- `"put"` with `[key, value]`: insert or update the key. If insertion exceeds
  capacity, evict the least recently used key.
- `"get"` with `[key]`: return the value when present, otherwise return `-1`.
  A successful `get` makes that key the most recently used.

Return an array containing results from `get` operations only, in order. The
constructor and `put` operations do not add entries to the returned array.

This batch function is a portable adaptation of the usual class-design problem;
implement `runLruCache` directly rather than declaring an `LRUCache` user class.
Both `get` and `put` should run in average `O(1)` time.

**Constraints:**

- `operations.length == args.length`
- `1 <= operations.length <= 200001`
- `operations[0] == "LRUCache"`
- `args[0].length == 1` and `1 <= args[0][0] <= 3000`
- A `put` row has two integers `[key, value]`.
- A `get` row has one integer `[key]`.
- `0 <= key <= 10000`
- `0 <= value <= 100000`
