import js
import sys #, getopt, time

from elasticsearch import Elasticsearch
# from pymongo import MongoClient, uri_parser
# from pymongo.errors import ConnectionFailure

def index(es_object=Elasticsearch(), index="search-index", document={}):
    # the official index to be returned
    res = es_object.index(index=index, id=1, body=document)
    return res['result']

def search(es_object=Elasticsearch(), index_name="search-index", query={'query': {'match': {}}}):
    res = es_object.search(index=index_name, body=query)
    return res['_source']['hits']['values']

if __name__ == "__main__":
    search_query = js.callback()
    es = Elasticsearch([{'host': 'localhost', 'port': 4000}])

    # tests if Elasticsearch client connects to localhost:4000, our page for MongoDB API
    if es.ping():
        print("Elasticsearch has connected to localhost:4000")
    else:
        print("Error: Elasticsearch did not connect")

    indexer = index(es)
    searcher = search(es)

"""def main(argv):

    es = Elasticsearch()
    uri = argv[1]

    try:
        client = MongoClient(uri)

    except uri_parser.parser_uri(uri, warn=False):
        print("Invalid MongoDB URI")
        sys.exit(2)

    except getopt.GetoptError:
        print('usage: search_engine.py <argument 1, argument 2...>')
        sys.exit(2)

if __name__ == "__main__":

    try:
        main(sys.argv[1:])
    except ConnectionFailure:
        print("Server not available")"""
