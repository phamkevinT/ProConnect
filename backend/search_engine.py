import elasticsearch
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

def mongo_search(mongo_search_function):
    pass

def main(argv):

    es = Elasticsearch()
    URI = "mongodb+srv://user:OkfGMkxHXu1FouKu@cluster0.jtm8k.mongodb.net/proconnect?retryWrites=true&w=majority"
    client = MongoClient(URI)

    # FOR TESTING:
    ##

    client.



if __name__ == "__main__":

    try:
        client.admin.command()
        main(sys.argv[1:])
    except ConnectionFailure:
        print("Server not available")
