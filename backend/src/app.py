from flask import Flask, request, jsonify
from flask_cors import CORS
from query import search_solr
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    rows = request.args.get('rows')
    startDate = request.args.get('start_date')
    endDate = request.args.get('end_date')
    sort_field = request.args.get('sort_field')
    sort_order = request.args.get('sort_order')
    sources = request.args.getlist('sources[]')
    brand = request.args.get('brand')
    polarity = request.args.get('polarity')

    if query is None:
        return jsonify({'error': 'Missing query parameter'}), 400
    if rows is not None:
        try:
            rows = int(rows)
        except ValueError:
            return jsonify({'error': 'Invalid rows parameter'}), 400
    if startDate is not None:
        try:
            startDate = datetime.strptime(startDate, "%d/%m/%Y").strftime("%Y-%m-%dT%H:%M:%SZ")
        except ValueError:
            return jsonify({'error': 'Invalid startDate parameter'}), 400
    if endDate is not None:
        try:
            endDate = datetime.strptime(endDate, "%d/%m/%Y").strftime("%Y-%m-%dT%H:%M:%SZ")
        except ValueError:
            return jsonify({'error': 'Invalid endDate parameter'}), 400
    if sort_field is not None and sort_order is None:
        return jsonify({'error': 'Missing sort_order parameter'}), 400

    solr_data = search_solr(query, rows, startDate, endDate, sort_field, sort_order, brand, sources, polarity)
    if solr_data is None:
        return jsonify({'error': 'Error querying Solr'}), 500
    return jsonify(solr_data)


if __name__ == '__main__':
    app.run(debug=True)