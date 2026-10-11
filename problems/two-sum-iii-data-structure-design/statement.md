This is an offline adaptation of a design task. Instead of writing a class, you write one function that replays a whole session:

```
runTwoSum(operations, values)
```

Both arrays have the same length. Each entry is one step:

- `"add"` with `values[i] = number` stores the number for later queries and produces no output.
- `"find"` with `values[i] = value` asks whether any pair of stored numbers (using two different stored entries) sums to `value`. Its answer (`1` for yes, `0` for no) is appended to the result.

Return the answers for the `"find"` steps in order. Only `"find"` steps contribute entries.

**Example 1:**
```
Input: operations = ["add","add","add","find","find"], values = [1,3,5,4,7]
Output: [1,0]
Explanation: After storing 1, 3, 5: 4 equals 1 + 3 (yes -> 1), while no pair sums to 7 (no -> 0).
```

**Example 2:**
```
Input: operations = ["add","add","find"], values = [0,0,0]
Output: [1]
Explanation: The two stored zeros sum to 0. A pair must use two different stored entries, which exists here.
```

**Example 3:**
```
Input: operations = ["add","find","find"], values = [5,5,10]
Output: [0,0]
Explanation: A single stored 5 cannot pair with itself; 10 also has no pair yet.
```

**Constraints:**
- `0 <= number of steps <= 10^4`
- `-10^5 <= number, value <= 10^5`
- `operations` holds only `"add"` or `"find"`.
