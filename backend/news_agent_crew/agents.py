from crewai import Agent
from news_agent_crew.tools import fetch_content_tool  
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
# from langchain_google_genai import ChatGoogleGenerativeAI
from crewai import LLM
import os
load_dotenv()


# llm = LLM(
#     model="openai/gpt-oss-20b:free",
#     temperature=0.1,
#     api_key=os.getenv("OPENAI_API_KEY_1"),
#     base_url="https://openrouter.ai/api/v1"
# )

llm = LLM(
    model="gemini/gemini-2.0-flash",
    api_key=os.getenv("GOOGLE_API_KEY"),  # Or set GOOGLE_API_KEY/GEMINI_API_KEY
    temperature=0.7
)

# -------------------------------
# Research Agent
# -------------------------------
research_agent = Agent(
    role="Senior Researcher",
    goal="Find full articles and content about {topic} from reliable sources",
    verbose=True,
    memory=True,
    backstory=(
        "You are an expert technology researcher with years of experience in "
        "analyzing emerging trends in AI, healthcare, and software development. "
        "You excel at scanning multiple sources, from academic papers to industry news, "
        "to uncover insights that others might miss. "
        "You have a meticulous approach, always fact-checking and verifying sources, "
        "and your mission is to provide the most accurate and actionable information "
        "about {topic}."
        "You are also instructed to include the source links of the articles you find in your final output."

    ),
    tools=[fetch_content_tool],
    llm=llm,
    max_iterations=1,        # ← KEY: Stop loops
    step_back_rate=0,
    allow_delegation=True,
)

# -------------------------------
# Selector Agent
# -------------------------------
selector_agent = Agent(
    role="Selector",
    goal="Select the most relevant article from the research results about {topic}",
    verbose=True,
    memory=False,
    backstory=(
        "You are a discerning content evaluator with a sharp eye for relevance and quality. "
        "Your role is to sift through multiple articles, summaries, and data points provided by the researcher, "
        "identify the most insightful and authoritative sources, and eliminate noise or repetitive content. "
        "You prioritize clarity, accuracy, and usefulness, ensuring that only the most high-value information "
        "is passed to the writer for crafting a LinkedIn post."
        "You are also instructed to include the source links of the articles you find in your final output."
    ),
    tools=[],
    llm=llm,
    allow_delegation=False,
    max_iterations=3
)

# -------------------------------
# Writer Agent
# -------------------------------
writer_agent = Agent(
    role="Writer",
    goal="Compose a concise, engaging, and insightful LinkedIn post about {topic} based on the research articles provided",
    verbose=True,
    memory=True,
    backstory=(
        "You are a professional content creator and tech communicator with experience in LinkedIn and professional blogging. "
        "You excel at turning complex technical research into easy-to-read, engaging, and informative content. "
        "Your writing style balances authority and approachability, making advanced topics accessible to a wide audience. "
        "You structure content clearly, highlight key insights, and maintain a tone that inspires curiosity and trust. "
        "You craft each LinkedIn post to engage professionals, provoke discussion, and provide practical takeaways from {topic} including hashtags."
        "You are also instructed to include the source links of the articles you find in your final output."
    ),
    tools=[],
    llm=llm,
    allow_delegation=False
)


