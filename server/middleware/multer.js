import multer from 'multer'; // Import Multer to handle file uploads
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" }); // Initialize dotenv
// Configure Multer to use memory storage
// This means uploaded files are stored in memory as a buffer instead of saving them directly to disk
const storage = multer.memoryStorage();

// Initialize Multer with the memory storage configuration
const upload = multer({ storage: storage });

// Export the configured Multer middleware
// This will be used in routes to handle file uploads
export default upload;


/*
What is Multer?
Multer is a middleware for handling file uploads in Node.js applications, specifically in Express.js. 
It simplifies the process of dealing with file uploads in a web server environment. Multer processes 
incoming multipart/form-data requests, which is the encoding type used for file uploads in HTML forms.

When a user uploads a file via a form, the browser sends the file as part of the request. Multer 
intercepts this request and stores the file in memory or on disk based on the configuration. It makes 
the uploaded files available in the request object (req.file or req.files).

Why We Use Multer
Handling File Uploads:

Multipart/Form-Data Parsing: Multer is specifically designed to handle multipart/form-data requests, 
which is used for uploading files through HTML forms. It allows the backend server to easily access and 
manage files sent via HTTP requests.
Simplified API:

Multer simplifies file uploads by providing a straightforward API for defining file storage behavior 
and handling multiple file types. Instead of manually parsing the multipart/form-data request, you just 
configure Multer, and it does all the heavy lifting.
Flexible Storage Options:

Multer supports two main storage options:
Memory Storage: Stores files in memory (RAM) as Buffer objects. This is useful when the file needs to be
 processed or uploaded to another service (e.g., Cloudinary or AWS S3) without saving it to disk.
Disk Storage: Saves uploaded files directly to the server's file system, allowing you to specify the 
directory and file name.
You can choose the appropriate storage strategy depending on your use case.

Easy File Access:

After a file is uploaded, Multer makes it accessible through req.file (for a single file) or 
req.files (for multiple files) on the request object in your Express route. This makes it easy to
 access file metadata (like the filename, size, and mime type) and the file content itself (as a buffer).
Validation and Filtering:

You can use Multer to filter and validate uploaded files, ensuring that only files of a certain type
 or size are accepted. This helps prevent unwanted file types (e.g., security risks) from being 
 uploaded to the server.
Security:

Multer helps reduce the risk of malicious file uploads by enabling you to specify validation 
rules (e.g., limiting file size, checking file type, etc.). It also allows you to control where 
files are stored, ensuring that they don't overwrite important files or get stored in insecure locations.



*/
