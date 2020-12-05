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

def search(es_object=Elasticsearch(), index_name="proconnect-index", query={'query': {'match': {}}}, isName=True):
    res = es_object.search(index=index_name, body=query)

    if isName == False:
        title_array = []
        res_hits_index = 0

        while res_hits_index < len(res['hits']['hits']):
            title_array.append("" + res['hits']['hits'][res_hits_index]['_source'])

        return title_array

    else:
        name_array = []
        res_hits_index = 0

        while res_hits_index < len(res['hits']['hits']):
            name_array.append("" + res['hits']['hits'][res_hits_index]['_source']['FirstName'] + " " + res['hits']['hits'][res_hits_index]['_source']['LastName'])
            res_hits_index+=1

        return name_array

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

    es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

    # checks if the index exists just in case
    if es.indices.exists(index='proconnect-index'):
        es.indices.delete(index='proconnect-index', ignore=[400, 404])

        print("=================================")
        print("Index 'proconnect-index' deleted")
        print("=================================")

    es.indices.create(index='proconnect-index', ignore=400)

    print("=================================")
    print("Index 'proconnect-index' created")
    print("=================================")

    db = client['proconnect']
    users_col = db['users']

    # Get a Python list of all the documents in the "users" collection
    users_col_list = users_col.find({}, {"_id": 0, "FirstName": 1, "LastName": 1, "Title": 1, "Skills": 1})

    print("=================================")
    print("users_col.find() processed")
    print("=================================")

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

    search_query = arg
    firstname = ""
    lastname = ""

    # check for a space in the query
    space_index = " " in search_query

    #if there's none, leave it and store in "search_query"
    if not space_index:
        results = search(es, query={"query": {
                "bool": {
                    "should": [
                        {
                            "match": {
                                "Title": search_query
                            }
                        },
                        {
                            "match": {
                                "Skills": search_query
                            }
                        },
                    ]
                }
            }
        }, isName=False)

        print("=================================")
        print("Search complete")
        print("=================================")
        # Delete index 'proconnect-index' to clear up memory after search is done, so to not waste memory
        es.indices.delete(index='proconnect-index', ignore=[400, 404])
        print(results)

    #otherwise, assume its a name and split the arg
    else:
        firstname = arg[0:space_index]
        lastname = arg[space_index:len(arg)]

        results = search(es, query={"query": {
                "bool": {
                    "should": [
                        {
                            "match": {
                                "FirstName": firstname
                            }
                        },
                        {
                            "match": {
                                "LastName": lastname
                            }
                        },
                    ]
                }
            }
        })

        print("=================================")
        print("Search complete")
        print("=================================")

        es.indices.delete(index='proconnect-index', ignore=[400, 404])
        print(results)


if __name__ == "__main__":
    # sys.argv[1] is for the query the user has inputted in the search bar
    if len(sys.argv) == 1:
        print("No query is provided. Exiting...")
        sys.exit(1)

    main(sys.argv[1])
