from crewai import Crew, Process
from news_agent_crew.agents import research_agent, selector_agent, writer_agent
from news_agent_crew.tasks import research_task, selector_task, write_task

# -------------------------------
# Forming the Crew
# -------------------------------
crew = Crew(
    agents=[research_agent, selector_agent, writer_agent],
    tasks=[research_task, selector_task, write_task],
    process=Process.sequential  
)

# -------------------------------
# Kickoff function
# -------------------------------
def generate_linkedin_post(topic):
    """
    Runs the CrewAI workflow for a given topic and returns the final LinkedIn draft.
    """
    print("Beginning CrewAI workflow for topic:", topic)
    result = crew.kickoff(inputs={"topic": topic})

    print("DEBUG - Crew kickoff result:", result)


    if not result:
        return "No LinkedIn post generated. Please try again with a different topic."

    return result

if __name__ == "__main__":
    topic = input("Enter topic for LinkedIn post: ")
    post = generate_linkedin_post(topic)
    print("\n--- Generated LinkedIn Post ---\n")
    print(post)

