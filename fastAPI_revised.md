# FastAPI Interview Questions - Organized by Priority

## CRITICAL/HIGHEST PRIORITY QUESTIONS

### 1. What is FastAPI, and what are its key features?
FastAPI is a modern, fast Python web framework (3.7+) used to build APIs based on standard Python type hints. It was created by Sebastian Ramirez in 2018.

Key features of FastAPI include:

**Automatic Data Validation**
- FastAPI uses Python type hints to validate request data
- When users send input to an API, FastAPI checks whether the data matches the expected format before executing business logic

**Asynchronous Request Handling**
- FastAPI supports async functions, which allow the server to process multiple requests at the same time without blocking execution

**Automatic API Documentation**
- FastAPI generates OpenAPI and Swagger documentation automatically when routes and models are defined

**Dependency Injection Support**
- It allows reusable logic such as authentication, database connections, and configuration handling

**Structured Error Handling**
- FastAPI returns clear validation and error responses, which help developers debug issues quickly

### 2. What is FastAPI & How is it Different from Flask or Django?
FastAPI is a Python framework built for building APIs. It runs on Starlette and uses Pydantic for data validation. It supports Python 3.7 and above.

**vs Flask:**
- FastAPI has automatic API documentation (OpenAPI/Swagger)
- Built-in data validation using Pydantic
- Async support by default
- Type hints for better IDE support and validation
- Requires third-party libraries for validation and documentation

**vs Django REST Framework:**
- FastAPI is lighter and more focused on APIs
- Better performance (one of the fastest Python frameworks)
- Simpler setup for API-only applications
- Built-in async support
- Django is a full-stack framework suited for web apps with ORM, authentication system, and admin interface

**vs Express.js (Node.js):**
- Comparable performance
- Automatic data validation and serialization
- Built-in documentation generation

FastAPI is generally chosen when performance, async support, and quick API development are priorities.

### 3. What is ASGI & Why Does FastAPI Rely on it?
ASGI stands for **Asynchronous Server Gateway Interface**. It allows Python web servers to handle async operations properly.

**ASGI vs WSGI:**
- WSGI (Web Server Gateway Interface): Supports synchronous request handling. Each request is processed one at a time, which can slow down applications handling many simultaneous requests. Frameworks like Flask and Django traditionally use WSGI.
- ASGI: Supports asynchronous communication. It allows servers to handle multiple requests concurrently using event-driven execution. ASGI also supports WebSockets and long-running connections.

**Why FastAPI uses ASGI:**
- FastAPI runs on Uvicorn, which is an ASGI server
- A single Uvicorn worker can manage thousands of concurrent connections
- FastAPI benchmarks rank it among the fastest Python frameworks available
- Allows high concurrency and real-time applications efficiently
- Improves performance in systems with frequent or simultaneous client requests

### 4. What is Pydantic, and why is it integral to FastAPI?
Pydantic is a Python library used for data validation and parsing using Python type hints. It allows developers to define structured data models using Python classes and type annotations.

**In FastAPI, Pydantic is used to:**
- Validate incoming request data
- Convert request data into Python objects
- Validate response models
- Generate API documentation schemas

When a developer defines a request model using Pydantic, FastAPI automatically checks whether the input matches the required fields and data types. If the validation fails, FastAPI returns an error response without executing the route logic.

Pydantic ensures data consistency and reduces manual validation code in FastAPI applications.

### 5. What is Dependency Injection in FastAPI, and how does it work?
Dependency Injection allows developers to reuse logic such as authentication, database connections, and configuration across multiple endpoints. Instead of writing the same setup code in every route, FastAPI allows dependencies to be defined separately and injected when required.

FastAPI uses the **Depends** function to manage dependencies.

**Example:**
```python
from fastapi import Depends, FastAPI

app = FastAPI()

def common_parameters():
   return {"limit": 10}

@app.get("/items/")
def read_items(params: dict = Depends(common_parameters)):
   return params
```

