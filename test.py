import requests
print(requests.post(f"https://api.github.com/repos/LYXOfficial/blogsource/dispatches",
            headers={
                "Accept": "application/vnd.github+json",
                "Authorization": "token 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"
            },
            json={
                "event_type": "hooklink"
            }).text)