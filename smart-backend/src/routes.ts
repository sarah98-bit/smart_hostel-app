import { Router } from "express";

import authRoutes from "./modules/auth/auth.routes";
import studentRoutes from "./modules/student/student.routes";
import preferenceRoutes from "./modules/preferences/preference.routes";
import hostelRoutes from "./modules/hostels/hostel.routes";
import bookingRoutes from "./modules/bookings/booking.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import recommendationRoutes from "./modules/recommendations/recommendation.routes";
import adminRoutes from "./modules/admin/admin.routes";

const router = Router();

// Public

router.use("/auth", authRoutes);
router.use("/hostels", hostelRoutes);

// Student
router.use("/students", studentRoutes);
router.use("/preferences", preferenceRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/recommendations", recommendationRoutes);

// Admin
router.use("/admin", adminRoutes);

export default router;
