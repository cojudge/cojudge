Consider a booking service for half-open slots `[start, end)` that tolerates overlaps of up to two bookings but refuses any booking that would create a triple overlap.

You receive an ordered call sequence. The first entry creates the calendar; each later entry books one interval `[start, end)` with `start < end`. A booking succeeds exactly when adding it keeps every point in time covered by at most two stored slots; successful bookings are stored.

Implement `runCalendarTwo(operations, args)` instead of a class:

- `operations[i]` is `"MyCalendarTwo"` for the creation entry, then `"book"` for each request.
- `args[i]` is `[]` for creation and `[start, end]` for a booking.
- Return one integer per booking call (creation excluded): `1` for accepted, `0` for refused.

**Example 1:**
```
Input: operations = ["MyCalendarTwo","book","book","book","book","book","book"], args = [[],[10,20],[50,60],[10,40],[5,15],[5,10],[25,55]]
Output: [1,1,1,0,1,1]
Explanation: The fourth request would triple-cover [10,15), so it fails; the others never stack three deep.
```

**Example 2:**
```
Input: operations = ["MyCalendarTwo","book","book","book"], args = [[],[0,10],[10,20],[5,15]]
Output: [1,1,1]
Explanation: The middle of [5,15) is double-covered at most, which is allowed.
```

**Example 3:**
```
Input: operations = ["MyCalendarTwo","book","book","book"], args = [[],[0,10],[5,15],[5,10]]
Output: [1,1,0]
Explanation: The last request would sit on top of two existing slots across [5,10).
```

**Constraints:**
- `1 <= operations.length <= 1000`
- `0 <= start < end <= 10^9`
