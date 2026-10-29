Build a container with stack behavior whose removal rule is frequency-based: each `pop` extracts the value that currently occurs most often.

A test is encoded as two parallel arrays, `operations` and `values`: `operations[i]` states whether step `i` is a `push` or a `pop`. The companion entry `values[i]` supplies the argument for a `push` and carries no meaning for a `pop`. Collect the value yielded by every `pop`, preserving their order; a `push` contributes no entry to that output. If several values share the highest frequency, remove the one that was pushed most recently (nearest the top).

Each sequence is guaranteed to be legal: `pop` never appears when the structure holds nothing.

**Constraints:**

- `0 <= values[i] <= 10^9` when `operations[i]` is `push`.
- `1 <= operations.length == values.length <= 20000`
- At most `2 * 10^4` calls are made in one trace.
