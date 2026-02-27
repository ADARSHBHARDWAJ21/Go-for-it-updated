import TripPlannerSection from "@/components/TripPlannerSection";

const PlanTrip = () => {
  return (
    // We remove the outer section and padding to fit nicely within the dashboard layout
    <div className="-m-8">
        <TripPlannerSection />
    </div>
  )
}

export default PlanTrip;