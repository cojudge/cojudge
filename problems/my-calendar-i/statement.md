Imagine a booking service that stores half-open time slots `[start, end)`: the slot covers `start` but stops just before `end`, so two slots that only touch at an endpoint do not clash.

You receive a sequence of calls. The first entry always creates the calendar; every later entry asks to book one interval. Process the calls in order:

- Creation entries carry no interval.
- Each booking entry carries `[start, end)` with `start < end` and answers whether the booking succeeds: it succeeds exactly when it overlaps none of the previously accepted bookings, in which case it is stored.

Rather than building a class, implement `runCalendar(operations, args)`:

- `operations[i]` is either `"MyCalendar"` (create, first entry) or `"book"`.
- `args[i]` is the argument list for that call: `[]` for creation and `[start, end]` for a booking.
- Return one integer per booking call (skipping the creation entry): `1` when the booking is accepted and `0` when it is rejected.

**Example 1:**
```
Input: operations = ["MyCalendar","book","book","book"], args = [[],[10,20],[15,25],[20,30]]
Output: [1,0,1]
Explanation: [10,20) is stored. [15,25) clashes with it and is refused. [20,30) only touches the first slot at 20, so it is stored.
```

**Example 2:**
```
Input: operations = ["MyCalendar","book","book"], args = [[],[5,10],[10,15]]
Output: [1,1]
Explanation: Touching at 10 is allowed, so both succeed.
```

**Example 3:**
```
Input: operations = ["MyCalendar","book","book"], args = [[],[0,5],[3,7]]
Output: [1,0]
Explanation: The second request overlaps the first and is refused.
```

**Constraints:**
- `1 <= operations.length <= 1000`
- `0 <= start < end <= 10^9`
- At most 1000 bookings.
