import { Request, Response } from "express";
import User from "../../../core/models/user.model";
import Instructor from "../../../core/models/instructor.model";
import InstructorRequest from "../../../core/models/instructorRequest.model";
import Rating from "../../../core/models/rating.model";
import Report from "../../../core/models/report.model";




export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, search } = req.query;

    let filter: any = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      users: users,
      total,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Hiba a felhasználók lekérésekor." });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Hiba a felhasználó lekérésekor." });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, phoneNumber } = req.body;

    // Validate role
    if (
      role &&
      ![
        "user",
        "moderator",
        "admin",
        "creator",
        "instructor",
        "student",
        "",
      ].includes(role)
    ) {
      return res.status(400).json({ error: "Érvénytelen szerepkör." });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, role, phoneNumber },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található." });
    }

    res.status(200).json({
      message: "Felhasználó sikeresen frissítve.",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Hiba a felhasználó frissítésekor." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található." });
    }

    res.status(200).json({ message: "Felhasználó sikeresen törölve." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Hiba a felhasználó törlésekor." });
  }
};

export const banUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { role: "" },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található." });
    }

    res.status(200).json({
      message: "Felhasználó sikeresen letiltva.",
      data: user,
    });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ error: "Hiba a felhasználó letiltásakor." });
  }
};




export const getAllInstructors = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    let filter: any = {};

    if (status) {
      filter.approvalStatus = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const instructors = await Instructor.find(filter)
      .populate("schools", "name")
      .populate("categories", "name")
      .sort({ createdAt: -1 });

    const total = await Instructor.countDocuments(filter);

    res.status(200).json({
      instructors,
      total,
    });
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({ error: "Hiba az oktatók lekérésekor." });
  }
};

export const getInstructorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const instructor = await Instructor.findById(id)
      .populate("schools", "name")
      .populate("categories", "name")
      .populate("students", "name email");

    if (!instructor) {
      return res.status(404).json({ error: "Oktató nem található." });
    }

    res.status(200).json(instructor);
  } catch (error) {
    console.error("Error fetching instructor:", error);
    res.status(500).json({ error: "Hiba az oktató lekérésekor." });
  }
};

export const approveInstructor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const instructor = await Instructor.findByIdAndUpdate(
      id,
      { approvalStatus: "approved", isVerified: true },
      { new: true },
    ).populate("schools", "name");

    if (!instructor) {
      return res.status(404).json({ error: "Oktató nem található." });
    }

    res.status(200).json({
      message: "Oktató sikeresen jóváhagyva.",
      data: instructor,
    });
  } catch (error) {
    console.error("Error approving instructor:", error);
    res.status(500).json({ error: "Hiba az oktató jóváhagyásakor." });
  }
};

export const rejectInstructor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: "Az elutasítás oka kötelező." });
    }

    const instructor = await Instructor.findByIdAndUpdate(
      id,
      { approvalStatus: "rejected", rejectionReason: reason },
      { new: true },
    );

    if (!instructor) {
      return res.status(404).json({ error: "Oktató nem található." });
    }

    res.status(200).json({
      message: "Oktató sikeresen elutasítva.",
      data: instructor,
    });
  } catch (error) {
    console.error("Error rejecting instructor:", error);
    res.status(500).json({ error: "Hiba az oktató elutasításakor." });
  }
};

export const deleteInstructor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const instructor = await Instructor.findByIdAndDelete(id);

    if (!instructor) {
      return res.status(404).json({ error: "Oktató nem található." });
    }

    res.status(200).json({ message: "Oktató sikeresen törölve." });
  } catch (error) {
    console.error("Error deleting instructor:", error);
    res.status(500).json({ error: "Hiba az oktató törlésekor." });
  }
};




export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const { status, search, limit = 10, page = 1 } = req.query;

    let filter: any = {};

    if (status) {
      filter.approvalStatus = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Rating.find(filter)
      .populate("user", "name email")
      .populate("instructor", "name")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Rating.countDocuments(filter);

    const mappedReviews = reviews.map((r: any) => ({
      ...r.toObject(),
      authorName: r.user?.name || "Ismeretlen",
      instructorName: r.instructor?.name || "Ismeretlen",
      status: r.approvalStatus,
    }));

    res.status(200).json({
      reviews: mappedReviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Hiba az értékelések lekérésekor." });
  }
};

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await Rating.findById(id)
      .populate("user", "name email")
      .populate("instructor", "name");

    if (!review) {
      return res.status(404).json({ error: "Értékelés nem található." });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: "Hiba az értékelés lekérésekor." });
  }
};