**Benefits:**
- Code reusability
- Easy testing
- Separation of concerns
- Loose coupling: Classes become less dependent on specific implementations, making them easier to test and reuse
- Dependency management: FastAPI's built-in dependency injection system handles the creation and management of dependencies

Dependency injection improves code reuse and simplifies application maintenance.

### 6. Explain async and await in FastAPI. When should you use async def vs def?
FastAPI supports asynchronous programming using **async** and **await**. These keywords allow the server to handle multiple requests without blocking execution.

**async def:**
- Used when route functions perform operations that involve waiting
- Suitable for database calls, API calls, or file operations
- Allows FastAPI to process other requests while waiting for a response
- Runs the route inside the event loop

**def (synchronous):**
- Used for synchronous operations
- Suitable when functions execute quickly and do not require waiting for external resources
- FastAPI offloads the function to a thread pool
- Works fine but slower than async for I/O operations

**When to use which:**
- Use `async def` when performing network requests, database operations, or long-running tasks
- Use `def` for simple calculations or immediate responses
- Using async functions improves performance in high-traffic applications
- The mistake is writing blocking code inside an async def route—that kills concurrency entirely

**Example:**
```python
@app.get("/users/")
async def get_users():
   users = await fetch_users_from_service()
   return users

@app.get("/status/")
def check_status():
   return {"status": "Running"}
```

### 7. What is the Difference Between Path Parameters and Query Parameters?
FastAPI uses parameters to receive data from client requests. Both are validated automatically against declared types.

**Path Parameters:**
- Part of the URL path itself
- Required by default
- Declared in the path string with {parameter_name}
- Example: /users/{user_id} → user_id is a path parameter
- Identify specific resources
- Extracted from the URL and validated

**Query Parameters:**
- Come after ? in the URL
- Optional by default (can be made required)
- Declared as function parameters
- Example: /users?skip=0&limit=10 → skip and limit are query parameters
- Used for filtering or optional input
- If the client does not provide a value, the default value is used

**Examples:**
```python
@app.get("/items/{item_id}")
def read_item(item_id: int):
   return {"item_id": item_id}

@app.get("/items/")
def read_items(limit: int = 10):
   return {"limit": limit}
```

Path parameters identify resources, while query parameters modify or filter responses.

### 8. How does FastAPI automatically generate OpenAPI (Swagger) documentation?
FastAPI generates API documentation by analyzing route definitions, request models, and response schemas. When developers define input and output models using type annotations and Pydantic classes, FastAPI uses this information to create OpenAPI specifications.

**Documentation interfaces provided:**
- **Swagger UI**: An interactive interface that allows developers to test API endpoints directly from the browser at /docs
- **ReDoc Interface**: A structured documentation view used for reading API details at /redoc

**How it works:**
- Both are built from OpenAPI specifications that FastAPI compiles from route definitions and Pydantic models
- Nothing extra needs to be configured
- Documentation is automatically updated when developers modify routes or data models
- Developers can test endpoints directly from the browser, which speeds up development considerably
- This reduces manual documentation effort and improves API testing and collaboration

---

## HIGH PRIORITY QUESTIONS

### 9. How do you handle errors and exceptions in FastAPI? Explain HTTPException
FastAPI provides built-in tools to handle runtime errors and validation failures. The most commonly used exception class is **HTTPException**.

**Example:**
```python
from fastapi import HTTPException

@app.get("/items/{item_id}")
def read_item(item_id: int):
   if item_id != 1:
       raise HTTPException(status_code=404, detail="Item not found")
   return {"item_id": item_id}
```

**Key points:**
- status_code defines the HTTP response code
- The detail provides an error message returned to the client
- FastAPI automatically converts exceptions into structured JSON responses

**Global Exception Handling:**
- Developers can also create global exception handlers for application-wide error handling
- Use `@app.exception_handler()` decorator
- Custom error messages can be added inside the Pydantic model

