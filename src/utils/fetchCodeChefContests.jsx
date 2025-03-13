export const fetchCodeChefContests = async () => {
  try {
    const fetchedCodechefContests = await fetch("https://algoalertbackend.onrender.com/api/v1/codechef/contests");
    if (!fetchedCodechefContests.ok) throw new Error("Failed to fetch CodeChef contests");

    const data = await fetchedCodechefContests.json();
    console.log("🔍 Raw API fetchedCodechefContests:", data); // Debugging log

    if (!data || !data.contests) throw new Error("Invalid fetchedCodechefContests structure");

    const mappedContests = data.contests.map(contest => ({
      id: `CC-${contest.id}`,
      title: contest.name,
      timestamp: new Date(contest.startTime).getTime(),
      duration: contest.duration / 60, // Convert seconds to minutes
      status: contest.status, // Ensure status is "Upcoming" or "Ended"
      link: contest.url,
      platform: "CodeChef",
    }));

    console.log("✅ Processed CodeChef Contests:", mappedContests); // Debugging log
    return mappedContests;

  } catch (error) {
    console.error("❌ Error fetching CodeChef contests:", error);
    return [];
  }
};