export const approveReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await Rating.findByIdAndUpdate(
      id,
      { approvalStatus: "approved" },
      { new: true },
    )
      .populate("user", "name email")
      .populate("instructor", "name");

    if (!review) {
      return res.status(404).json({ error: "Értékelés nem található." });
    }

    res.status(200).json({
      message: "Értékelés sikeresen jóváhagyva.",
      data: review,
    });
  } catch (error) {
    console.error("Error approving review:", error);
    res.status(500).json({ error: "Hiba az értékelés jóváhagyásakor." });
  }
};

export const rejectReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: "Az elutasítás oka kötelező." });
    }

    const review = await Rating.findByIdAndUpdate(
      id,
      { approvalStatus: "rejected", rejectionReason: reason },
      { new: true },
    );

    if (!review) {
      return res.status(404).json({ error: "Értékelés nem található." });
    }

    res.status(200).json({
      message: "Értékelés sikeresen elutasítva.",
      data: review,
    });
  } catch (error) {
    console.error("Error rejecting review:", error);
    res.status(500).json({ error: "Hiba az értékelés elutasításakor." });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await Rating.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ error: "Értékelés nem található." });
    }

    res.status(200).json({ message: "Értékelés sikeresen törölve." });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Hiba az értékelés törlésekor." });
  }
};




export const getAllReports = async (req: Request, res: Response) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;

    let filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const reportsDb = await Report.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Report.countDocuments(filter);

    // Map to frontend expected format
    const mappedReports = reportsDb.map((r: any) => ({
      _id: r._id,
      status: r.status === "open" ? "pending" : r.status,
      reason: r.description,
      reportedBy: r.user ? r.user.name : r.email || "Anonymus",
      type: r.category,
      priority: r.category === "Biztonsági probléma" ? "high" : "medium",
      createdAt: r.createdAt,
    }));

    res.status(200).json({
      reports: mappedReports,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Hiba a jelentések lekérésekor." });
  }
};

export const resolveReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    const newStatus = action === "dismiss" ? "closed" : "resolved";

    const report = await Report.findByIdAndUpdate(
      id,
      {
        status: newStatus,
        resolution: reason || `Kezelve: ${action}`,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Jelentés sikeresen feldolgozva.",
      data: report,
    });
  } catch (error) {
    console.error("Error resolving report:", error);
    res.status(500).json({ error: "Hiba a jelentés feldolgozásakor." });
  }
};




export const getSystemSettings = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      settings: {
        maintenanceMode: false,
        requireEmailVerification: true,
        requireInstructorApproval: true,
        reviewApprovalRequired: true,
        maxUsersPerDay: 1000,
        maxInstructorsPerDay: 50,
      },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Hiba a beállítások lekérésekor." });
  }
};

export const updateSystemSettings = async (req: Request, res: Response) => {
  try {
    const { settings } = req.body;

    // TODO: Implement actual settings storage in database
    res.status(200).json({
      message: "Beállítások sikeresen frissítve.",
      settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Hiba a beállítások frissítésekor." });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInstructors = await Instructor.countDocuments();
    const totalReviews = await Rating.countDocuments();
    const pendingInstructors = await Instructor.countDocuments({
      approvalStatus: "pending",
    });
    const pendingReviews = await Rating.countDocuments({
      approvalStatus: "pending",
    });

    res.status(200).json({
      data: {
        totalUsers,
        totalInstructors,
        totalReviews,
        pendingInstructors,
        pendingReviews,
        pendingReports: await Report.countDocuments({ status: "open" }),
        approvedInstructors: await Instructor.countDocuments({
          approvalStatus: "approved",
        }),
        approvedReviews: await Rating.countDocuments({
          approvalStatus: "approved",
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Hiba az analitika lekérésekor." });
  }
};
