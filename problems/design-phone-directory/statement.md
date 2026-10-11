Replay a phone-number pool through one portable batch function.

This is a function adaptation of the classic directory-design task: instead of writing a class, implement `runPhoneDirectory(operations, args)`. The two arrays are parallel. The first operation is always `"PhoneDirectory"` with a single argument `[maxNumbers]`, creating pool numbers `0` through `maxNumbers - 1`, all free at first. Each later operation is one of:

- `"get"` with `[]`: hand out the smallest free number, or `-1` when none is free. Its result is recorded.
- `"check"` with `[number]`: record `1` when that number is currently free, else `0`.
- `"release"` with `[number]`: return the number to the pool when it is currently taken; otherwise do nothing. It records nothing.

Return the recorded results from `get` and `check` calls only, in order. Fixing `get` to the smallest free number keeps every test deterministic.

**Example 1:**
```
Input: operations = ["PhoneDirectory","get","get","check","get","check","release","check"], args = [[3],[],[],[2],[],[2],[2],[2]]
Output: [0,1,1,2,0,1]
Explanation: Pool {0,1,2}. get gives 0, then 1. 2 is still free (1). get gives 2. Now 2 is taken (0). Releasing 2 frees it again (1).
```

**Example 2:**
```
Input: operations = ["PhoneDirectory","get","check","release","get"], args = [[1],[],[0],[0],[]]
Output: [0,0,0]
Explanation: The lone number 0 is handed out, so checking it gives 0. Releasing it and getting again returns 0.
```

**Example 3:**
```
Input: operations = ["PhoneDirectory","get","get","get"], args = [[2],[],[],[]]
Output: [0,1,-1]
Explanation: After both numbers are taken, the third get finds nothing free.
```

**Constraints:**
- `1 <= operations.length == args.length <= 10^4`
- `operations[0] == "PhoneDirectory"` and `args[0] == [maxNumbers]` with `1 <= maxNumbers <= 10^4`.
- Later operations are `get` with `[]`, `check` with `[number]`, or `release` with `[number]`.
- `0 <= number < maxNumbers`
