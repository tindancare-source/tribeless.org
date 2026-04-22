import urllib.request
import re

url = "https://en.wikipedia.org/wiki/National_Disaster_Management_Organization"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        # Look for the infobox image
        matches = re.findall(r'src="(//upload\.wikimedia\.org/wikipedia/en/[^"]+)"', html)
        if matches:
            for match in matches:
                print("https:" + match)
                break
        else:
            print("No image found.")
except Exception as e:
    print(e)
