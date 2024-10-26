import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ApplicantDashboard from './pages/ApplicantDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import JobDetails from './pages/JobDetails';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
      <Route path="/company/dashboard" element={<CompanyDashboard />} />
      <Route path="/job/:id" element={<JobDetails />} />
    </Routes>
  </Router>
);

export default AppRoutes;