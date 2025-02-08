from serpapi import GoogleSearch

def get_tiktok_handle_serpapi(app_name, app_desc):
    params = {
        "engine": "google",
        "q": f"{app_name + ' ' + app_desc} TikTok",
        "num": 50,
        "api_key": "434ff67a5d14697033ac9f31b1f6846488612646dde9d634085c43cdbbe8c3cd"
    }

    search = GoogleSearch(params)
    results = search.get_dict()

    # Extract first TikTok username from results
    if "organic_results" in results:
        for result in results["organic_results"]:
            if "tiktok.com/@" in result["link"]:
                handle = result["link"].split("/")[-1]
                if '?' in handle:
                    handle = handle.split('?')[0]
                if app_name.lower() in handle.lower():
                    return handle  # Returns the handle without '@'
            if "snippet" in result and "tiktok.com/@" in result["snippet"]:
                snippet_parts = result["snippet"].split()
                for part in snippet_parts:
                    if "tiktok.com/@" in part:
                        handle = part.split("/")[-1]
                        if '?' in handle:
                            handle = handle.split('?')[0]
                        if app_name.lower() in handle.lower():
                            return handle  # Returns the handle without '@'

    return None  # If no handle is found
