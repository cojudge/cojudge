Each log is a string starting with an identifier, followed by either words (a letter-log) or numbers (a digit-log). Reorder all logs so that letter-logs come first, sorted by their content and then by identifier when contents tie, while digit-logs keep their original relative order at the end.

Return the reordered logs as a list. The judge stores string arrays as native lists and expects a string list back.

**Constraints:**
- `1 <= logs.length <= 100`
- Each log has an identifier plus at least one word or number, separated by single spaces.

Adaptation: input logs use `string_array` while the ordered result uses `string_list`.
