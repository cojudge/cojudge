class Marker {
    public int findLUSlength(String[] strs) {
        int ans = -1;
        for (int i = 0; i < strs.length; i++) {
            boolean uncommon = true;
            for (int j = 0; j < strs.length; j++) {
                if (i == j) continue;
                if (isSubsequence(strs[i], strs[j])) {
                    uncommon = false;
                    break;
                }
            }
            if (uncommon) ans = Math.max(ans, strs[i].length());
        }
        return ans;
    }
    private boolean isSubsequence(String a, String b) {
        int i = 0;
        for (int j = 0; j < b.length() && i < a.length(); j++) {
            if (a.charAt(i) == b.charAt(j)) i++;
        }
        return i == a.length();
    }
    public boolean isCorrect(String[] strs, int output) {
        return output == findLUSlength(strs);
    }
}
