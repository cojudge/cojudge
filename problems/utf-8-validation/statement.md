An integer array `data` claims to hold a UTF-8 byte stream, one byte per entry (only the lowest eight bits of each integer matter). Multi-byte symbols follow a fixed prefix scheme:

- a single-byte symbol starts with bit `0`;
- a symbol using `k` bytes (`2 <= k <= 4`) starts with `k` one-bits followed by a zero bit, and each of its `k - 1` trailing bytes starts with bits `10`;
- the patterns `10xxxxxx` never start a symbol, and a leading run of five or more ones never starts one.

Check the whole array from left to right and return `true` exactly when it splits into valid symbols with no bytes left over.

**Constraints:**
- `1 <= data.length <= 2 * 10^4`
- `0 <= data[i] <= 255`