**What Happens When a Request Fails Validation:**
- FastAPI returns a 422 status code
- Response body is a structured JSON object
- It lists every field that failed, the location of the error, and the reason
- This is handled internally by Pydantic

### 10. How do you implement OAuth2 with JWT authentication in FastAPI?
OAuth2 with JWT is commonly used to secure APIs by verifying user identity and managing access permissions.

**Authentication process:**
1. User submits login credentials
2. Server validates credentials
3. Server generates a JWT token
4. Client sends the token with future requests
5. Server verifies the token before allowing access

**Example:**
```python
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from jose import JWTError, jwt
from passlib.context import CryptContext

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
   return {"token": token}

@app.get("/protected")
async def protected_route(current_user: str = Depends(get_current_user)):
    return {"user": current_user}
```

**In production applications:**
- JWT tokens store encoded user data
- Tokens are validated using secret keys
- Expiration time prevents unauthorized long-term access
- OAuth2 with JWT provides stateless authentication and improves API security

### 11. How do you implement WebSockets in FastAPI for real-time communication?
WebSockets allow continuous two-way communication between client and server. They are used in chat applications, live notifications, real-time dashboards, gaming applications, and live data feeds.

**Key difference from HTTP:**
- WebSockets maintain an open connection instead of sending separate HTTP requests
- This allows real-time data exchange and bidirectional communication

**Example:**
```python
from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
   await websocket.accept()
   try:
       while True:
           data = await websocket.receive_text()
           await websocket.send_text(f"Message received: {data}")
   except WebSocketDisconnect:
       print("Client disconnected")

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
   await websocket.accept()
   # Handle client-specific logic
```

**Best practices for WebSocket development:**
- Error handling: Implement proper error handling mechanisms to prevent unexpected behavior
- Scalability: Consider using libraries like websockets or asgi-redis for handling large numbers of concurrent WebSocket connections
- Security: Protect against vulnerabilities like XSS and CSRF

### 12. What are Background Tasks in FastAPI, and when should you use them?
Background tasks allow certain operations to run after sending a response to the client. This prevents delays in API response time.

**Use cases:**
- Sending emails
- Logging events
- Processing uploaded files
- Generating reports
- Processing large datasets
- Triggering periodic updates

**Example:**
```python
from fastapi import BackgroundTasks

def write_log(message: str):
   with open("log.txt", "a") as file:
       file.write(message)

@app.post("/notify/")
def send_notification(background_tasks: BackgroundTasks):
   background_tasks.add_task(write_log, "Notification sent")
   return {"message": "Task scheduled"}

# Multiple background tasks
@app.post("/process-items/")
async def process_items(background_tasks: BackgroundTasks):
    background_tasks.add_task(task_one, "arg1")
    background_tasks.add_task(task_two, "arg2", keyword="value")
    return {"message": "Tasks started"}
```

**Best practices for managing background tasks:**
- Error handling: Implement proper error handling mechanisms to ensure background tasks are retried if they fail
- Task prioritization: If multiple background tasks are running, consider implementing a priority system
- Task monitoring: Use tools or libraries to monitor the status of background tasks and track their progress
- Background tasks improve user experience by handling time-consuming operations separately

### 13. How do you deploy a FastAPI application with Docker and Uvicorn/Gunicorn?
FastAPI applications are typically deployed using ASGI servers such as Uvicorn or Gunicorn combined with Uvicorn workers. Docker is used to containerize the application and ensure consistent deployment.

**Example Dockerfile:**
```dockerfile
FROM python:3.10

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
```

**For production environments, Gunicorn is often used with Uvicorn workers:**
```
gunicorn main:app -k uvicorn.workers.UvicornWorker
```

**Deployment benefits:**
- Consistent environment setup
- Easy scaling using containers
- Simplified CI/CD integration

**Production deployment stack:**
- Uvicorn as the ASGI server
- Gunicorn manages multiple Uvicorn workers across CPU cores
- Docker containerizes the application
- Nginx typically sits at the front to handle SSL termination and route traffic
- Kubernetes manages container instances across multiple machines for scaling

