import sys, getopt, json

# it is recommended that Elasticsearch version 7.10.0 is used. Tests were made using this.

from elasticsearch import Elasticsearch
from pymongo import MongoClient, uri_parser
from pymongo.errors import ConnectionFailure
from bson import json_util

def index(es_object=Elasticsearch(), index_name="proconnect-index", doc_type="proconnect-page", id=0, document={}):
    # the official index to be returned
    res = es_object.index(index=index_name, doc_type=doc_type, id=id, body=document)
    return res['result']

def search(es_object=Elasticsearch(), index_name="proconnect-index", query={'query': {'match': {}}}):
    res = es_object.search(index=index_name, body=query)
    return res['_source']['FirstName']['LastName']

def main(arg):

    proconnect_uri = "mongodb+srv://user:OkfGMkxHXu1FouKu@cluster0.jtm8k.mongodb.net/proconnect?retryWrites=true&w=majority"

    try:
        client = MongoClient(proconnect_uri)

    except uri_parser.parser_uri(uri, warn=False):
        print("Invalid MongoDB URI")
        sys.exit(2)

    except getopt.GetoptError:
        print('usage: search_engine.py <option; -u is recommended> <argument 1, argument 2...>')
        sys.exit(0)

    es = Elasticsearch()

    # checks if the index exists just in case
    if es.indices.exists(index='proconnect-index'):
        es.indices.delete(index='proconnect-index', ignore=[400, 404])

    es.indices.create(index='proconnect-index', ignore=400)

    db = client['proconnect']
    users_col = db['users']

    # Get a Python list of all the documents in the "users" collection
    users_col_list = users_col.find({}, {"_id": 0, "FirstName": 1, "LastName": 1})

    print("=================================")
    print("users_col.find() processed")
    print("=================================")

    """
    {"_id": 0, "FirstName": 1, "LastName": 1, "Description": 1,
        "Email": 0, "PhoneNumber": 0, "Resume": 0, "Title": 1, "Links": 0,
        "Skills": 1, "Experience": 0, "HourlyRate": 0, "TotalProjects": 0, "EnglishLevel": 0,
        "Availability": 0, "Bio": 0, "DetailedDescription": 0, "Username": 0, "Password": 0,
        "Image": 0}
    """

    # Used for converting BSON documents to JSON format for Elasticsearch indexing and searching
    users_col_list_json = []

    # Use bson.json_utils.dumps() for BSON-JSON conversions
    for document in users_col_list:
        json_dump = json_util.dumps(document)
        users_col_list_json.append(json_dump)

    print("=================================")
    print("users_col_list_json processed")
    print("=================================")

    #
    for document in users_col_list_json:
        res=index(es, id=users_col_list_json.index(document), document=document)
        print(res)

    print("=================================")
    print("All documents indexed")
    print("=================================")

    search_query = ""
    #firstname = ""
    lastname = ""

    # check for a space in the query
    space_index = arg.find(" ")

    #if there's none, leave it and store in "search_query"
    if not space_index:
        search_query = arg

        result = search(es, query={"query": {
            "match_all": {}
            }
        })

        print("=================================")
        print("Search complete")
        print("=================================")
        # Delete index 'proconnect-index' to clear up memory after search is done, so to not waste memory
        es.indices.delete(index='proconnect-index', ignore=[400, 404])
        print(result)

    #otherwise, assume its a name and split the arg
    else:
        #firstname = arg[0:space_index]
        lastname = arg[space_index:len(arg)]

        result = search(es, query={"query":
            {
                "match": {
                    "LastName": lastname
                }
            }
        })

        print("=================================")
        print("Search complete")
        print("=================================")

        es.indices.delete(index='proconnect-index', ignore=[400, 404])
        print(result)


if __name__ == "__main__":
    # sys.argv[1] is for the query the user has inputted in the search bar
    if len(sys.argv) == 1:
        print("No query is provided. Exiting...")
        sys.exit(1)

    main(sys.argv[1])
