# eBay Scraper API

A simple API to scrape product data from eBay based on a search keyword.  
The API also uses AI to generate a short summary from the scraped product data.

## Features
- Search eBay products based on a query (`?q=`).
- Retrieve **title**, **price**, **link**, and **description**.
- Generate product summaries using AI.
- Limit the number of products returned (default: 5).


## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/username/ebay-scraper.git
   cd ebay-scraper
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root and add your [OpenRouter](https://openrouter.ai/) API key:
   ```env
   OPENROUTER_API_KEY=api_key_here
   ```

## Usage
1. Start the server:
   ```bash
   node src/app.js
   ```
2. Open your browser or use a tool like Postman to make a request:
   ```
   http://localhost:3000/scrape?q=nike&page=1
   
   ```
   - `q` → Search keyword (required)
 

[![Demo Video]](https://www.youtube.com/watch?v=pj74e0vKthg)


## Example Response
```json
[
  {
    "title": "Nike Air Zoom Pegasus 39",
    "price": "$89.99",
    "link": "https://www.ebay.com/itm/123456789",
    "description": "Brand new running shoes from Nike.",
    "summary": "Lightweight and comfortable Nike running shoes perfect for daily workouts."
  }
]
```
# eBay-scrapper