**Key Considerations:**
- Environment variables for configuration
- Database connections
- Static file serving
- HTTPS/SSL certificates
- Load balancing

### 14. How do you implement rate limiting and request throttling in FastAPI?
Rate limiting controls how many requests a client can send within a specific time period. It prevents server overload, protects APIs from abuse, and improves service stability.

**Implementation:**
FastAPI does not include built-in rate limiting, but it can be implemented using middleware or third-party libraries such as slowapi.

**Example using SlowAPI:**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/items")
@limiter.limit("5/minute")
async def get_items():
   return {"message": "Rate limited endpoint"}
```

**Common rate-limiting strategies:**
- Limiting requests per IP address
- Limiting requests per authenticated user
- Using Redis or caching systems to track request counts

**Alternative approach:**
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

@app.get("/limited")
@limiter.limit("5/minute")
async def limited_endpoint(request: Request):
    return {"message": "This endpoint is rate limited"}
```

Rate limiting helps maintain API reliability and protects backend resources.

### 15. How do you write tests for FastAPI applications using TestClient?
FastAPI provides a **TestClient** class that allows developers to test endpoints without running the server.

**Example:**
```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_read_root():
   response = client.get("/")
   assert response.status_code == 200
   assert response.json() == {"message": "Hello World"}

def test_create_item():
    response = client.post(
        "/items/",
        json={"name": "Foo", "price": 50.5}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Foo"

# Testing with authentication
def test_protected_endpoint():
    headers = {"Authorization": "Bearer valid-token"}
    response = client.get("/protected", headers=headers)
    assert response.status_code == 200
```

**Key points:**
- TestClient simulates HTTP requests
- Tests verify response status codes and output data
- It helps developers validate API behavior during development
- Testing ensures APIs behave correctly and prevents bugs in production deployments

**Best practices for testing FastAPI applications:**
- Test coverage: Aim for high test coverage to ensure all parts of code are thoroughly tested
- Test isolation: Write tests that are independent of each other to avoid unexpected interactions
- Test automation: Use tools like pytest to automate the running of tests
- Continuous integration: Integrate tests into continuous integration pipeline to automatically run with every code change
- Quality assurance: Ensures API code is reliable and works as expected
- Error prevention: Helps identify and fix bugs before deployment
- Regression testing: Verifies that changes don't introduce new bugs
- Documentation: Test cases can serve as documentation for API's behavior

### 16. How do you implement CORS (Cross-Origin Resource Sharing) in FastAPI?
CORS allows a frontend application running on one domain to access an API hosted on another domain. Without CORS configuration, browsers block cross-domain requests.

**FastAPI supports CORS using CORSMiddleware:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
   CORSMiddleware,
   allow_origins=["*"],
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)
```

**Configuration options:**
- `allow_origins`: Defines which domains can access the API
- `allow_methods`: Controls allowed HTTP methods
- `allow_headers`: Allows specific headers
- `allow_credentials`: Whether to allow credentials in requests

**Production example:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://mydomain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

CORS configuration is important when connecting frontend applications with backend APIs.

### 17. What is middleware in FastAPI and how do you create custom middleware?
Middleware is code that runs before or after every request. It is used for logging, authentication checks, request tracking, and response modification.

**Common Use Cases:**
- Authentication
- Logging
- CORS handling
- Request/Response modification
- Performance monitoring

**Custom middleware using @app.middleware decorator:**
```python
from fastapi import Request
import time

@app.middleware("http")
async def log_request_time(request: Request, call_next):
   start_time = time.time()
   response = await call_next(request)
   process_time = time.time() - start_time
   response.headers["X-Process-Time"] = str(process_time)
   return response
