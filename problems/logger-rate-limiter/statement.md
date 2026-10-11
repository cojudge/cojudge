A logger receives print requests, each carrying a timestamp (in seconds) and a
message. A message may be printed when it has never appeared before, or when at
least 10 seconds have passed since it was last printed. Otherwise the request
is rejected.

Timestamps arrive in non-decreasing order.

**Adaptation note:** instead of a stateful class, implement
`runLogger(timestamps, messages)`, which replays one request per index and
returns an array using `1` for "printed" and `0` for "rejected".

**Constraints:**
- `1 <= timestamps.length == messages.length <= 500`
- `0 <= timestamps[i] <= 10^9`, non-decreasing
- `1 <= messages[i].length <= 100`, lowercase letters and spaces
