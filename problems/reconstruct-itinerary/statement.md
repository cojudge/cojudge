You are given airline tickets as two parallel arrays. Ticket `i` travels from
`from[i]` to `to[i]`. Reconstruct an itinerary that begins at `"JFK"` and uses
every ticket exactly once.

If several valid itineraries exist, return the lexicographically smallest one
when the airport sequence is compared from left to right. The input is
guaranteed to admit at least one itinerary from `"JFK"`.

**Constraints:**

- `1 <= from.length == to.length <= 300`
- Every airport code consists of three uppercase English letters.
- `from[i] != to[i]`
- Duplicate tickets are allowed and must each be used once.
- At least one itinerary uses every ticket and starts at `"JFK"`.
