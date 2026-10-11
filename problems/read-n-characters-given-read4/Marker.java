class Marker {
    public String read(String file, int n) {
        if (file == null) return "";
        int len = Math.min(Math.max(n, 0), file.length());
        // Simulate read4 chunking: copy 4 chars at a time
        StringBuilder sb = new StringBuilder();
        int copied = 0;
        while (copied < len) {
            int chunk = Math.min(4, len - copied);
            sb.append(file, copied, copied + chunk);
            copied += chunk;
        }
        return sb.toString();
    }
    public boolean isCorrect(String file, int n, String output) {
        return read(file, n).equals(output);
    }
}
