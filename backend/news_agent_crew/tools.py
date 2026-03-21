
from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
from GoogleNews import GoogleNews
import praw
from dotenv import load_dotenv
import os

load_dotenv()

# Reddit Setup
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

class ContentFetcherInput(BaseModel):
    """Input schema for ContentFetcher tool."""
    topic: str = Field(
        ..., 
        description="The topic to search for (e.g., 'AI in healthcare', 'blockchain technology')"
    )
    interested_sources: list[str] = Field(
        default_factory=list,
        description="List of platforms to search. E.g., ['Google News', 'Reddit']. If empty, searches all."
    )

class ContentFetcherTool(BaseTool):
    name: str = "ContentFetcher"
    description: str = (
        "Searches Google News and Reddit for recent articles about a topic. "
        "Returns 2-4 articles with source name, URL, and content summary. "
        "Use this when you need current information about any subject."
    )
    args_schema: Type[BaseModel] = ContentFetcherInput

    def _run(self, topic: str, interested_sources: list[str] = None) -> str:
        """
        Fetches news and returns formatted string results.
        Returns a string instead of list for better LLM parsing.
        """
        if interested_sources is None:
            interested_sources = ["Google News", "Reddit"]
            
        sources_lower = [str(s).lower() for s in interested_sources]
            
        print(f"\n🔍 Fetching content about: {topic} from sources: {interested_sources}")
        results = []
        
        # Google News
        if "google news" in sources_lower or "google-news" in sources_lower:
            try:
                import urllib.request
                import urllib.parse
                import xml.etree.ElementTree as ET
                
                encoded_topic = urllib.parse.quote(topic)
                url = f"https://news.google.com/rss/search?q={encoded_topic}&hl=en-US&gl=US&ceid=US:en"
                
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req) as response:
                    xml_data = response.read()
                root = ET.fromstring(xml_data)
                
                news_results = []
                for item in root.findall('.//item')[:2]:
                    title = item.find('title').text if item.find('title') is not None else 'No title'
                    link = item.find('link').text if item.find('link') is not None else 'No URL'
                    news_results.append({'title': title, 'link': link, 'desc': title})
                
                for i, article in enumerate(news_results, 1):
                    results.append(
                        f"Article {i}:\n"
                        f"Source: GoogleNews RSS\n"
                        f"URL: {article['link']}\n"
                        f"Content: {article['title']}\n"
                    )
                
                print(f"✅ Found {len(news_results)} Google News articles via RSS")
                
            except Exception as e:
                print(f"⚠️ Google News RSS error: {e}")
                
        # Reddit 
        if "reddit" in sources_lower:
            try:
                reddit_posts = []
                
                for submission in reddit.subreddit("all").search(topic, limit=5, sort='relevance', time_filter='week'):
                    title = submission.title
                    content = submission.selftext if submission.selftext else "Discussion post"
                    url = submission.url
                    subreddit = submission.subreddit.display_name
                    
                    reddit_posts.append({
                        'title': title,
                        'content': content,
                        'url': url,
                        'subreddit': subreddit
                    })
                
                # Add top 2 Reddit posts
                for i, post in enumerate(reddit_posts[:2], len(results) + 1):
                    results.append(
                        f"Article {i}:\n"
                        f"Source: Reddit - r/{post['subreddit']}\n"
                        f"URL: {post['url']}\n"
                        f"Content: {post['title']} - {post['content']}\n"
                    )
                
                print(f"✅ Found {len(reddit_posts)} Reddit posts")
                
            except Exception as e:
                print(f"⚠️ Reddit error: {e}")
                if len(results) < 2:
                    results.append(
                        f"Article {len(results) + 1}:\n"
                        f"Source: Reddit\n"
                        f"URL: N/A\n"
                        f"Content: Community discussions about {topic} (search unavailable)\n"
                    )
        
        # Ensure we have at least 2 results
        while len(results) < 2:
            results.append(
                f"Article {len(results) + 1}:\n"
                f"Source: Fallback\n"
                f"URL: N/A\n"
                f"Content: General information: {topic} is an emerging topic worth exploring.\n"
            )
        
        # Return as formatted string
        output = "\n".join(results)
        print(f"\n📦 Tool returning {len(results)} articles\n")
        return output

# Create tool instance
fetch_content_tool = ContentFetcherTool()


# Test function
if __name__ == "__main__":
    topic = "AI agents in modern applications"
    print(fetch_content_tool._run(topic))