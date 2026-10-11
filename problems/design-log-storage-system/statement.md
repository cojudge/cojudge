You maintain an append-only log store. Each record has an integer `id` and a timestamp string shaped `Year:Month:Day:Hour:Minute:Second` (for example `"2017:01:01:23:59:59"`). Every component is zero-padded, so plain string order matches chronological order.

Two behaviors are needed:

- `put(id, timestamp)` stores one record.
- `retrieve(start, end, granularity)` lists the `id` values whose timestamps fall inside `[start, end]` once both bounds and the record are cut down to the requested `granularity`. The granularity is one of `Year`, `Month`, `Day`, `Hour`, `Minute`, or `Second`. Cutting down means keeping only the leading components: `Year` keeps 1 part, `Month` keeps 2, and so on up to `Second` which keeps all 6.

This task uses a portable function adaptation instead of a class. Implement:

```
runLogStorage(operations, values)
```

The two arrays are parallel. `operations[i]` is one of `"LogSystem"`, `"put"`, or `"retrieve"`, and `values[i]` packs that call's arguments with `|` separators:

- `"LogSystem"` with `""` resets the store and is always first.
- `"put"` with `"id|timestamp"`, e.g. `"1|2017:01:01:23:59:59"`.
- `"retrieve"` with `"start|end|granularity"`, e.g. `"2016:01:01:01:01:01|2017:01:01:23:00:00|Year"`.

Return one integer row per `retrieve` call (in call order), each row listing matching `id` values in insertion order. Constructor and `put` calls produce no rows. There is intentionally no class wrapper.

**Example 1:**
```
Input: operations = ["LogSystem","put","put","put","retrieve"], values = ["","1|2017:01:01:23:59:59","2|2017:01:01:22:59:59","3|2016:01:01:00:00:00","2016:01:01:01:01:01|2017:01:01:23:00:00|Year"]
Output: [[1,2,3]]
Explanation: At year precision all three records sit in 2016..2017.
```

**Example 2:**
```
Input: operations = ["LogSystem","put","put","put","retrieve"], values = ["","1|2017:01:01:23:59:59","2|2017:01:01:22:59:59","3|2016:01:01:00:00:00","2016:01:01:01:01:01|2017:01:01:23:00:00|Hour"]
Output: [[1,2]]
Explanation: At hour precision only the two 2017 records land inside the window.
```

**Example 3:**
```
Input: operations = ["LogSystem","put","retrieve"], values = ["","7|2020:05:05:05:05:05","2020:05:05:05:05:05|2020:05:05:05:05:05|Second"]
Output: [[7]]
```

**Constraints:**
- `1 <= operations.length == values.length <= 500`
- The first operation is `"LogSystem"` with `""`.
- Each `id` is in `1..10^9`; timestamps match the fixed 6-part shape with valid calendar ranges.
- Granularity is exactly one of `Year`, `Month`, `Day`, `Hour`, `Minute`, `Second`.
- `start` is never later than `end` at the requested granularity.
