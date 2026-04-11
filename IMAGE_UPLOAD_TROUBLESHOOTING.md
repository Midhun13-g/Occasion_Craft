# Image Upload Troubleshooting Guide

## Changes Made

### Backend Changes:
1. ✅ Updated `WebConfig.java` - Added both `/uploads/**` and `/api/uploads/**` mappings
2. ✅ Updated `SecurityConfig.java` - Added `/api/uploads/**` to permitAll
3. ✅ Added test endpoint in `FileUploadController.java` - `/api/upload/test`
4. ✅ Enhanced upload response with success message

### Frontend Changes:
1. ✅ Updated `ImageUpload.tsx` - Added useEffect to sync preview with value prop
2. ✅ Better error messages showing the actual URL that failed
3. ✅ Console logging for debugging

## Testing Steps

### Step 1: Restart Backend
```bash
cd backend
mvn clean spring-boot:run
```

### Step 2: Test Upload Directory
Open browser and go to:
```
http://localhost:8080/api/upload/test
```

You should see JSON response like:
```json
{
  "uploadDir": "uploads",
  "absolutePath": "C:\\path\\to\\project\\backend\\uploads",
  "exists": true,
  "isDirectory": true,
  "fileCount": 0
}
```

### Step 3: Test File Upload

#### Option A: Using Browser Console
1. Open admin panel: `http://localhost:5173/admin/templates`
2. Click "Add Template"
3. Open browser console (F12)
4. Click the upload area and select an image
5. Watch console for:
   - "Uploading to: http://localhost:8080/api/upload"
   - "Upload response: {url: '...'}"
   - "Image URL: http://localhost:8080/api/uploads/xxxxx.jpg"

#### Option B: Using Postman/cURL
```bash
curl -X POST http://localhost:8080/api/upload \
  -F "file=@/path/to/your/image.jpg"
```

Expected response:
```json
{
  "url": "http://localhost:8080/api/uploads/xxxxx-xxxx-xxxx.jpg",
  "message": "File uploaded successfully"
}
```

### Step 4: Test Image Access
After upload, copy the URL from response and paste in browser:
```
http://localhost:8080/api/uploads/xxxxx-xxxx-xxxx.jpg
```

The image should display.

## Common Issues & Solutions

### Issue 1: "Failed to load preview image"
**Cause**: Image URL is not accessible
**Solutions**:
1. Check if backend is running on port 8080
2. Verify uploads directory exists: `backend/uploads/`
3. Check browser console for the actual URL being accessed
4. Try accessing the URL directly in browser

### Issue 2: 404 Not Found for uploaded images
**Cause**: Static resource handler not configured correctly
**Solutions**:
1. Restart backend after WebConfig changes
2. Check SecurityConfig allows `/api/uploads/**`
3. Verify file exists in uploads directory

### Issue 3: Upload fails with error
**Cause**: File size or type restrictions
**Solutions**:
1. Check file size < 10MB
2. Ensure file is image/* or video/*
3. Check backend console for error logs

### Issue 4: CORS error
**Cause**: Frontend can't access backend
**Solutions**:
1. Verify `application.properties` has correct CORS settings
2. Check frontend is running on `http://localhost:5173`
3. Restart both frontend and backend

## Debugging Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] `/api/upload/test` returns success
- [ ] `uploads/` directory exists in backend folder
- [ ] Browser console shows upload logs
- [ ] Network tab shows 200 OK for upload
- [ ] Uploaded file exists in uploads directory
- [ ] Direct URL access to uploaded file works

## Manual File Test

If upload still doesn't work, test manually:

1. Create `backend/uploads/test.jpg` (copy any image)
2. Access: `http://localhost:8080/api/uploads/test.jpg`
3. If this works, upload endpoint is the issue
4. If this fails, static resource serving is the issue

## Alternative: Use URL Input

If file upload continues to fail, you can:
1. Upload images to free hosting (imgur.com, cloudinary.com)
2. Use the direct URL in the preview_url field
3. This bypasses local file upload entirely

## Contact Support

If issues persist:
1. Check backend console logs
2. Check browser console errors
3. Share error messages for further help
