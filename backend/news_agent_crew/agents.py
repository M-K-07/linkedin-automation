# news_agent_crew/agents.py (Refactored)

from crewai import Agent, LLM
from news_agent_crew.tools import fetch_content_tool 
from dotenv import load_dotenv
import os

load_dotenv()

# --- LLM Definition (Define centrally) ---
# NOTE: The LLM client itself might contain unpicklable locks. 
# We define the LLM parameters once, but ideally, the LLM object itself 
# should also be instantiated inside the functions if possible, but 
# defining it once often works with CrewAI when using factory functions.
llm_config = {
    "model": "openrouter/qwen/qwen3-vl-30b-a3b-thinking", # Using a free openrouter model
    "api_key": os.getenv("OPENAI_API_KEY_3") or os.getenv("OPENAI_API_KEY_2"),
    "base_url": os.getenv("OPENAI_API_BASE", "https://openrouter.ai/api/v1"),
    "temperature": 0.7
}

# The LLM object itself
llm = LLM(**llm_config)


# -------------------------------
# Research Agent Factory Function
# -------------------------------
def get_research_agent():
    return Agent(
        role="Senior Researcher",
        goal="Find full articles and content about {topic} from reliable sources",
        verbose=True,
        memory=True,
        backstory=(
            "You are an expert technology researcher with years of experience in "
            "analyzing emerging trends. "
            "Your mission is to provide accurate and real information about {topic}. "
            "CRITICALLY IMPORTANT: You must ONLY use the EXACT sources, article titles, and URLs returned by your tools. "
            "NEVER invent, hallucinate, or guess URLs, company names, or funding amounts. "
            "If a tool returns an article, you must pass its exact URL to the next agent."
        ),
        tools=[fetch_content_tool],
        llm=llm, # Use the shared LLM definition
        max_iterations=1,
        step_back_rate=0,
        allow_delegation=True,
    )

# -------------------------------
# Selector Agent Factory Function
# -------------------------------
def get_selector_agent():
    return Agent(
        role="Selector",
        goal="Select the most relevant article from the research results about {topic}",
        verbose=True,
        memory=False,
        backstory=(
            "You are a discerning content evaluator. Your role is to sift through the researcher's output "
            "and select the most insightful and factual article. "
            "CRITICALLY IMPORTANT: You must pass along the EXACT URL provided by the researcher. "
            "Do not modify or hallucinate any URLs or facts."
        ),
        tools=[],
        llm=llm,
        allow_delegation=False,
        max_iterations=3
    )

# -------------------------------
# Writer Agent Factory Function
# -------------------------------
def get_writer_agent():
    return Agent(
        role="Writer",
        goal="Compose a concise, engaging, and insightful LinkedIn post about {topic} based on the research articles provided",
        verbose=True,
        memory=True,
        backstory=(
            "You are a professional LinkedIn content creator. "
            "Your goal is to turn the provided research into a simple, engaging, and easy-to-read LinkedIn post. "
            "Write in a conversational and professional tone that even a non-technical person can easily understand. "
            "Avoid heavy jargon, complex technical terms, or overly dense paragraphs. "
            "Keep sentences short and formatting clean (use bullet points or emojis sparingly but effectively). "
            "CRITICALLY IMPORTANT: At the end of the post, you MUST list the sources using the EXACT URLs provided by the researcher and selector. "
            "NEVER invent, hallucinate, or make up fake URLs (like techcrunch.com/fake-article) or company names. "
            "If the URL provided is 'No URL' or 'N/A', simply state the source name without a link."
        ),
        tools=[],
        llm=llm,
        allow_delegation=False
    )