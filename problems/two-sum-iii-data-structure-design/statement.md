This is an offline adaptation of a design task. Instead of writing a class, you write one function that replays a whole session:

```
runTwoSum(operations, values)
```

Both arrays have the same length. Each entry is one step:

- `"add"` with `values[i] = number` stores the number for later queries and produces no output.
- `"find"` with `values[i] = value` asks whether any pair of stored numbers (using two different stored entries) sums to `value`. Its answer (`1` for yes, `0` for no) is appended to the result.

Return the answers for the `"find"` steps in order. Only `"find"` steps contribute entries.

**Constraints:**
- `0 <= number of steps <= 10^4`
- `-10^5 <= number, value <= 10^5`
- `operations` holds only `"add"` or `"find"`.
