A logger receives print requests, each carrying a timestamp (in seconds) and a
message. A message may be printed when it has never appeared before, or when at
least 10 seconds have passed since it was last printed. Otherwise the request
is rejected.

Timestamps arrive in non-decreasing order.

**Adaptation note:** instead of a stateful class, implement
`runLogger(timestamps, messages)`, which replays one request per index and
returns an array using `1` for "printed" and `0` for "rejected".

**Example 1:**
```
Input: timestamps = [1,2,3,8,10,11], messages = ["foo","bar","foo","bar","foo","foo"]
Output: [1,1,0,0,0,1]
Explanation: "foo" at time 3 is only 2 seconds after its printing at time 1,
so it is rejected; "bar" at time 8 is 6 seconds after time 2, also rejected;
"foo" at time 10 is 9 seconds after time 1, still rejected; at time 11 a full
10 seconds have passed, so it prints.
```

**Example 2:**
```
Input: timestamps = [0,10,20], messages = ["a","a","a"]
Output: [1,1,1]
Explanation: Each request lands exactly on the 10-second boundary.
```

**Constraints:**
- `1 <= timestamps.length == messages.length <= 500`
- `0 <= timestamps[i] <= 10^9`, non-decreasing
- `1 <= messages[i].length <= 100`, lowercase letters and spaces