```

**Explanation:**
- The middleware runs before and after each request
- `call_next()` forwards the request to the endpoint
- The middleware modifies the response headers
- Middleware is useful for monitoring and cross-cutting application logic

Middleware is useful for monitoring and cross-cutting application logic.

### 18. How do you connect FastAPI with a database using SQLAlchemy?
SQLAlchemy is commonly used as an ORM (Object Relational Mapper) to interact with databases in FastAPI applications.

**Basic steps include:**
1. Create a database engine and session
2. Define database models
3. Use dependency injection to manage database sessions
4. Perform CRUD operations inside route functions

**Example:**
```python
from sqlalchemy.orm import Session
from fastapi import Depends

def get_db():
   db = SessionLocal()
   try:
       yield db
   finally:
       db.close()

@app.get("/users/")
def get_users(db: Session = Depends(get_db)):
   return db.query(User).all()
```

**Key points:**
- `get_db()` manages the database session lifecycle
- The session is injected using Depends
- The ORM handles database queries using Python objects
- Database connections can be managed using dependency injection
- Define a dependency that yields a database session

### 19. How do you handle database migrations in FastAPI using Alembic?
Alembic is a database migration tool used with SQLAlchemy to manage schema changes. It allows developers to update the database structure without losing existing data.

**Migration process involves:**
1. Install and initialize Alembic
2. Configure database connection
3. Generate migration scripts
4. Apply migration to the database

**Common commands:**
```
alembic init alembic
alembic revision --autogenerate -m "Create tables"
alembic upgrade head
```

**Key points:**
- Alembic tracks schema versions
- Ensures database changes remain consistent across development and production environments
- Allows developers to version-control database schema changes
- Enables rollback of database changes if needed

### 20. Explain APIRouter and how to structure a large FastAPI application
APIRouter helps organize routes into separate modules. It is used when applications grow large and contain multiple endpoints.

**Example:**
```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/items")
def get_items():
   return {"items": []}

# Include in main app
app.include_router(router)
```

**Using APIRouter helps:**
- Separate functionality into modules
- Improve code readability
- Support team-based development
- Simplify maintenance

**Large FastAPI applications structure:**
```
app/
├── main.py
├── models/
│   ├── __init__.py
│   └── user.py
├── routers/
│   ├── __init__.py
│   ├── users.py
│   └── items.py
├── dependencies/
│   ├── __init__.py
│   └── auth.py
└── tests/
    ├── __init__.py
    └── test_main.py
```

Large FastAPI applications are usually structured with folders for routers, models, database logic, and services.

---

## MEDIUM PRIORITY QUESTIONS

### 21. What is Starlette, and how does FastAPI build upon it?
Starlette is a lightweight ASGI framework used for building asynchronous web services. It provides core web features such as routing, middleware support, request handling, and WebSocket communication.

**Starlette handles:**
- HTTP request routing
- Middleware execution
- Background task management
- WebSocket support

**How FastAPI builds on Starlette:**
- FastAPI uses Starlette as its foundation
- FastAPI adds higher-level features such as data validation, dependency injection, and automatic API documentation
- This allows developers to use Starlette's performance while working with structured API development tools

### 22. Explain how to implement custom request validation and serialization beyond Pydantic defaults
Pydantic handles most validation tasks, but advanced applications may require custom validation logic. FastAPI allows developers to extend validation using custom validators and serialization rules.

**Example:**
```python
from pydantic import BaseModel, validator

class User(BaseModel):
   username: str
   password: str

   @validator("password")
   def password_length(cls, value):
       if len(value) < 8:
           raise ValueError("Password must be at least 8 characters long")
       return value
