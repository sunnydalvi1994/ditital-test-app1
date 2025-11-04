// src/components/Icons.js
import {
  FaHome,
  FaCreditCard,
  FaCar,
  FaGraduationCap,
  FaMotorcycle,
  FaUser,
  FaBuilding,
  FaGlobe,
  FaBriefcase,
  FaUserMd,
  FaTools,
  FaQuestion
} from 'react-icons/fa';

// Optional: Add color or other metadata too
export const iconMap = {
  home: { component: FaHome, color: "#E9A23B" },
  personal: { component: FaCreditCard, color: "#4C9EEB" },
  vehicle: { component: FaCar, color: "#E65A7E" },
  education: { component: FaGraduationCap, color: "#6F42C1" },
  "4wheeler": { component: FaCar, color: "#FF9800" },
  "2wheeler": { component: FaMotorcycle, color: "#9C27B0" },
  individual: { component: FaUser, color: "#9C27B0" },
  "non-individual": { component: FaBuilding, color: "#5C6BC0" },
  nri: { component: FaGlobe, color: "#00BCD4" },
  salaried: { component: FaBriefcase, color: "#FF5722" },
  professional: { component: FaUserMd, color: "#673AB7" },
  business: { component: FaTools, color: "#4CAF50" },
  default: { component: FaQuestion, color: "#000" }
};
