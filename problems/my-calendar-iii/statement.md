Consider a booking service for half-open slots `[start, end)` with no refusal rule: every requested slot is stored. After each booking, the service reports the largest number of stored slots covering any single point in time (the peak overlap so far).

You get an ordered call sequence. The first entry creates the calendar; each later entry books `[start, end)` with `start < end` and always succeeds.

Implement `runCalendarThree(operations, args)`:

- `operations[i]` is `"MyCalendarThree"` for the creation entry, then `"book"` afterwards.
- `args[i]` is `[]` for creation and `[start, end]` for a booking.
- Return one integer per booking (creation excluded): the peak overlap after that booking is stored.

**Constraints:**
- `1 <= operations.length <= 400`
- `0 <= start < end <= 10^9`
