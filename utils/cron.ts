import cron from "node-cron";
import fetch from "node-fetch";


cron.schedule("1 0 * * *", async () => {
  console.log("Running daily update task...");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/daily-update`, {
      method: "POST",
    });

    if (response.ok) {
      console.log("Daily update task completed successfully.");
    } else {
      console.error("Failed to run daily update task:", await response.text());
    }
  } catch (error) {
    console.error("Error running daily update task:", error);
  }
});

export default {};
