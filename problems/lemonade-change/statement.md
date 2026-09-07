At a lemonade stand, each lemonade costs $5. Customers stand in a queue and pay with a $5, $10, or $20 bill. You must provide correct change so each customer effectively pays $5. You start with no change.

Given an integer array `bills` where `bills[i]` is the bill the `i`-th customer pays, return `true` if you can provide every customer with correct change, or `false` otherwise.

**Example 1:**
```
Input: bills = [5,5,5,10,20]
Output: true
```

**Example 2:**
```
Input: bills = [5,5,10,10,20]
Output: false
```

**Constraints:**
- `1 <= bills.length <= 10^5`
- `bills[i]` is either `5`, `10`, or `20`
