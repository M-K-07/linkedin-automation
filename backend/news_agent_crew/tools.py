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

class ContentFetcherTool(BaseTool):
    name: str = "ContentFetcher"
    description: str = (
        "Searches Google News and Reddit for recent articles about a topic. "
        "Returns 2-4 articles with source name, URL, and content summary. "
        "Use this when you need current information about any subject."
    )
    args_schema: Type[BaseModel] = ContentFetcherInput

    def _run(self, topic: str) -> str:
        """
        Fetches news and returns formatted string results.
        Returns a string instead of list for better LLM parsing.
        """
        print(f"\n🔍 Fetching content about: {topic}")
        results = []
        
        # Google News (up to 2)
        try:
            gn = GoogleNews(lang='en', period='7d')
            gn.search(topic)
            news_results = gn.results(sort=True)
            
            for i, article in enumerate(news_results[:2], 1):
                title = article.get('title', 'No title')
                desc = article.get('desc', 'No description')
                url = article.get('link', 'No URL')
                
                results.append(
                    f"Article {i}:\n"
                    f"Source: GoogleNews\n"
                    f"URL: {url}\n"
                    f"Content: {title} - {desc}\n"
                )
            
            print(f"✅ Found {len(news_results)} Google News articles")
            
        except Exception as e:
            print(f"⚠️ Google News error: {e}")
            results.append(
                f"Article 1:\n"
                f"Source: GoogleNews\n"
                f"URL: N/A\n"
                f"Content: Recent developments in {topic} (search unavailable)\n"
            )
        
        # Reddit (up to 2)
        # try:
        #     reddit_posts = []
            
        #     for submission in reddit.subreddit("all").search(topic, limit=5, sort='relevance', time_filter='week'):
        #         title = submission.title
        #         content = submission.selftext if submission.selftext else "Discussion post"
        #         url = submission.url
        #         subreddit = submission.subreddit.display_name
                
        #         reddit_posts.append({
        #             'title': title,
        #             'content': content,
        #             'url': url,
        #             'subreddit': subreddit
        #         })
            
        #     # Add top 2 Reddit posts
        #     for i, post in enumerate(reddit_posts[:2], len(results) + 1):
        #         results.append(
        #             f"Article {i}:\n"
        #             f"Source: Reddit - r/{post['subreddit']}\n"
        #             f"URL: {post['url']}\n"
        #             f"Content: {post['title']} - {post['content']}\n"
        #         )
            
        #     print(f"✅ Found {len(reddit_posts)} Reddit posts")
            
        # except Exception as e:
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