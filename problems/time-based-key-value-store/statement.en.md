Implement a time-based key-value store. A key may have several values, each associated with the timestamp at which it was set. A `get` query returns the value with the greatest set timestamp that is less than or equal to the query timestamp. If no such value exists, it returns the empty string.

This version uses a portable function interface instead of requiring a language-specific `TimeMap` class. The four input arrays are aligned:

- For `operations[i] == "set"`, store `values[i]` for `keys[i]` at `timestamps[i]`.
- For `operations[i] == "get"`, ignore `values[i]` (which may be any placeholder, including the empty string), query `keys[i]` at `timestamps[i]`, and append the answer to the returned list.
- Return results only for `get` operations. Do not return placeholders for `set` operations.
- Each call starts with an empty store. Across the whole operation sequence, timestamps on `set` operations are strictly increasing.

**Constraints:**

- `1 <= operations.length <= 2 * 10^5`
- All four arrays have the same length.
- Every operation is either `"set"` or `"get"`.
- `1 <= keys[i].length <= 100`, and every key contains only lowercase English letters and digits.
- For `set` operations, `1 <= values[i].length <= 100`, and the value contains only lowercase English letters and digits. Values paired with `get` operations are ignored placeholders and are not subject to this requirement.
- `1 <= timestamps[i] <= 10^7`
- Timestamps on `set` operations are strictly increasing globally, in operation order.

**Portable interface:** Implement `runTimeMap(operations, keys, values, timestamps)`. This is intentionally function-based and must not be implemented as a class problem.
