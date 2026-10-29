Design a Least Frequently Used (LFU) cache.

`operations[0]` is always `LFUCache` and `args[0]` holds the capacity.
For `i >= 1`, `operations[i]` is `get` with `args[i] = [key]` or `put` with
`args[i] = [key, value]`. Return an array with one entry per `get` operation,
in order; `put` produces no output. A missing key returns `-1`. When the cache
is full, evict the least frequently used key, breaking ties by least recently
used. A new key starts with frequency `1`; every `get` or updating `put`
increments its frequency.

**Constraints:**

- `1 <= capacity <= 10^4`
- `0 <= key <= 10^5`
- `0 <= value <= 10^9`
