class Marker {
    public String toGoatLatin(String sentence) {
        String[] words = sentence.split(" ");
        StringBuilder ans = new StringBuilder();
        String vowels = "aeiouAEIOU";
        for (int i = 0; i < words.length; i++) {
            String w = words[i];
            StringBuilder sb = new StringBuilder();
            if (vowels.indexOf(w.charAt(0)) >= 0) {
                sb.append(w);
            } else {
                sb.append(w.substring(1)).append(w.charAt(0));
            }
            sb.append("ma");
            for (int k = 0; k <= i; k++) sb.append('a');
            if (i > 0) ans.append(' ');
            ans.append(sb);
        }
        return ans.toString();
    }
    public boolean isCorrect(String sentence, String output) {
        return toGoatLatin(sentence).equals(output);
    }
}
