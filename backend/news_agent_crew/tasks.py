from crewai import Task
from news_agent_crew.agents import research_agent, selector_agent, writer_agent
from news_agent_crew.tools import fetch_content_tool

# -------------------------------
# Research Task
# -------------------------------
research_task = Task(
    description=(
        "Your goal is to find comprehensive, high-quality information about {topic}. "
        "Use the provided tool to fetch the latest news articles from GoogleNews "
        "and relevant posts from Reddit. Focus on content that is accurate, insightful, "
        "and suitable for professional readers. Include multiple perspectives and cover key points "
        "that could be useful for creating a LinkedIn post. "
        "Gather full content without summarizing yet — we will summarize later in the writing task."
        " Ensure to include the source URLs of the articles you find."
    ),
    expected_output=(
        "A list of full articles and Reddit posts relevant to {topic}, "
        "each represented as a dictionary with keys 'source' and 'content'."
        " The 'source' key should contain the URL of the article."
    ),
    tools=[fetch_content_tool],
    agent=research_agent,
)

# -------------------------------
# Selector Task
# -------------------------------
selector_task = Task(
    description=(
        "Your job is to select the most relevant and high-value article from the research results. "
        "Consider clarity, accuracy, relevance to {topic}, and usefulness for a professional audience. "
        "If multiple articles are similar, pick the one with the clearest insights. "
        "Return only one article to be used for drafting the LinkedIn post."
        "Include the source URLs of the articles you find from the research results."
    ),
    expected_output=(
        "A single article dictionary with keys 'source' and 'content' and 'url', representing the chosen article"
    ),
    tools=[],  # No tool needed, just analyze research results
    agent=selector_agent,
)

# -------------------------------
# Writing Task
# -------------------------------
write_task = Task(
    description=(
        "Using the selected article, compose a professional LinkedIn post about {topic}. "
        "The post should be concise, engaging, and insightful. "
        "Structure it in a way that captures attention quickly, highlights key points, "
        "and encourages discussion. Use a positive and approachable tone suitable for LinkedIn. "
        "Make sure the content is original, easy to read, and summarizes the key insights "
        "from the research article."
        " Include the source URLs of the articles you find in your final output."
    ),
    expected_output=(
        "A well-structured LinkedIn post text ready to be shared, summarizing the article clearly and including the source URLs."
    ),
    tools=[],  # No additional tool needed
    agent=writer_agent,
    async_execution=False,  # Execute after selection
    output_file='linkedin_post.txt'  # Optional, can save locally
)
