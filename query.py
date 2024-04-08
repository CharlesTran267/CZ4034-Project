import requests
import ast
from datetime import datetime
import re

core_name = 'fashion2'
solr_url = 'http://localhost:8983/solr/{core}/select'.format(core=core_name)

def search_solr(query, rows = 10, ranked = False, startDate = None, endDate = None):
    # Construct the query parameters
    params = {
        'q': query,
        'rows': rows if (not ranked and startDate is None and endDate is None) else 50000  # Limiting the number of rows to retrieve
    }

    try:
        # Send GET request to Solr
        response = requests.get(solr_url, params=params)
        response.raise_for_status()  # Raise an exception for any HTTP error
        solr_data = response.json()  # Parse response JSON
        solr_data = solr_data['response']['docs']
        if ranked or startDate is not None or endDate is not None:
            solr_data = filter_result(solr_data, rows, ranked, startDate, endDate)
        return solr_data
    except requests.RequestException as e:
        print('Error querying Solr:', e)
        return None

def filter_result(solr_data, rows, ranked, startDate, endDate):
    filtered_data = []
    min_score = -1
    for doc in solr_data:
        additional_info = doc.get('additional_info', {})
        if additional_info and isinstance(additional_info, list):
            additional_info = additional_info[0]
        
        score = 0
        timestamp_datetime = datetime.min
        if 'Reddit' in doc['source']:
            try:
                additional_info = additional_info.replace('{', '{"').replace(':', '":"').replace(',', '","').replace('}', '"}')
                additional_info_dict = ast.literal_eval(additional_info)
                score = int(additional_info_dict.get('upvote'))
                timestamp = additional_info_dict.get('timestamp')
                timestamp_datetime = datetime.strptime(timestamp, "%Y-%m-%d")
            except (SyntaxError, ValueError) as e:
                print(e)
        elif 'Instagram' in doc['source']:
            try:
                match = re.search(r'^(\d+) likes', additional_info)
                if match:
                    score = int(match.group(1))
                match = re.search(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z', additional_info)
                if match:
                    timestamp = match.group()
                    timestamp_datetime = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%fZ")
            except (SyntaxError, ValueError) as e:
                print(e)
        elif 'TikTok' in doc['source']:
            try:
                likes_match = re.search(r'likes:\s*(\d+)', additional_info)
                likes = int(likes_match.group(1)) if likes_match else None
                date_match = re.search(r'date:\s*\'([^\']+)\'', additional_info)
                timestamp = date_match.group(1) if date_match else None
                timestamp_datetime = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
            except (SyntaxError, ValueError) as e:
                print(e)
        elif 'Twitter' in doc['source']:
            try:
                additional_info_dict = ast.literal_eval(additional_info)
                score = int(additional_info_dict.get('Likes'))
                timestamp = additional_info_dict.get('Timestamp')
                timestamp_datetime = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%fZ")
            except (SyntaxError, ValueError) as e:
                print(e)
        elif 'youtube' in doc['source']:
            score = 0
        
        if ranked:
            if startDate is not None and timestamp_datetime < startDate:
                continue 
            if endDate is not None and timestamp_datetime > endDate:
                continue
            if score > min_score or len(filtered_data) < rows:
                doc['rank_score'] = score
                filtered_data.append(doc)
                if len(filtered_data) > rows:
                    min_score_doc = min(filtered_data, key=lambda x: x['rank_score'])
                    filtered_data.remove(min_score_doc)
                min_score = min(filtered_data, key=lambda x: x['rank_score'])['rank_score']
        else:
            if startDate is not None and timestamp_datetime < startDate:
                continue 
            if endDate is not None and timestamp_datetime > endDate:
                continue
            filtered_data.append(doc)
            if len(filtered_data) == rows:
                return filtered_data
    return filtered_data

# Example usage: Perform a search query and process the response
search_term = 'brand:Zara'
start_date = datetime(2015,1,1)
end_date = datetime(2016,1,1)
search_results = search_solr(search_term, 3, True, start_date, end_date)

if search_results:
    # Process and display search results
    for doc in search_results:
        print(doc)  # Output each document
        print('\n\n')
    for doc in search_results:
        print(doc['rank_score'])
    for doc in search_results:
        print(doc.get('additional_info', {}))
        
    
else:
    print('Failed to fetch data from Solr')