```

**Custom validation is useful when:**
- Business rules require complex validation logic
- Input data must be transformed before processing
- Security checks must be enforced

**Custom response serialization:**
Developers can create custom response serialization by modifying output data before returning it from endpoints.

### 23. How do you design FastAPI microservices and handle inter-service communication?
FastAPI is commonly used to build microservices where each service handles a specific business function. Microservice architecture separates applications into independent services that communicate through APIs or messaging systems.

**Design considerations include:**
- Independent service deployment
- Separate databases for each service
- Clear API contracts between services
- Centralized authentication and logging

**Communication methods include:**

**REST APIs:**
- Services communicate using HTTP endpoints

**Message Queues:**
- Tools like RabbitMQ or Kafka enable asynchronous communication

**Service Discovery:**
- Allows services to locate each other dynamically

Microservices improve scalability and allow teams to develop and deploy services independently.

### 24. What strategies do you use for caching in FastAPI applications?
Caching reduces repeated database or external API calls by storing frequently requested data. This improves performance and reduces server load.

**Common caching strategies include:**

**In-Memory Caching:**
- Stores data in application memory
- Suitable for small datasets
- Example: Python dictionaries or cache libraries

**Redis Caching:**
- Stores cached data in a separate service
- Supports distributed applications
- Commonly used in production environments

**Response Caching:**
- Stores full API responses
- Reduces processing time for repeated requests

**Example using Redis-based caching:**
```python
import aioredis

redis = await aioredis.from_url("redis://localhost")

async def get_cached_data(key):
   return await redis.get(key)
```

**Performance optimization:**
```python
from functools import lru_cache

@lru_cache()
def get_settings():
    return Settings()
```

Caching improves application speed and reduces infrastructure cost.

### 25. Explain lifespan events (startup/shutdown) in FastAPI and their use cases
Lifespan events allow developers to execute code when the application starts or stops. They are useful for managing resources that must be initialized or cleaned up during application lifecycle.

**Example:**
```python
from fastapi import FastAPI

app = FastAPI()

@app.on_event("startup")
async def startup_event():
   print("Application started")

@app.on_event("shutdown")
async def shutdown_event():
   print("Application stopped")
```

**Common use cases include:**
- Opening database connections
- Loading machine learning models
- Initializing cache or message queues
- Closing resources during shutdown

Lifespan events help manage application resources efficiently.

### 26. How do you handle form data and file uploads in FastAPI?
FastAPI supports form data and file uploads using special classes.

**Handling Form Data:**
```python
from fastapi import Form

@app.post("/login/")
def login(username: str = Form(...), password: str = Form(...)):
   return {"username": username}
```

Form(...) indicates that the input is received as form data.

**Handling File Uploads:**
```python
from fastapi import UploadFile, File

@app.post("/upload/")
def upload_file(file: UploadFile = File(...)):
   return {"filename": file.filename}

# Large file uploads
from fastapi.responses import StreamingResponse

@app.post("/upload/")
async def upload_large_file(file: UploadFile = File(...)):
    async def iterfile():
        yield from file.file
    return StreamingResponse(iterfile(), media_type="application/octet-stream")
```

UploadFile allows efficient file handling and supports streaming large files.

### 27. What is the purpose of response_model in FastAPI path operations?
The response_model defines the structure of the data returned by an API. It ensures that responses follow a specific format and hides unnecessary fields.

**Example:**
```python
class ItemResponse(BaseModel):
   name: str
   price: float

@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int):
   return {"name": "Laptop", "price": 50000, "internal_code": "XYZ"}
```

In this case, the response will only include fields defined in ItemResponse. The internal_code field is excluded.

**Response model with list:**
```python
from typing import List

@app.get("/items/", response_model=List[ItemResponse])
def read_items():
    return items
```

The response_model improves data consistency, security, and API documentation accuracy.

### 28. Explain the different HTTP methods (GET, POST, PUT, DELETE, PATCH) and their usage in FastAPI

**HTTP methods define the type of operation performed on resources:**

**GET:**
- Retrieves data from the server
- Used to fetch records or resources

**POST:**
- Creates new data
- Used when adding new entries or records

**PUT:**
- Updates an entire resource
- Used when replacing existing data completely

**PATCH:**
- Updates part of a resource
- Used when modifying specific fields

**DELETE:**
- Removes a resource
- Used when deleting records

FastAPI provides decorators such as @app.get(), @app.post(), and @app.put() to define these operations.

### 29. How do you define request body using Pydantic models?
FastAPI uses Pydantic models to define the request body structure. Pydantic ensures that input data follows the required format.

**Example:**
```python
from pydantic import BaseModel

