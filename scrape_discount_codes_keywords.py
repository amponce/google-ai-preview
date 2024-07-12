
import requests
from bs4 import BeautifulSoup
import re

# Function to scrape discount codes
def scrape_discount_codes(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        text_elements = soup.find_all(string=re.compile(r'code|coupon', re.I))
        for element in text_elements:
            print(element)
            print('-' * 80) # Separator for readability
    else:
        print('Failed to retrieve the webpage.')

# URL of the webpage to scrape
target_url = 'https://www.rakuten.com/coupons'

# Scrape the discount codes
scrape_discount_codes(target_url)
