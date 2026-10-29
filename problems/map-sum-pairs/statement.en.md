Maintain a string-to-integer store with prefix sums. Design adaptation: instead of a class, implement `runMapSum(operations, keys, vals)`.

Convention per index `i`:

- `operations[i]` is `"insert"` or `"sum"`.
- For `"insert"`, insert `keys[i]` with value `vals[i]`, overwriting any prior value for that key. No output entry is produced.
- For `"sum"`, `keys[i]` is a prefix (vals[i] is ignored). Append the total of all stored values whose key starts with that prefix.

Return the list of sums for the sum calls in order.

**Constraints:**
- Operation count per test is between 1 and 20.
- Keys use lowercase letters; insert values lie in [1, 1000].
