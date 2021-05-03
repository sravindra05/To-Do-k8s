from typing import Optional
from datetime import timedelta,datetime
import uuid

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from jose import JWTError, jwt
import pymongo
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

SECRET_KEY = "8346dc9f9086ea4f70a6f0b8192f435b9ce4fbde121a9816cbe04330a239fb9c"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

#MONGO_URL=os.environ["MONGO_URL"]
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["UserDB"]
user_collection = mydb["user"]
todo_collection = mydb["todo"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*','http://localhost:3000'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")

class User(BaseModel):
    username: str
    password: str

class Task(BaseModel):
    title: str
    description: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

def fetch_rows(collection,condition):
    result = collection.find(condition)
    result = list(result)
    return result

def get_user(db, username: str):
    res=fetch_rows(user_collection,{"username":username})
    if res:
        return res[0]

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not user["password"]==password:
        return False
    return user  

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(user_collection, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/api/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(user_collection, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/signup")
async def signup(data: User):
    res=fetch_rows(user_collection,{"username":data.username})
    if res:
        raise HTTPException(status_code=401, detail="Username already exists")
    user_collection.insert_one({"username":data.username,"password":data.password})
    
@app.get("/api/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    data={"username":current_user["username"]}
    return JSONResponse(content=data)

@app.get("/api/users/me/tasks")
async def read_users_tasks(current_user: User = Depends(get_current_user)):
    res=fetch_rows(todo_collection,{"username":current_user["username"]})
    val=[{"title":i["title"],"description":i["description"],"id":i["id"]} for i in res]
    return JSONResponse(content={"data":val})

@app.post("/api/users/me/tasks")
async def add_user_task(task: Task, current_user: User = Depends(get_current_user)):
    data={
        "username":current_user["username"],
        "title":task.title,
        "description":task.description,
        "id":str(uuid.uuid4())
    }
    db=todo_collection.insert_one(data)
    data.pop("_id")
    return JSONResponse(content={"data":data})

@app.delete("/api/users/me/tasks/{id}")
async def add_user_task(id, current_user: User = Depends(get_current_user)):
    todo_collection.delete_one({"id":id})
    return {}