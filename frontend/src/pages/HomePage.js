import React from "react";
import BookingHero from "../components/BookingHero";
import PackageTour from "../components/PackageTour";
import Counters from "../components/Counters";
import LatestEvents from "../components/LatestEvents";

export default function HomePage() {
  return (
    <>
      <BookingHero />
      <PackageTour />
      <Counters />
      <LatestEvents />
    </>
  );
}