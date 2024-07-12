
import requests
from bs4 import BeautifulSoup

# Function to scrape discount codes
def scrape_discount_codes(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        coupon_list = soup.find_all(attrs={'template': 'coupon_list_v1'})
        for coupon in coupon_list:
            # Print the entire content of the coupon for inspection
            print(coupon.prettify())
            print('-' * 80) # Separator for readability
    else:
        print('Failed to retrieve the webpage.')

# URL of the webpage to scrape
target_url = 'https://www.rakuten.com/coupons'

# Scrape the discount codes
scrape_discount_codes(target_url)
