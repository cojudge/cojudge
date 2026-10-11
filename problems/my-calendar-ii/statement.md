Consider a booking service for half-open slots `[start, end)` that tolerates overlaps of up to two bookings but refuses any booking that would create a triple overlap.

You receive an ordered call sequence. The first entry creates the calendar; each later entry books one interval `[start, end)` with `start < end`. A booking succeeds exactly when adding it keeps every point in time covered by at most two stored slots; successful bookings are stored.

Implement `runCalendarTwo(operations, args)` instead of a class:

- `operations[i]` is `"MyCalendarTwo"` for the creation entry, then `"book"` for each request.
- `args[i]` is `[]` for creation and `[start, end]` for a booking.
- Return one integer per booking call (creation excluded): `1` for accepted, `0` for refused.

**Constraints:**
- `1 <= operations.length <= 1000`
- `0 <= start < end <= 10^9`
