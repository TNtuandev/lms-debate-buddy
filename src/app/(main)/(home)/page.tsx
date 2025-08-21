import React from "react";
import "./index.css";
import { Banner } from "@/components/home/Banner";
import { CallToAction } from "@/components/home/CallToAction";
import { Explore } from "@/components/home/Explore";
import HomepageFeedback from "@/components/home/HomepageFeedback";
import CourseTabHomeComponent from "@/components/home/CourseTabHomeComponent";
import { WhatYouGet } from "@/components/home/WhatYouGet";

function HomePage() {
  return (
    <div>
      <Banner />
      <Explore />
      <CourseTabHomeComponent />
      <WhatYouGet />
      <HomepageFeedback />
      <CallToAction />
    </div>
  );
}

export default HomePage;
