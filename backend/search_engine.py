import elasticsearch
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

es = Elasticsearch()
URI = "mongodb+srv://user:OkfGMkxHXu1FouKu@cluster0.jtm8k.mongodb.net/proconnect?retryWrites=true&w=majority"
client = MongoClient(URI)

# FOR TESTING:
##

try:
    client.admin.command()
except ConnectionFailure:
    print("Server not available")
