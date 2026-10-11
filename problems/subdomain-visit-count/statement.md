Each log entry looks like `"<count> <domain>"`, meaning the full domain was visited `count` times. Every visit to a domain also counts as a visit to each of its parent suffixes: for `discuss.leetcode.com`, the suffixes `leetcode.com` and `com` gain the same visits.

Collect the total visits for every distinct domain and suffix appearing in the logs. Return strings of the form `"<total> <domain>"` in any order.

Adaptation note: this task uses the portable `string_array` input and `string_list` output types; ordering of the output list is ignored during judging (lists are compared as sorted sets).

**Constraints:**
- `1 <= cpdomains.length <= 100`
- `1 <= cpdomains[i].length <= 100`
- Each entry has a positive count, one space, then lowercase letters, digits, dots and hyphens.
- No leading or trailing dots; at least one dot-separated label.
