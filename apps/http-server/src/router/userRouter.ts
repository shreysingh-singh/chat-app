import { Router, Request, Response } from "express";
import { UserModel } from "../Db/userDb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { RoomModel } from "../Db/roomDb";

const router: Router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      msg: `Required details for signup`,
    });
  }

  try {
    const emailCheck = await UserModel.findOne({ email });

    if (emailCheck) {
      return res.status(409).json({
        msg: `Email already exists`,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      email,
      password: hashPassword,
      firstName,
      lastName,
    });

    return res.status(201).json({
      msg: `Signup successful`,
    });
  } catch (err) {
    return res.status(500).json({
      msg: `Server Error`,
      error: err,
    });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: `Email and password required`,
    });
  }
  try {
    const userCheck = await UserModel.findOne({ email });

    if (!userCheck) {
      return res.status(401).json({
        msg: `Invalid credentials`,
      });
    }
    const hashPassword = await bcrypt.compare(
      password,
      userCheck.password as string,
    );

    if (!hashPassword) {
      return res.status(401).json({
        msg: `Invalid credentials`,
      });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ msg: "Server configuration error" });
    }

    //Token
    const token = jwt.sign({ id: userCheck._id.toString() }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      msg: `Successful signin`,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      msg: `Server error`,
      error: err,
    });
  }
});

router.post(
  "/create-room",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { slug } = req.body;

    if (!slug || typeof slug !== "string") {
      return res.status(400).json({ msg: "Missing or invalid slug" });
    }

    if (!req.userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    try {
      const room = await RoomModel.create({
        slug,
        adminId: req.userId,
      });

      return res.status(201).json({
        msg: `Room created successfully`,
        room,
      });
    } catch (err) {
      return res.status(500).json({ msg: "Failed to create room" });
    }
  },
);

export default router;
