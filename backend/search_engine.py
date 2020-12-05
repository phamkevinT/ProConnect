import sys, getopt, time

from Elasticsearch import elasticsearch
from pymongo import MongoClient, uri_parser
from pymongo.errors import ConnectionFailure

def mongo_search(mongo_search_function):
    pass

def main(argv):

    es = ElasticSearch()
    uri = argv[2]

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
