import React from "react";
// import EventSearch from "./components/EventSearch";
import EventCreation from "./components/Organizer/EventCreation";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import DashboardAttendee from "./components/Attendee/DashboardAttendee";
import DashboardOrganizer from "./components/Organizer/DashboardOrganizer";
import DashboardAdmin from "./components/Admin/DashboardAdmin";

import Preferences from "./components/Attendee/Preferences";
//import EventDashboard from "./components/EventDashboard"; // Import the new component
import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ManageEvents from "./components/Organizer/ManageEvents";
import BrowseEvents from "./components/Attendee/BrowseEvents";
import StripeViewTickets from "./components/Attendee/Payment";
import Profile from "./components/Organizer/OrganizerProfile";
import ViewTickets from "./components/Attendee/ViewTickets";
import EventFeedback from "./components/Attendee/FeedbackEvents";
import AllFeedback from "./components/Admin/ManageFeedback";
import AllUsers from "./components/Admin/AllUsers";
import ApproveEvents from "./components/Admin/ApproveEvents";
import MyEvents from "./components/Attendee/MyEvents";
import TicketSalesPage from "./components/Organizer/TicketSalesPage";
import EventAnalytics from "./components/Organizer/EventAnalytics";
import ViewReports from "./components/Admin/ViewReports";
import DashboardSponser from "./components/Sponsers/DashboardSponser";
import Application from "./components/Sponsers/Application"
import Confirmation from "./components/Sponsers/ConfirmPage";
import ViewApplications from "./components/Sponsers/ViewApplications";
import ManageSponsorApplications from "./components/Organizer/ManageSponserApplications";
import SetDiscounts from "./components/Admin/SetDiscounts";

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
          <Route path="/dashboard/vendor" element={<DashboardSponser />} />
          <Route path="/browse-events" element={<BrowseEvents />} />
          <Route path="/my-tickets" element={<ViewTickets />} />

          {<Route path="/payment" element={<StripeViewTickets />} />}
          {/* <Route path="/attendee/event-search" element={<EventSearch />} /> */}
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
         {/* <Route path="/dashboard/sponsor" element={<DashboardSponsor />} />  */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/feedback" element={<EventFeedback />} />
          <Route path="/all-feedback" element={<AllFeedback />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/admin/events" element={<ApproveEvents />} />
          <Route path="/ticket-sales" element={<TicketSalesPage />} />
          <Route path="/event-analytics" element={<EventAnalytics />} />
          <Route path="/admin/reports" element={<ViewReports />} />
          <Route path="/sponsor/apply" element={<Application />} />
          <Route path="/sponsor/confirmation" element={<Confirmation />} />
          <Route path="/sponsor/applications"
        element={<ViewApplications/>}/>
                <Route path="/manage-sponsor-applications" element={<ManageSponsorApplications />} />
                <Route path="/admin/discounts" element={<SetDiscounts />} />
        </Routes>
       
      </Router>
    </div>
  );
};

export default App;
