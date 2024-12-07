import React from "react";
import EventSearch from "./components/EventSearch";
import EventCreation from "./components/EventCreation";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import DashboardAttendee from "./components/DashboardAttendee";
import DashboardOrganizer from "./components/DashboardOrganizer";
import DashboardAdmin from "./components/DashboardAdmin";
//import DashboardSponsor from "./components/DashboardSponsor";
import Preferences from "./components/Preferences";
//import EventDashboard from "./components/EventDashboard"; // Import the new component
import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ManageEvents from "./components/ManageEvents";
import BrowseEvents from "./components/BrowseEvents";
import StripeViewTickets from "./components/Payment";
import Profile from "./components/OrganizerProfile";
import ViewTickets from "./components/ViewTickets";
import EventFeedback from "./components/FeedbackEvents";
import AllFeedback from "./components/ManageFeedback";
import AllUsers from "./components/AllUsers";
import ApproveEvents from "./components/ApproveEvents";
import MyEvents from "./components/MyEvents";
import TicketSalesPage from "./components/TicketSalesPage";
import EventAnalytics from "./components/EventAnalytics";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/attendee" element={<DashboardAttendee />} />
          <Route path="/browse-events" element={<BrowseEvents />} />
          <Route path="/my-tickets" element={<ViewTickets />} />

          {<Route path="/payment" element={<StripeViewTickets />} />}
          <Route path="/attendee/event-search" element={<EventSearch />} />
          <Route path="/attendee/events" element={<MyEvents />} />
          {/* <Route
            path="/attendee/event-dashboard"
            element={<EventDashboard />}
          />
          ; */}
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/dashboard/organizer" element={<DashboardOrganizer />} />
          <Route path="/manage-events" element={<ManageEvents />} />
          <Route path="/organizer/create-event" element={<EventCreation />} />
          <Route path="/dashboard/admin" element={<DashboardAdmin />} />
          {/* <Route path="/dashboard/sponsor" element={<DashboardSponsor />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/feedback" element={<EventFeedback />} />
          <Route path="/all-feedback" element={<AllFeedback />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/admin/events" element={<ApproveEvents />} />
          <Route path="/ticket-sales" element={<TicketSalesPage />} />
          <Route path="/event-analytics" element={<EventAnalytics />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
