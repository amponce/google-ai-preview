
import requests
from bs4 import BeautifulSoup

# Function to scrape discount codes
def scrape_discount_codes(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        coupon_list = soup.find_all(attrs={'template': 'coupon_list_v1'})
        for coupon in coupon_list:
            # Extract and print discount codes, assuming they are in a specific tag inside this element
            code = coupon.find(class_='coupon-code')  # Adjust the tag and class as necessary
            if code:
                print(code.get_text())
            else:
                print('No discount code found in this coupon.')
    else:
        print('Failed to retrieve the webpage.')

# URL of the webpage to scrape
target_url = 'https://www.rakuten.com/coupons'

# Scrape the discount codes
scrape_discount_codes(target_url)
