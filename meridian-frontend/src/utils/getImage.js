export const getImageUrl = (imagePath) => {
  // 1. Handle missing images (Use base64 so it works offline)
  if (!imagePath) return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

  // 2. If it's already a full URL, trust it
  if (imagePath.startsWith('http')) return imagePath;

  // 3. YOUR NEW IP ADDRESS (Port 8000)
  // Update this whenever your network changes!
  const BASE_URL = 'http://10.208.14.243:8000'; 

  // 4. Clean the path
  let cleanPath = imagePath;
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }

  // 5. Ensure "media/" prefix exists
  if (!cleanPath.startsWith('media/')) {
    cleanPath = `media/${cleanPath}`;
  }

  // 6. Return the Full URL (e.g., http://10.208.14.243:8000/media/...)
  return `${BASE_URL}/${cleanPath}`;
};

export default getImageUrl;