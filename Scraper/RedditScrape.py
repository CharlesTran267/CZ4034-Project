import praw
import csv
import time

# Initialize Reddit API
# Please create your own agent and insert the id and secret if you want to test
reddit = praw.Reddit(client_id='', 
                     client_secret='',
                     user_agent='TestAgent') 

fashionBrands = ["Nike", "Louis Vuitton", "LV", "Hermes", "Gucci", "Zalando", "Adidas", "Zara", "H&M", "Cartier", 
"Lululemon", "Moncler", "Chanel", "Prada", "Uniqlo", "Dior", "Forever 21", "ASOS", "Mango", "Charles & Keith", 
"Versace", "Burberry", "Ralph Lauren", "Tommy Hilfiger", "Calvin Klein", "Puma", "Under Armour", "Patagonia", "YSL"]
searchTerms = ["waste", "fast fashion", "sustainable", "consumerism", "quality", "animal testing", "price", "worth it", "haul", "aesthetic", "opinions", "thoughts", "comparison", "popular", "trends", "ethically sourced"]

# timePeriod = [5years ago - present]
fiveYearsAgo = int(time.time()) - (5 * 365 * 24 * 60 * 60)

subreddits = ["fashion", "streetwear", "FashionReps"]

outputFile = "data.tsv"

brands = []
terms = []

mainCount = 0

with open(outputFile, 'r', encoding='utf-8') as tsvfile:
    lines = tsvfile.readlines()
    if len(lines) > 0:
        last_line = lines[-1]
        columns = last_line.split('\t')
        mainCount = int(columns[0].split('_')[1]) + 1
    
with open(outputFile, 'a', newline='', encoding='utf-8') as tsvfile:
    writer = csv.writer(tsvfile, delimiter='\t')
    if mainCount == 0:
        writer.writerow(["MainID", "SubID", "Title", "Text", "UpvoteCount", "UpvoteRatio", "created_utc"])
    
    sleepCount=0
    for subreddit_name in subreddits:   
        subreddit = reddit.subreddit(subreddit_name)
        for brand in brands:
            for term in terms:
                print(term)
                query = f"{brand} {term}"
                count = 0
                for submission in subreddit.search(query, sort='relevance', limit=20, time_filter = 'all'):
                    if submission.created_utc < fiveYearsAgo:
                        continue
                    mainID = f"r_{mainCount:05d}"
                    mainCount += 1
                    subCount = 0
                    count += 1
                    writer.writerow([mainID, "", submission.title, submission.selftext.replace('\r\n', ' ').replace('\n', ' '), submission.score, submission.upvote_ratio, submission.created_utc])
                    top_comments = submission.comments[:10]
                    for comment in top_comments:
                        if comment.created_utc < fiveYearsAgo:
                            continue
                        subID = f"rs_{subCount:04d}"
                        subCount += 1
                        ratio = 0 if comment.ups + comment.downs == 0 else round(comment.ups/(comment.ups + comment.downs),2)
                        writer.writerow([mainID, subID, "", comment.body.replace('\r\n', ' ').replace('\n', ' '), comment.score, "", comment.created_utc])
                    
                    print(f"number of comments: {subCount}")
                print (f"number of submissions: {count}")
                sleepCount += 1
                if sleepCount == 5:
                    sleepCount = 0
                    time.sleep(20)