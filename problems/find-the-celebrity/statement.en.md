There are `n` people labeled `0` to `n - 1`. A celebrity knows nobody but is known by everybody else. Interact with the judge object `relation` — your code never receives the adjacency matrix:

- `knows(a, b)` returns whether person `a` knows person `b`.

Implement `findCelebrity(n, relation)` returning the celebrity label, or `-1` when none exists. First eliminate candidates in `O(n)` calls (if the candidate knows `i`, it cannot be the celebrity, so move to `i`), then verify the survivor knows nobody and is known by everybody. The judge counts your `knows` calls and reports Wrong Answer if you exceed **10 + 5*n** calls on a test case (an `O(n)` solution uses about `3n`).

Method names per language: Java `relation.knows(a, b)`, Python `relation.knows(a, b)`, C++ `relation.knows(a, b)`, C# `relation.Knows(a, b)`, Rust `relation.knows(a, b)`, Go `relation.Knows(a, b)`, TypeScript `relation.knows(a, b)`, PHP `$relation->knows($a, $b)`.

**Constraints:**

- `1 <= n <= 100`
- The hidden matrix is `n x n` with entries `0` or `1` (diagonal entries are ignored).
- At most `10 + 5*n` `knows` calls per test case.
