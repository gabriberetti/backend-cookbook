import { BackendEvent } from '@/types';

export interface WalkthroughStep {
  title: string;
  description: string;
  code?: string;
  stage?: string;
}

export interface ModuleChallenge {
  instruction: string;
  hint: string;
  hintLink?: string;
  verify: (event: BackendEvent) => boolean;
  successMessage: string;
}

export interface ModuleScenario {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleDef {
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  recruiterLine: string;
  steps: WalkthroughStep[];
  challenge: ModuleChallenge;
  scenario: ModuleScenario;
}

export const MODULES: ModuleDef[] = [
  {
    slug: 'authentication',
    title: 'Authentication',
    subtitle: 'JWT tokens, bcrypt, and protected routes',
    color: '#3b82f6',
    icon: '🔐',
    recruiterLine:
      'When a user logs in, the frontend sends credentials to the API. The backend verifies the password and issues a signed JWT token — a secure key that proves who you are on every future request.',
    steps: [
      {
        title: 'User submits credentials',
        description:
          'The frontend sends a POST request with an email and password. The password is never stored anywhere at this point — it travels securely over HTTPS.',
        code: 'POST /auth/login\n{ email: "user@example.com", password: "secret" }',
        stage: 'request',
      },
      {
        title: 'Backend looks up the user',
        description:
          'Express finds the user in MongoDB by email. The password field is excluded by default (select: false) and must be explicitly requested for comparison.',
        code: 'const user = await User.findOne({ email }).select("+password");',
        stage: 'db-lookup',
      },
      {
        title: 'Password is verified with bcrypt',
        description:
          'bcrypt compares the plain-text password against the stored hash. Even if the database is breached, attackers cannot reverse the hash to get the original password.',
        code: 'const valid = await bcrypt.compare(password, user.password);\n// true or false — never the actual password',
        stage: 'bcrypt',
      },
      {
        title: 'JWT token is issued',
        description:
          'If the password matches, the server signs a JSON Web Token with the user ID and email. This token is sent back and stored by the client — no session state is kept on the server.',
        code: 'const token = jwt.sign(\n  { userId, email },\n  JWT_SECRET,\n  { expiresIn: "7d" }\n);',
        stage: 'jwt-issue',
      },
      {
        title: 'Protected routes verify the token',
        description:
          'Every subsequent request includes the token in the Authorization header. The auth middleware decodes it — if valid, the request proceeds; if expired or tampered with, it is rejected with 401.',
        code: '// Authorization: Bearer <token>\nconst payload = jwt.verify(token, JWT_SECRET);\nreq.user = payload; // { userId, email }',
        stage: 'middleware',
      },
    ],
    challenge: {
      instruction: 'Log in or register an account on the Dashboard to complete this challenge.',
      hint: 'Go to the Dashboard page, fill in the Auth form, and click Login or Register.',
      hintLink: '/dashboard',
      verify: (e) => e.eventType === 'auth' && (e.stage === 'login' || e.stage === 'register'),
      successMessage: 'JWT token issued. Authentication event captured from the backend.',
    },
    scenario: {
      question:
        'A user sends a request with a JWT that was issued 10 days ago, but the token expires after 7 days. What does the backend respond with?',
      options: [
        '200 OK — the user is still authenticated',
        '403 Forbidden — the user is not allowed',
        '401 Unauthorized — the token is expired',
        '500 Internal Server Error — jwt.verify throws',
      ],
      correctIndex: 2,
      explanation:
        'jwt.verify() throws a TokenExpiredError when the token is past its expiry. The auth middleware catches this and responds with 401 Unauthorized — telling the client to re-authenticate. 403 would mean the user is authenticated but not allowed to access that specific resource.',
    },
  },
  {
    slug: 'database',
    title: 'Database Systems',
    subtitle: 'MongoDB, Mongoose, and document modeling',
    color: '#10b981',
    icon: '🗄️',
    recruiterLine:
      'The backend uses MongoDB — a NoSQL database that stores data as flexible JSON-like documents. Mongoose adds structure with schemas, validation, and indexes for fast querying.',
    steps: [
      {
        title: 'Define a schema with Mongoose',
        description:
          'Mongoose schemas describe the shape of your data — field types, required fields, defaults, and indexes. This gives structure to an otherwise schema-less database.',
        code: 'const taskSchema = new Schema({\n  title: { type: String, required: true },\n  status: { type: String, default: "pending" },\n  userId: { type: ObjectId, ref: "User", index: true },\n}, { timestamps: true });',
        stage: 'schema',
      },
      {
        title: 'Create a document',
        description:
          'Mongoose validates the data against the schema before writing to MongoDB. If validation fails, the operation throws before touching the database.',
        code: 'const task = await Task.create({\n  title: "Build the API",\n  userId: req.user.userId\n});\n// Returns the saved document with _id and timestamps',
        stage: 'db-write',
      },
      {
        title: 'Query with filters and sorting',
        description:
          'MongoDB queries are expressed as objects. Mongoose translates them into efficient database operations. Indexes ensure lookups stay fast even with millions of documents.',
        code: 'const tasks = await Task.find({ userId })\n  .sort({ createdAt: -1 })\n  .limit(50);',
        stage: 'db-query',
      },
      {
        title: 'Indexes for performance',
        description:
          'Without an index, MongoDB scans every document. With an index, it jumps directly to matching records. The userId and createdAt fields are indexed in this system.',
        code: 'taskSchema.index({ createdAt: -1 });\n// Now sorting by date is O(log n) not O(n)',
        stage: 'index',
      },
      {
        title: 'Update and delete',
        description:
          'findOneAndUpdate combines the lookup and update in a single atomic database operation. The { new: true } option returns the updated document.',
        code: 'const updated = await Task.findOneAndUpdate(\n  { _id: id, userId },   // must match both\n  { status: "completed" },\n  { new: true }\n);',
        stage: 'db-update',
      },
    ],
    challenge: {
      instruction: 'Create 3 tasks on the Dashboard to complete this challenge.',
      hint: 'Login first, then use the task input on the Dashboard to add 3 tasks.',
      hintLink: '/dashboard',
      verify: (e) => e.eventType === 'database' && e.stage === 'db-write',
      successMessage: 'MongoDB write detected. Database operation confirmed.',
    },
    scenario: {
      question:
        'Your tasks collection has 2 million documents. A user requests all their tasks sorted by creation date. Which index makes this query fast?',
      options: [
        'An index on title (alphabetical)',
        'A compound index on { userId: 1, createdAt: -1 }',
        'No index needed — MongoDB is fast by default',
        'An index on _id only',
      ],
      correctIndex: 1,
      explanation:
        'A compound index on { userId: 1, createdAt: -1 } lets MongoDB filter by userId and sort by date in a single index scan — no document scanning needed. A single-field userId index helps filter but not sort. An _id index only helps lookups by ID. Without an index, MongoDB does a full collection scan, which is O(n) and very slow at scale.',
    },
  },
  {
    slug: 'rest-api',
    title: 'REST API',
    subtitle: 'HTTP endpoints, validation, and middleware chains',
    color: '#8b5cf6',
    icon: '🌐',
    recruiterLine:
      'The REST API is the backbone of the backend — it defines how the frontend communicates with the server. Each endpoint follows HTTP conventions, validates incoming data, and returns structured responses.',
    steps: [
      {
        title: 'Request arrives at the server',
        description:
          'Every HTTP request enters Express and passes through a middleware chain before reaching the route handler. Middleware can read, modify, or reject the request at any point.',
        code: 'POST /tasks HTTP/1.1\nAuthorization: Bearer <token>\nContent-Type: application/json\n\n{ "title": "New task" }',
        stage: 'request',
      },
      {
        title: 'Global middleware processes first',
        description:
          'Helmet sets security headers, CORS validates the origin, the rate limiter checks request frequency, and the Trace ID middleware tags the request with a unique ID for debugging.',
        code: 'app.use(helmet())         // security headers\napp.use(cors(...))        // origin check\napp.use(globalRateLimiter) // request throttle\napp.use(traceIdMiddleware) // X-Trace-ID header',
        stage: 'global-middleware',
      },
      {
        title: 'Auth middleware validates the JWT',
        description:
          'Protected routes require a valid Bearer token. The middleware decodes it and attaches the user payload to req.user — if the token is missing or invalid, the request is rejected immediately.',
        code: 'const token = req.headers.authorization.slice(7);\nconst payload = jwt.verify(token, JWT_SECRET);\nreq.user = payload; // available downstream',
        stage: 'auth-middleware',
      },
      {
        title: 'Zod validates the request body',
        description:
          'Before touching the database, the controller parses the request body against a Zod schema. Invalid data throws a ZodError, which the error handler catches and formats into a clear 400 response.',
        code: 'const schema = z.object({\n  title: z.string().min(1).max(200),\n  status: z.enum(["pending", "in_progress", "completed"]).optional()\n});\nconst body = schema.parse(req.body); // throws on invalid',
        stage: 'validation',
      },
      {
        title: 'Response is returned with standard format',
        description:
          'All responses follow the same shape — success flag, data, and traceId. This makes the API predictable and easy to debug. The Trace ID links this response back to every log entry for this request.',
        code: 'res.status(201).json({\n  success: true,\n  data: { task },\n  traceId: req.traceId\n});',
        stage: 'response',
      },
    ],
    challenge: {
      instruction: 'Trigger 5 API requests to complete this challenge. Login, create tasks, or navigate around the app.',
      hint: 'Any action that hits the backend counts — logging in, creating tasks, or visiting the API Monitor page.',
      hintLink: '/api-monitor',
      verify: (e) => e.eventType === 'api',
      successMessage: 'API request captured. REST endpoint activity confirmed.',
    },
    scenario: {
      question:
        'A client sends a POST request to /tasks with { "title": "" } — an empty string. Zod has min(1) on the title field. What should the API return?',
      options: [
        '200 OK with the task created',
        '400 Bad Request with validation error details',
        '422 Unprocessable Entity',
        '500 Internal Server Error',
      ],
      correctIndex: 1,
      explanation:
        '400 Bad Request is the correct status for invalid client input. Zod throws a ZodError which the error handler catches and formats into a structured 400 response with the field name and error message. 422 is technically valid but less common in REST APIs. 500 would mean an unhandled server crash — not a validation failure.',
    },
  },
  {
    slug: 'cloud-storage',
    title: 'Cloud Storage',
    subtitle: 'AWS S3 file uploads and pre-signed URLs',
    color: '#f59e0b',
    icon: '☁️',
    recruiterLine:
      'Files like images and documents are never stored on the application server — they go directly to AWS S3, Amazon\'s cloud object storage. The server handles the transfer and generates secure, time-limited URLs for access.',
    steps: [
      {
        title: 'Client sends the file',
        description:
          'The frontend sends a multipart/form-data request with the file attached. Multer intercepts it before it reaches the controller, reads the binary data into memory, and attaches it to req.file.',
        code: 'POST /upload\nContent-Type: multipart/form-data\n\n// file binary data + metadata',
        stage: 'request',
      },
      {
        title: 'Multer parses the upload',
        description:
          'Multer validates the file type and size limit before anything else. Allowed types are images, PDFs, and text files up to 10MB. The file is held in memory — never written to disk.',
        code: 'const upload = multer({\n  storage: memoryStorage(),\n  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB\n  fileFilter: allowedMimeTypes\n});',
        stage: 'multer',
      },
      {
        title: 'File is uploaded to S3',
        description:
          'The AWS SDK v3 sends the file to the S3 bucket. The key (file path) includes the user ID to namespace files by user — preventing one user from overwriting another\'s files.',
        code: 'const key = `uploads/${userId}/${uuid()}${ext}`;\nawait s3.send(new PutObjectCommand({\n  Bucket: S3_BUCKET,\n  Key: key,\n  Body: file.buffer,\n  ContentType: file.mimetype\n}));',
        stage: 's3-upload',
      },
      {
        title: 'Background job triggered',
        description:
          'After upload, a file processing job is added to the BullMQ queue. This decouples the upload response from any processing work — the user gets an instant response while the job runs asynchronously.',
        code: 'await fileProcessingQueue.add("process-file", {\n  fileKey: key,\n  userId,\n  traceId: req.traceId\n});',
        stage: 'queue',
      },
      {
        title: 'Pre-signed URL for access',
        description:
          'Files in S3 are private by default. To share a file, the server generates a pre-signed URL — a temporary signed link that expires after a set time. Only the server can generate these, so access is controlled.',
        code: 'const url = await getSignedUrl(\n  s3Client,\n  new GetObjectCommand({ Bucket, Key }),\n  { expiresIn: 3600 } // 1 hour\n);',
        stage: 'presigned',
      },
    ],
    challenge: {
      instruction: 'Trigger a simulated cloud upload event to complete this challenge.',
      hint: 'Go to the Console page and click "S3 Error" to simulate a cloud event, or upload a real file if S3 is configured.',
      hintLink: '/console',
      verify: (e) => e.eventType === 'cloud' || (e.eventType === 'error' && e.stage === 's3-upload'),
      successMessage: 'Cloud storage event detected. S3 interaction confirmed.',
    },
    scenario: {
      question:
        'A user requests a file using a pre-signed S3 URL that expired 30 minutes ago. What does AWS S3 return?',
      options: [
        '200 OK — S3 ignores expiry for known users',
        '404 Not Found — S3 treats expired URLs as missing',
        '403 Forbidden — the URL signature is no longer valid',
        '401 Unauthorized — the user must re-authenticate',
      ],
      correctIndex: 2,
      explanation:
        'AWS S3 returns 403 Forbidden for expired pre-signed URLs. The signature embedded in the URL includes the expiry timestamp — once past that time, the signature is cryptographically invalid and S3 rejects the request. This is by design: access is time-limited without needing to revoke individual tokens.',
    },
  },
  {
    slug: 'background-jobs',
    title: 'Background Jobs',
    subtitle: 'BullMQ queues, Redis, and async workers',
    color: '#ef4444',
    icon: '⚡',
    recruiterLine:
      'Some tasks take too long to run during an HTTP request — sending emails, processing files, or generating reports. Background jobs handle these asynchronously: the API responds immediately while a worker processes the task in the background.',
    steps: [
      {
        title: 'Producer adds a job to the queue',
        description:
          'The API controller adds a job to a BullMQ queue stored in Redis. The job contains all the data the worker will need. This returns immediately — the producer does not wait for the job to complete.',
        code: 'await emailQueue.add("send-email", {\n  to: "user@example.com",\n  subject: "Welcome!",\n  traceId: req.traceId\n});\n// API responds 201 instantly',
        stage: 'queue-producer',
      },
      {
        title: 'Redis stores the job',
        description:
          'BullMQ uses Redis as its backing store. Each job is serialized and stored as a hash in Redis with metadata: status (waiting, active, completed, failed), attempts, and timestamps.',
        code: '// Redis stores:\n// bull:email:1 = { data: {...}, attempts: 0, status: "waiting" }\n// bull:email:waiting = [1, 2, 3] (queue list)',
        stage: 'redis',
      },
      {
        title: 'Worker picks up the job',
        description:
          'A BullMQ Worker listens to the queue and picks up the next available job. Workers run concurrently — multiple jobs can process in parallel. The worker function receives the full job object.',
        code: 'new Worker("email", async (job) => {\n  console.log(`Processing job ${job.id}`);\n  await sendEmail(job.data);\n  // Job marked complete automatically\n}, { connection });',
        stage: 'worker',
      },
      {
        title: 'Job completion and retry logic',
        description:
          'If the worker throws an error, BullMQ automatically retries the job based on the configured backoff strategy. Failed jobs move to a dead-letter queue for inspection — nothing is silently lost.',
        code: 'new Queue("email", {\n  defaultJobOptions: {\n    attempts: 3,\n    backoff: { type: "exponential", delay: 2000 }\n  }\n});',
        stage: 'retry',
      },
      {
        title: 'Event emitted when complete',
        description:
          'When the worker finishes, the backend emits a job completion event. This appears in the Event Timeline and API Monitor — making the async process fully observable.',
        code: 'await eventService.log({\n  eventType: "job",\n  message: `Email sent to ${job.data.to}`,\n  stage: "email-worker",\n  meta: { jobId: job.id }\n});',
        stage: 'complete',
      },
    ],
    challenge: {
      instruction: 'Trigger an error simulation on the Console page to generate a background job event.',
      hint: 'Go to the Console page, make sure you are logged in, and click any simulation button.',
      hintLink: '/console',
      verify: (e) => e.eventType === 'job' || (e.eventType === 'error' && e.stage === 'queue-producer'),
      successMessage: 'Job event detected. Background processing activity confirmed.',
    },
    scenario: {
      question:
        'A BullMQ worker is processing a job and crashes halfway through due to an unhandled error. What happens to the job?',
      options: [
        'It is permanently lost — BullMQ does not retry failed jobs',
        'It moves back to the waiting queue and will be retried based on the configured attempts',
        'It stays in the active state forever until manually cleared',
        'Redis deletes it after 30 seconds',
      ],
      correctIndex: 1,
      explanation:
        'When a worker throws, BullMQ catches the error and moves the job to the failed state. If the job has remaining attempts (configured via defaultJobOptions.attempts), BullMQ re-queues it with optional exponential backoff delay. Only when all attempts are exhausted does it move to the dead-letter set — where it can be inspected and retried manually.',
    },
  },
  {
    slug: 'security',
    title: 'Security',
    subtitle: 'Rate limiting, headers, and input protection',
    color: '#06b6d4',
    icon: '🛡️',
    recruiterLine:
      'Backend security is not a single thing — it is a layered defence. This system uses Helmet.js for HTTP headers, rate limiting to prevent abuse, JWT for authentication, bcrypt for passwords, and Zod to reject malformed input before it reaches the database.',
    steps: [
      {
        title: 'Helmet sets secure HTTP headers',
        description:
          'Helmet automatically sets a dozen HTTP response headers that protect against common browser-based attacks like cross-site scripting (XSS), clickjacking, and MIME-type sniffing.',
        code: 'app.use(helmet());\n// Sets headers like:\n// X-Content-Type-Options: nosniff\n// X-Frame-Options: DENY\n// Strict-Transport-Security: max-age=...\n// Content-Security-Policy: ...',
        stage: 'helmet',
      },
      {
        title: 'Rate limiting prevents abuse',
        description:
          'express-rate-limit tracks requests per IP address in a time window. The global limiter allows 200 requests per 15 minutes. The auth limiter is stricter — 20 attempts per 15 minutes to prevent brute-force attacks.',
        code: 'const authLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 min\n  max: 20,                   // per IP\n  message: { error: "Too many attempts" }\n});\nrouter.post("/login", authLimiter, loginController);',
        stage: 'rate-limit',
      },
      {
        title: 'CORS restricts allowed origins',
        description:
          'Cross-Origin Resource Sharing prevents unauthorised websites from making requests to your API using a visitor\'s credentials. Only the configured frontend URL is allowed to send requests.',
        code: 'app.use(cors({\n  origin: (origin, cb) => {\n    const allowed = isLocalhost(origin) || origin === FRONTEND_URL;\n    cb(allowed ? null : new Error("CORS blocked"), allowed);\n  },\n  credentials: true\n}));',
        stage: 'cors',
      },
      {
        title: 'Passwords stored as bcrypt hashes',
        description:
          'Passwords are never stored in plain text. bcrypt applies a one-way hash with a salt and cost factor (12 rounds). Even if the database is compromised, the original passwords cannot be recovered.',
        code: '// On register:\nconst hash = await bcrypt.hash(password, 12);\nawait User.create({ email, password: hash });\n\n// On login:\nconst valid = await bcrypt.compare(plain, hash);\n// Cannot reverse hash to get plain text',
        stage: 'bcrypt',
      },
      {
        title: 'Zod blocks malformed input',
        description:
          'Every controller validates its input with Zod before anything reaches the database. This prevents SQL-style injection, oversized payloads, and unexpected field types from causing damage.',
        code: 'const schema = z.object({\n  email: z.string().email(),\n  password: z.string().min(8).max(100)\n});\n// Rejects: SQL strings, scripts, huge payloads\nconst body = schema.parse(req.body);',
        stage: 'validation',
      },
    ],
    challenge: {
      instruction: 'Trigger an error simulation on the Console page to complete this challenge.',
      hint: 'Go to the Console page, log in first, then click any of the simulation buttons.',
      hintLink: '/console',
      verify: (e) => e.eventType === 'error',
      successMessage: 'Error simulation event captured. Security layer activity confirmed.',
    },
    scenario: {
      question:
        'An attacker sends 1000 login requests per minute from a single IP address, trying different passwords. Which layer stops this first?',
      options: [
        'bcrypt — it is too slow to compute 1000 hashes per minute',
        'JWT — invalid tokens are rejected before bcrypt runs',
        'The auth rate limiter — it blocks the IP after 20 requests in 15 minutes',
        'MongoDB — it throttles read operations automatically',
      ],
      correctIndex: 2,
      explanation:
        'The auth rate limiter (express-rate-limit) is the first line of defence — it rejects the request entirely after 20 attempts from that IP in 15 minutes, returning 429 Too Many Requests. The request never reaches bcrypt or the database. bcrypt\'s slowness is a secondary defence — it makes brute force expensive, but rate limiting is faster and cheaper to enforce.',
    },
  },
];

export function getModule(slug: string): ModuleDef | undefined {
  return MODULES.find((m) => m.slug === slug);
}
