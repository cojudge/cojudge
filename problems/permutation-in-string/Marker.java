class Marker {
    public boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;

        int[] needed = new int[26];
        for (int i = 0; i < s1.length(); i++) {
            needed[s1.charAt(i) - 'a']++;
        }

        int remaining = s1.length();
        for (int right = 0; right < s2.length(); right++) {
            int entering = s2.charAt(right) - 'a';
            if (needed[entering] > 0) remaining--;
            needed[entering]--;

            if (right >= s1.length()) {
                int leaving = s2.charAt(right - s1.length()) - 'a';
                needed[leaving]++;
                if (needed[leaving] > 0) remaining++;
            }

            if (right + 1 >= s1.length() && remaining == 0) return true;
        }
        return false;
    }

    public boolean isCorrect(String s1, String s2, boolean output) {
        return output == checkInclusion(s1, s2);
    }
}
