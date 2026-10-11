Picture a combination lock with four round dials, each showing one of `'0'` through `'9'`. A dial turned past `'9'` wraps to `'0'`, and turned below `'0'` wraps to `'9'`. One move consists of rotating a single dial forward or backward by one position.

The lock begins at `'0000'`. A set `deadends` lists forbidden codes: stepping onto any of them jams the lock permanently. Starting from the initial state without counting it as a visit if it is blocked, find the fewest moves that reach `target`. Return `-1` when the target can never be reached safely.

**Example 1:**
```
Input: deadends = ["0201","0101","0102","1212","2002"], target = "0202"
Output: 6
```

**Example 2:**
```
Input: deadends = ["8888"], target = "0009"
Output: 1
```

**Example 3:**
```
Input: deadends = ["8887","8889","8878","8898","8788","8988","7888","9888"], target = "8888"
Output: -1
```

**Constraints:**
- `1 <= deadends.length <= 500`
- `deadends[i].length == 4`
- `target.length == 4`
- `target` will not be in the list `deadends`
- `target` and `deadends[i]` consist of digits only
