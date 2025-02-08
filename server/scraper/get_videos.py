from apify_client import ApifyClient
from scraper.get_acc_name import get_tiktok_handle_serpapi


def get_run_input(handle, num_each):
    return {
    "excludePinnedPosts": False,
    "profileScrapeSections": [
        "videos"
    ],
    "profileSorting": "popular",
    "profiles": [handle],
    "proxyCountryCode": "None",
    "resultsPerPage": num_each,
    "searchQueries": [
        "opal",
        "screen time"
    ],
    "shouldDownloadAvatars": False,
    "shouldDownloadCovers": False,
    "shouldDownloadMusicCovers": False,
    "shouldDownloadSlideshowImages": False,
    "shouldDownloadSubtitles": False,
    "shouldDownloadVideos": False
    }


'''
Gets num_each TikTok videos for each app in app_queries.

params:
    app_queries: list, 2-dimensional string arrays. First parameter should 
    be the app name (e.g. Opal), as THIS IS WHAT IS RETURNED IN THE JSON RECORD.
    The second should be a short (<=6-word) description of the app, e.g. "screen time app".
    num_each: int, number of TikToks to get for each app.
    returns: JSON object with app names as keys and an array of URLs as values.
'''
def get_videos(app_queries, num_each=3):
    handles = []

    for query in app_queries:
        handle = get_tiktok_handle_serpapi(query[0], query[1])
        if handle:
            handles.append([query, handle])

    client = ApifyClient("apify_api_WqVlsdTD6FgaOUZ60XuTbAkrt7AY4s4BMrDw")
    
    # Final URLs of all TikToks
    final_urls = {}

    # Handle_dict: [query, handle], query: [name, desc]
    for handle_dict in handles:
        final_urls[handle_dict[0][0]] = []
        run_input = get_run_input(handle_dict[1], num_each)

        # Run the Actor and wait for it to finish
        run = client.actor("GdWCkxBtKWOsKjdch").call(run_input=run_input)

        # Fetch and print Actor results from the run's dataset (if there are any)
        res = client.dataset(run["defaultDatasetId"]).iterate_items()

        print(res)

        for item in res:
            if item['authorMeta']['name'] == handle_dict[1][1:]:
                final_urls[handle_dict[0][0]].append(item['webVideoUrl'])

    return final_urls

# EXAMPLE USAGE
res = get_videos([["Opal", "screen time app"], ["One sec", "screen time app"]], 2)
'''
Returns:
{
    "Opal": ["link1", "link2", ...],
    "One sec": ["link1", "link2", ...],
}
'''