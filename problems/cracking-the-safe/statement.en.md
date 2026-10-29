A safe opens with a secret code of exactly `n` digits, each digit ranging from `0` to `k - 1`. The lock inspects the most recent `n` digits after every key press, so a long typed string can test many codes in a row.

For example, with code length 3 and typed string `012345`, the lock checks `0`, `01`, `012`, `123`, `234` and finally `345`.

Produce any shortest possible string that contains every one of the `k^n` codes as a contiguous block somewhere inside it. Any minimal answer is accepted.

**Constraints:**
- `1 <= n <= 4`
- `1 <= k <= 10`
- `1 <= k^n <= 4096`
