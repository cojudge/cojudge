Each log entry looks like `"<count> <domain>"`, meaning the full domain was visited `count` times. Every visit to a domain also counts as a visit to each of its parent suffixes: for `discuss.leetcode.com`, the suffixes `leetcode.com` and `com` gain the same visits.

Collect the total visits for every distinct domain and suffix appearing in the logs. Return strings of the form `"<total> <domain>"` in any order.

Adaptation note: this task uses the portable `string_array` input and `string_list` output types; ordering of the output list is ignored during judging (lists are compared as sorted sets).

**Example 1:**
```
Input: cpdomains = ["9001 discuss.leetcode.com"]
Output: ["9001 discuss.leetcode.com","9001 leetcode.com","9001 com"]
Explanation: The count flows to the full domain and both suffixes.
```

**Example 2:**
```
Input: cpdomains = ["900 google.mail.com","50 yahoo.com","1 intel.mail.com","5 wiki.org"]
Output: ["901 mail.com","50 yahoo.com","900 google.mail.com","5 wiki.org","5 org","1 intel.mail.com","951 com"] (order may vary)
Explanation: Shared suffixes add up: mail.com gets 900+1, com gets 900+50+1.
```

**Constraints:**
- `1 <= cpdomains.length <= 100`
- `1 <= cpdomains[i].length <= 100`
- Each entry has a positive count, one space, then lowercase letters, digits, dots and hyphens.
- No leading or trailing dots; at least one dot-separated label.
