There are `n` network nodes labeled from `1` to `n`. Each directed edge
`times[i] = [u, v, w]` means that a signal takes `w` time units to travel from
`u` to `v`.

A signal is sent from node `k`. Return the minimum time required for every node
to receive the signal. Return `-1` if at least one node cannot be reached.

**Constraints:**

- `1 <= n <= 100`
- `1 <= times.length <= 6000`
- `times[i].length == 3`
- `1 <= u, v, k <= n`
- `u != v`
- `0 <= w <= 100`
- Directed node pairs in `times` are unique.
