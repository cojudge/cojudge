import { env } from '$env/dynamic/private';

// Read when the server starts, so Portainer/Compose can change the images
// without rebuilding the application. Empty values retain the stock images.
export const pythonImage = env.COJUDGE_PYTHON_IMAGE?.trim() || 'python:3.11-slim';
export const javaImage = env.COJUDGE_JAVA_IMAGE?.trim() || 'alpine/java:22-jdk';
