Consider a booking service for half-open slots `[start, end)` with no refusal rule: every requested slot is stored. After each booking, the service reports the largest number of stored slots covering any single point in time (the peak overlap so far).

You get an ordered call sequence. The first entry creates the calendar; each later entry books `[start, end)` with `start < end` and always succeeds.

Implement `runCalendarThree(operations, args)`:

- `operations[i]` is `"MyCalendarThree"` for the creation entry, then `"book"` afterwards.
- `args[i]` is `[]` for creation and `[start, end]` for a booking.
- Return one integer per booking (creation excluded): the peak overlap after that booking is stored.

**Example 1:**
```
Input: operations = ["MyCalendarThree","book","book","book","book","book","book"], args = [[],[10,20],[50,60],[10,40],[5,15],[5,10],[25,55]]
Output: [1,1,2,3,3,3]
Explanation: Overlaps build up: the fourth booking triple-covers [10,15), and later bookings never exceed three.
```

**Example 2:**
```
Input: operations = ["MyCalendarThree","book","book","book"], args = [[],[0,10],[10,20],[5,15]]
Output: [1,1,2]
Explanation: Only the last booking creates a double overlap.
```

**Example 3:**
```
Input: operations = ["MyCalendarThree","book"], args = [[],[1,2]]
Output: [1]
```

**Constraints:**
- `1 <= operations.length <= 400`
- `0 <= start < end <= 10^9`
