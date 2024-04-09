from flask import Flask, request, jsonify
from flask_cors import CORS
from query import search_solr

app = Flask(__name__)
CORS(app)

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    rows = request.args.get('rows')
    ranked = request.args.get('ranked')
    startDate = request.args.get('startDate')
    endDate = request.args.get('endDate')
    if query is None:
        return jsonify({'error': 'Missing query parameter'}), 400
    if rows is not None:
        try:
            rows = int(rows)
        except ValueError:
            return jsonify({'error': 'Invalid rows parameter'}), 400
    if ranked is not None:
        ranked = ranked.lower() == 'true'
    if startDate is not None:
        try:
            datetime.strptime(startDate, '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid startDate parameter'}), 400
    if endDate is not None:
        try:
            datetime.strptime(endDate, '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid endDate parameter'}), 400
    solr_data = search_solr(query, rows, ranked, startDate, endDate)
    if solr_data is None:
        return jsonify({'error': 'Error querying Solr'}), 500
    return jsonify(solr_data)


if __name__ == '__main__':
    app.run(debug=True)