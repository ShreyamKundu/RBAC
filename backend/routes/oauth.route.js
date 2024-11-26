import express from "express";
import passport from "passport";

const router = express.Router();

// Initiates Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handles the Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173", // Client redirect
    failureRedirect: "/auth/login/failed", // Failure redirect
  })
);

// Route to handle login success
router.get("/login/success", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: "Successfully authenticated",
      user: req.user,
      corrId: req.headers["x-correlation-id"], // Example of additional headers
    });
  }
  return res.json({ success: false, message: "Not authenticated" });
});

// Route to handle login failure
router.get("/login/failed", (req, res) => {
  return res.status(401).json({
    success: false,
    message: "Authentication failed",
  });
});



export default router;