class Item(BaseModel):
   name: str
   price: float
   in_stock: bool

@app.post("/items/")
def create_item(item: Item):
   return item
```

**Explanation:**
- BaseModel is used to create a request model
- FastAPI validates request data automatically
- The input is converted into a Python object
- If the client sends incorrect data, FastAPI returns a validation error

### 30. How do you create a basic FastAPI application with a GET endpoint?
A basic FastAPI application starts by importing the FastAPI class, creating an application instance, and defining route functions.

**Example:**
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
   return {"message": "Hello World"}
```

**Explanation:**
- `FastAPI()` creates the application object
- `@app.get("/")` defines a GET endpoint
- The function returns a JSON response

This structure creates a simple API endpoint that returns data when a client sends a GET request.

### 31. How do you structure a FastAPI project?
A typical FastAPI project structure includes separate modules for routes, models, and services.

**Example structure:**
```
- app/
  - main.py
  - routes/
  - models/
  - services/
```

**Best practices for development:**
- Use type hints consistently
- Implement proper error handling
- Use Pydantic models for data validation
- Organize code with routers
- Write comprehensive tests
- Use environment variables for configuration
- Implement logging
- Use dependency injection for reusable components

### 32. How do you handle global dependencies in FastAPI?
Global dependencies can be applied across multiple routes by adding them to the dependencies argument when creating the FastAPI instance.

**Example:**
```python
app = FastAPI(dependencies=[Depends(common_dependency)])
```

### 33. What are asynchronous dependencies, and how can you define them in FastAPI?
Asynchronous dependencies are defined with async def and can be injected using Depends() like regular dependencies. These are useful for async I/O operations such as database queries.

### 34. How can you optimize the performance of FastAPI?
Performance optimizations can include:
- Using asynchronous endpoints for I/O-bound operations
- Caching responses
- Using efficient middleware
- Employing load balancers like Nginx or Traefik

**Performance tips:**
```python
# Use async for I/O operations
@app.get("/async-endpoint")
async def async_endpoint():
    data = await fetch_data_from_database()
    return data

# Use background tasks for non-critical operations
@app.post("/process-data")
async def process_data(background_tasks: BackgroundTasks):
    background_tasks.add_task(heavy_processing_task)
    return {"status": "processing started"}
```

**Scalability Strategies:**
- Horizontal Scaling: Multiple instances behind a load balancer
- Database Optimization: Connection pooling, query optimization
- Caching: Redis, Memcached for frequently accessed data
- CDN: Content delivery networks for static assets
- Monitoring: Application performance monitoring (APM)

---

## LOWER PRIORITY QUESTIONS

### 35. Explain the concept of asynchronous programming in Python
Asynchronous programming allows multiple tasks to run concurrently without blocking each other. In Python, it's implemented using coroutines and event loops.

### 36. How does FastAPI leverage asynchronous programming for performance?
FastAPI uses the uvicorn ASGI server, which is inherently asynchronous. This allows it to handle multiple requests concurrently without blocking the main thread, improving performance and scalability.

### 37. What are the benefits of using asynchronous programming in FastAPI?
- Improved performance: Handles more concurrent requests without blocking
- Non-blocking I/O: Efficiently handles operations like database queries and network requests
- Better scalability: Can handle higher loads without additional resources

### 38. How does FastAPI handle requests and responses?
FastAPI uses ASGI (Asynchronous Server Gateway Interface) to handle requests asynchronously:

- Request Processing: Incoming requests are parsed and validated against type hints
- Path Operation: Routes requests to appropriate path operation functions
- Dependency Injection: Resolves dependencies before executing the handler
- Data Validation: Automatically validates request data using Pydantic models
- Response Generation: Serializes response data and generates appropriate HTTP responses

