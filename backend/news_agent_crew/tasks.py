# news_agent_crew/tasks.py (Refactored)

from crewai import Task
# We will import the agent factory functions from agents.py and call them inside a task factory function.
# NOTE: To avoid circular imports, you might need to import the agents inside the function, 
# or ensure agents.py only imports the necessary tools.

def get_tasks(topic, interested_sources, research_agent, selector_agent, writer_agent, fetch_content_tool):
    """
    Returns a list of fresh Task instances, using the fresh Agent instances passed in.
    """

    # -------------------------------
    # Research Task
    # -------------------------------
    research_task = Task(
        description=(
            f"Your goal is to find comprehensive, high-quality information about {topic}. "
            f"Use the provided tool to fetch the latest news articles from the user's preferred sources: {interested_sources}. "
            "Focus on content that is accurate, insightful, "
            "and suitable for professional readers. Include multiple perspectives and cover key points "
            "that could be useful for creating a LinkedIn post. "
            "Gather full content without summarizing yet — we will summarize later in the writing task. "
            "Ensure to include the source URLs of the articles you find. "
            f"IMPORTANT: You must pass this exact list to your tool: {interested_sources}"
        ),
        expected_output=(
            f"A list of full articles and Reddit posts relevant to {topic}, "
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
            f"Your job is to select the most relevant and high-value article from the research results. "
            "Consider clarity, accuracy, relevance to {topic}, and usefulness for a professional audience. "
            "If multiple articles are similar, pick the one with the clearest insights. "
            "Return only one article to be used for drafting the LinkedIn post."
            "Include the source URLs of the articles you find from the research results."
        ),
        expected_output=(
            "A single article dictionary with keys 'source' and 'content' and 'url', representing the chosen article"
        ),
        tools=[],
        agent=selector_agent,
    )

    # -------------------------------
    # Writing Task
    # -------------------------------
    write_task = Task(
        description=(
            f"Using the selected article, write ONE LinkedIn post about {topic}.\n\n"
            "TARGET LENGTH:\n"
            "- 100–150 words\n"
            "- 5–7 short paragraphs (1–2 sentences each)\n\n"
            "HOW TO START:\n"
            "- Begin by explaining the core material, technology, or idea in simple terms.\n"
            "  (Example: 'Lithium powers electric cars and AI data centers.')\n\n"
            "TONE:\n"
            "- Clear and informative\n"
            "- Written for both tech and non-tech professionals\n"
            "- Calm and neutral\n"
            "- No hype, no drama\n\n"
            "CONTENT REQUIREMENTS:\n"
            "- Explain what happened in simple language\n"
            "- Include 1–2 important numbers if relevant\n"
            "- Mention key companies only if central\n"
            "- Clearly explain why this matters now\n"
            "- Explain who should care\n\n"
            "AVOID:\n"
            "- Complex business language\n"
            "- Abstract industry summaries\n"
            "- Marketing tone\n"
            "- Deep technical breakdowns\n"
            "- Mentioning videos, channels, or sources in the main text\n\n"
            "ENDING:\n"
            "- End with one thoughtful, simple question\n"
            "- Add 3–6 relevant hashtags\n"
            "- CRITICALLY IMPORTANT: After the hashtags, strictly list the exact source URLs underneath (e.g. Sources: \n1. [URL])"
        ),
        expected_output=(
            "A simple, clear LinkedIn post that explains the trend in plain English "
            "while keeping key facts and numbers, and ending with exactly the source URLs."
        ),
        tools=[],
        agent=writer_agent,
        async_execution=False,
        )
    
    return [research_task, selector_task, write_task]