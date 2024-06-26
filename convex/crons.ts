import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.monthly(
    "delete old files",
    {
        hourUTC: 12,
        minuteUTC: 10,
        day: 30 },
    internal.files.deleteAllFiles
)

export default crons;