import { TestimonialWall } from "../testimonial-wall";

export default {
  title: "Blocks/Testimonial Wall",
  component: TestimonialWall,
  tags: ["autodocs"]
};

export const Default = {
  args: {
    title: "What Customers Say",
    items: [
      { quote: "This reduced our UI delivery time substantially.", author: "Avery Chen", role: "Staff Engineer" },
      { quote: "Great baseline quality and easy to customize.", author: "Jordan Patel", role: "Design Lead" },
      { quote: "Integrates cleanly with our app shell.", author: "Riley Brooks", role: "Frontend Platform" },
      { quote: "Visual checks gave us confidence to move faster.", author: "Taylor Morgan", role: "Engineering Manager" }
    ]
  }
};
