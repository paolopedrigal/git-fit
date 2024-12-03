import { getTimeOfDay } from "@/lib/utils";

const fitStatus = (startWorkoutTime: number | undefined) => {
  if (startWorkoutTime == undefined) return <span>No workout in progress</span>;
  else
    return (
      <>
        <span>Workout in progress</span>
        <br />
        <span style={{ marginLeft: "20px", color: "green" }}>
          {"start: "}
          {getTimeOfDay(startWorkoutTime)}
        </span>
      </>
    );
};

export default fitStatus;
