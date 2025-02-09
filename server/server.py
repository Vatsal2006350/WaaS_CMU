from flask import Flask, request, jsonify
from scraper.get_videos import get_videos
from flask_cors import CORS
import os
import yt_dlp

app = Flask(__name__)
CORS(app)

# 4) The /scrape route
@app.route("/scrape", methods=["POST"])
def scrape_video():
    data = request.get_json()
    app_descriptions = data.get("app_descriptions")
    num_vids_each = data.get("num_vids_each")
    
    res = get_videos(app_descriptions[0], num_vids_each)
    return jsonify(res), 200

def download_tiktok_video(url, output_path="downloads/%(title)s.%(ext)s"):
    """
    Downloads a TikTok video from the provided URL.

    :param url: TikTok video URL.
    :param output_path: Path where the video will be saved.
    """
    ydl_opts = {
        'outtmpl': output_path,  # Save with title as filename
        'format': 'bestvideo+bestaudio/best',  # Best quality
        'merge_output_format': 'mp4',  # Ensure MP4 format
        'quiet': False,  # Show progress
        'noplaylist': True  # Avoid downloading playlists (if any)
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

@app.route('/download_videos', methods=['POST'])
def download_videos():
    data = request.get_json()
    base_dir = 'vids/scraped'

    for category, urls in data.items():
        category_dir = os.path.join(base_dir, category.lower().replace(" ", "_"))
        os.makedirs(category_dir, exist_ok=True)

        for url in urls:
            try:
                output_path = os.path.join(category_dir, '%(title)s.%(ext)s')
                download_tiktok_video(url, output_path)
            except Exception as e:
                return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Videos downloaded successfully"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=3000)