### 39. What are benefits of using FastAPI?
- High Performance: Comparable to Node.js and Go
- Fast Development: Reduces development time by 200–300%
- Fewer Bugs: Reduces human-induced errors by ~40%
- Intuitive: Great editor support with autocompletion
- Easy: Designed to be easy to learn and use
- Short: Minimize code duplication
- Robust: Production-ready code with automatic documentation
- Standards-based: Based on OpenAPI and JSON Schema
- Async Support: Native async/await support

### 40. How do you implement pagination in FastAPI?
Pagination is typically implemented by accepting limit and skip query parameters and returning a subset of the data:

```python
@app.get("/items/")
def get_items(skip: int = 0, limit: int = 10):
    return items[skip : skip + limit]
```

### 41. How do you upload files in FastAPI?
You can upload files using the File and UploadFile classes:

```python
from fastapi import File, UploadFile

@app.post("/uploadfile/")
def upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename}
```

### 42. What is the purpose of Depends() in FastAPI?
Depends() is used to declare dependencies for your path operations. It allows you to reuse logic such as database connections, authentication, etc.

### 43. How can you validate a specific field in a Pydantic model?
You can use Pydantic validators to validate fields:

```python
from pydantic import BaseModel, validator

class Item(BaseModel):
    name: str
    price: float

    @validator('price')
    def price_must_be_positive(cls, value):
        if value <= 0:
            raise ValueError("Price must be positive")
        return value
```

### 44. What are request and response objects in FastAPI?
The request object represents the incoming HTTP request, and the response object represents the outgoing HTTP response.

```python
from fastapi import Request, Response

@app.get("/custom-response/")
def custom_response(request: Request, response: Response):
    response.headers["X-Custom-Header"] = "Custom value"
    return {"message": "Custom response"}
```

### 45. How do you handle multiple query parameters in FastAPI?
You can handle multiple query parameters by defining them as function arguments. FastAPI will automatically parse and validate them:

```python
@app.get("/items/")
def read_items(q: str = None, limit: int = 10):
    return {"q": q, "limit": limit}
```

### 46. What is the difference between @app.get() and @app.post() in FastAPI?
- @app.get() handles HTTP GET requests, typically used to retrieve data
- @app.post() handles HTTP POST requests, used to submit data to the server

### 47. How can you customize exception handling in FastAPI?
FastAPI allows custom exception handling using @app.exception_handler() decorator:

```python
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(status_code=422, content={"detail": str(exc)})
```

### 48. How do you handle exceptions globally in FastAPI?
Global exception handling can be achieved using custom exception classes and @app.exception_handler():

```python
from fastapi import HTTPException
from fastapi.responses import JSONResponse

class CustomException(Exception):
    def __init__(self, name: str):
        self.name = name

@app.exception_handler(CustomException)
def custom_exception_handler(request, exc: CustomException):
    return JSONResponse(status_code=418, content={"message": f"Custom Exception: {exc.name}"})
```

### 49. How do you handle request validation errors in FastAPI?
FastAPI automatically handles request validation errors and returns a detailed error message with a 422 status code when input data doesn't conform to the defined Pydantic model.

### 50. Is FastAPI good for beginners?
Yes, FastAPI is approachable for anyone who knows Python basics. Type hints and automatic validation reduce boilerplate, which helps beginners write cleaner code from the start.

---

## FREQUENTLY ASKED QUESTIONS (FAQs)

### 51. What is FastAPI used for?
FastAPI is used to build REST APIs with Python. It is a popular choice for backend development, ML model serving, and microservices where speed and documentation matter.

### 52. Is FastAPI better than Flask?
FastAPI handles async requests natively and generates documentation automatically. Flask works well for simpler projects where those features are not needed.

### 53. What Python version does FastAPI require?
FastAPI requires Python 3.7 or higher. Most teams today run Python 3.10 or 3.11 in production.

### 54. What server does FastAPI run on?
FastAPI runs on Uvicorn. Gunicorn is added in production to manage multiple Uvicorn workers across available CPU cores.

