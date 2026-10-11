Picture a combination lock with four round dials, each showing one of `'0'` through `'9'`. A dial turned past `'9'` wraps to `'0'`, and turned below `'0'` wraps to `'9'`. One move consists of rotating a single dial forward or backward by one position.

The lock begins at `'0000'`. A set `deadends` lists forbidden codes: stepping onto any of them jams the lock permanently. Starting from the initial state without counting it as a visit if it is blocked, find the fewest moves that reach `target`. Return `-1` when the target can never be reached safely.

**Constraints:**
- `1 <= deadends.length <= 500`
- `deadends[i].length == 4`
- `target.length == 4`
- `target` will not be in the list `deadends`
- `target` and `deadends[i]` consist of digits only
