from TikTokApi import TikTokApi
import asyncio
import os
import datetime
import csv

csv_file = "comments.csv"
file_exists = os.path.isfile(csv_file)

ms_token = os.environ.get("MS_TOKEN", None) # get your own ms_token from your cookies on tiktok.com

context_options = {
    'viewport' : { 'width': 1280, 'height': 1024 },
    'user_agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
}

fashionBrands = ["Nike", "Louis Vuitton", "Hermes", "Gucci", "Zalando", "Adidas", "Zara", 
                "H&M", "Cartier", "Lululemon", "Moncler", "Chanel", "Prada", "Uniqlo", "Dior", 
                "Forever 21", "ASOS", "Mango", "Charles & Keith", "Versace", "Burberry", "Ralph Lauren", 
                "Tommy Hilfiger", "Calvin Klein", "Puma", "Under Armour", "Patagonia", "YSL", "Shein"]

searchTerms = ["waste", "fast fashion", "sustainable", "consumerism", "quality", "animal testing", 
                "price", "haul", "aesthetic", "opinion", "thought", "comparison", 
                "popular", "trend", "ethically sourced", "love", "hate", "recommend", "worst", 
                "best", "quality", "price", "customer service", "sizing", "return policy", "durability", 
                "shipping", "comfortable", "stylish", "worth", "color", "material", "eco-friendly", "ethical", 
                "collaboration", "better", "worse", "like", "dislike", "favorite", "least favorite", "overrated", 
                "underated", "trendy", "classic", "timeless", "fashionable", "tacky", "cheap", "expensive",]

async def scrapComments(video_id, brand):
    async with TikTokApi() as api:
        await api.create_sessions(ms_tokens=[ms_token], num_sessions=1, sleep_after=3, headless=False)
        video = api.video(id=video_id)
        comments = []
        async for comment in video.comments(count=500):
            comment = comment.as_dict
            if comment["comment_language"] != "en":
                continue
            searchTerms.extend(fashionBrands)
            for term in searchTerms:
                if term.lower() in comment["text"].lower():
                    add_comment = {
                        "id": comment["cid"],
                        "text": comment["text"],
                        "time": datetime.datetime.utcfromtimestamp(comment["create_time"]).strftime('%Y-%m-%d %H:%M:%S'),
                        "likes": comment["digg_count"],
                        "brand": brand,
                        "relevant_term": term,
                    }
                    comments.append(add_comment)
                    break
        print(f"Scrapped {len(comments)} comments")
        with open(csv_file, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(["id", "text", "brand", "term", "likes", "time"])
            for comment in comments:
                writer.writerow([comment["id"], comment["text"], comment["brand"], comment["relevant_term"], comment["likes"], comment["time"]])

if __name__ == "__main__":
    brand = "Zalando"
    videos = ["7247572094811262234", "7293212467985992992", "7200753464383720710", 
            "7267859633610476833", "7216038767709211910", "7208976651596631302"
            "7239422183414533403", "7240745256537410843", "7206037403981696262",
            "7228199460348628250", "7220816919027371291", "7270559904837029153",
            "6992301846354234630", "7253485953321291035",]
            # "7331356649946434822",
            # "7298725966619364610", "7245043143207341314", "7287538541209341216",
            # "7331706087080611077", "7205971964345715994", "7245344386790329626"]
    for video_id in videos:
        try:
            asyncio.run(scrapComments(video_id, brand))
        except Exception as e:
            print(e)
            continue