import copy # Keep copy just in case, but deepcopy is no longer needed for agents
from crewai import Crew, Process
from news_agent_crew.agents import get_research_agent, get_selector_agent, get_writer_agent
from news_agent_crew.tasks import get_tasks # <-- Import the task factory function
from news_agent_crew.tools import fetch_content_tool # <-- Import the tool instance

# -------------------------------
# Kickoff function
# -------------------------------
def generate_linkedin_post(topic, interested_sources):
    """
    Runs the CrewAI workflow by creating fresh agent and task instances for safe concurrency.
    """
    
    # 1. Instantiate NEW Agent objects for this run
    researcher = get_research_agent()
    selector = get_selector_agent()
    writer = get_writer_agent()
    
    # 2. Instantiate NEW Task objects, injecting the fresh Agents
    local_tasks = get_tasks(topic, interested_sources, researcher, selector, writer, fetch_content_tool)

    # 3. Instantiate the isolated Crew
    crew = Crew(
        agents=[researcher, selector, writer],
        tasks=local_tasks,
        process=Process.sequential 
    )
    
    print("Beginning CrewAI workflow for topic:", topic)
    result = crew.kickoff(inputs={"topic": topic, "interested_sources": interested_sources})

    print("DEBUG - Crew kickoff result:", result)


    if not result:
        return "No LinkedIn post generated. Please try again with a different topic."

    return result

if __name__ == "__main__":
    topic = input("Enter topic for LinkedIn post: ")
    # For testing, you can input a list or default to both
    interested_sources = ["Google News", "Reddit"]
    post = generate_linkedin_post(topic, interested_sources)
    print("\n--- Generated LinkedIn Post ---\n")
    print(post)

def rewrite_linkedin_post(existing_content: str, user_prompt: str):
    """
    Uses a modular CrewAI editor agent to rewrite an existing post based on user instructions.
    """
    from crewai import Crew, Process
    from news_agent_crew.agents import get_editor_agent
    from news_agent_crew.tasks import get_editor_task
    
    editor_agent = get_editor_agent()
    editor_task = get_editor_task(existing_content, user_prompt, editor_agent)
    
    crew = Crew(
        agents=[editor_agent],
        tasks=[editor_task],
        process=Process.sequential 
    )
    
    print("Beginning CrewAI rewrite workflow with instructions:", user_prompt)
    result = crew.kickoff()
    
    if not result:
        return "Failed to rewrite the post."
    return result

