import requests
import ast
from datetime import datetime
import re
import os
from dotenv import load_dotenv

load_dotenv()

core_name = os.getenv('SOLR_CORE')
solr_url = os.getenv('SOLR_URL')
query_url = f'{solr_url}/{core_name}/select'

def search_solr(query, rows = 50000, startDate = None, endDate = None, sort_field = None, sort_order = None, brand = None, sources = None, polarity = None):
    # Construct the query parameters
    if len(query.split(':')) == 1:
        query = f'comment:{query}'
    
    if len(query.split(':')) != 2:
        return None
    
    params = {
        'q': query,
        'defType': 'edismax',
        'qf': 'comment',
        'bf': 'product(log(sum(likes,1)),recip(ms(NOW,timestamp),3.16e-11,1,1))',        
        'fl': '*,score',
        'rows': rows,
        'fq': []
    }
    
    if sort_field is not None and sort_order is not None:
        params['sort'] = f'{sort_field} {sort_order}'

    if startDate is not None and endDate is not None:
        params['fq'].append(f'timestamp:[{startDate} TO {endDate}]')

    if brand is not None:
        params['fq'].append(f'brand:{brand}')
    
    if sources is not None and len(sources) > 0:
        params['fq'].append('source:(' + '+OR+'.join(sources) + ')')
    
    if polarity is not None:
        polarity = polarity.lower()
        if polarity == 'positive':
            params['fq'].append('subjectivity:true')
            params['fq'].append('polarity:true')
        elif polarity == 'negative':
            params['fq'].append('subjectivity:true')
            params['fq'].append('polarity:false')
        elif polarity == 'neutral':
            params['fq'].append('subjectivity:false')
        

    try:
        # Send GET request to Solr
        response = requests.get(query_url, params=params)
        response.raise_for_status()  # Raise an exception for any HTTP error
        solr_data = response.json()  # Parse response JSON
        solr_data = solr_data['response']['docs']
        return solr_data
    except requests.RequestException as e:
        print('Error querying Solr:', e)
        return None

if __name__ == '__main__':
    # Example usage: Perform a search query and process the response
    search_term = 'brand:Zara'
    start_date = datetime(2015,1,1)
    end_date = datetime(2016,1,1)
    search_results = search_solr(search_term)

    if search_results:
        # Process and display search results
        for doc in search_results:
            # print(doc)  # Output each document
            # print('\n\n')
            print(doc.keys())
            print(doc['rank_score'])
            print(doc.get('additional_info', {}))
    else:
        print('Failed to fetch data from Solr')
