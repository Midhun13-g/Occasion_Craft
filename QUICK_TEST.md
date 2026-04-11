## Quick Test Steps

### 1. Restart Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Test Upload Directory Info
Open browser: http://localhost:8080/api/upload/test

Expected response:
```json
{
  "uploadDir": "uploads",
  "absolutePath": "C:\\...\\backend\\uploads",
  "exists": true,
  "isDirectory": true,
  "fileCount": 0
}
```

### 3. Upload a Test File

**Using cURL:**
```bash
curl -X POST http://localhost:8080/api/upload -F "file=@path/to/image.jpg"
```

**Expected Response:**
```json
{
  "url": "http://localhost:8080/api/uploads/xxxxx-xxxx-xxxx.jpg",
  "message": "File uploaded successfully"
}
```

### 4. Access the Uploaded File
Copy the URL from step 3 and paste in browser:
```
http://localhost:8080/api/uploads/xxxxx-xxxx-xxxx.jpg
```

The image should display.

### 5. Test in Admin Panel
1. Go to: http://localhost:5173/admin/templates
2. Click "Add Template"
3. Click upload area
4. Select an image
5. Image should preview immediately
6. Fill other fields and save
7. Go to browse templates page
8. Image should display on the card

## If Still Not Working

Check browser console for exact error and URL being accessed.
