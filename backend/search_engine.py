import sys, getopt, time

from elasticsearch import Elasticsearch
from pymongo import MongoClient, uri_parser
from pymongo.errors import ConnectionFailure

def search(es_object, index_name, search):
    result = es_object.search(index=index_name, body=search)

def main(argv):

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
        print("Server not available")
