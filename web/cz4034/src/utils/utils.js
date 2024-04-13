export function fixJsonLikeString(jsonLikeString) {
  // First, add double quotes around any keys (assuming keys are simple words)
  jsonLikeString = jsonLikeString.replace(/'/g, '"');

  jsonLikeString = jsonLikeString.replace(/False/g, 'false').replace(/True/g, 'true');

  // Attempt to fix arrays formatted as strings
  jsonLikeString = jsonLikeString.replace(/"\[(.*?)\]"/g, (match, p1) => {
    // Split the matched group by ", " to get array elements, handle the case where elements themselves contain commas
    const elements = p1.split(',').map(element => element.trim().replace(/^"|"$/g, ''));
    // Rebuild the array as a string
    const arrayString = '[' + elements.map(element => `"${element}"`).join(', ') + ']';
    return arrayString;
  });
  return jsonLikeString;
}

export function getCommentDetails(result){
  let details = {};
  details['comment'] = result.comment;
  details['brand'] = result.brand;
  details['source'] = result.source;

  if (result.subjectivity === true){
    if (result.polarity === true){
      details['polarity'] = 'Positive';
    }else{
      details['polarity'] = 'Negative';
    }
  }else{
    details['polarity'] = 'Neutral';
  }

  let timestamp = null;
  if (result.timestamp !== null){
    timestamp = new Date(result.timestamp);
  }

  details['timestamp'] = timestamp;
  details['likes'] = result.likes;

  if (result.source === 'Youtube'){
    details['title'] = result.comment.split('+')[0];
    details['comment'] = result.comment.split('+')[1];
    details['url'] = result.additional_info['url'];
  }else if (result.source === 'Twitter'){
    Object.entries(result.additional_info).forEach(([key, value]) => {
      if (key === 'Timestamp' || key === 'Likes' || key ==='Source') return;
      details[key] = value;
    });
  }else if (result.source === 'Reddit'){
    const list_comment = result.comment.split(';;');
    if (list_comment.length === 2){
      details['title'] = list_comment[0];
      details['comment'] = list_comment[1];
    }
  }
  return details;
}

export function capitalizeFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}