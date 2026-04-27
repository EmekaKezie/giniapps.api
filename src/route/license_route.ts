import { Request, Response, Router } from "express";
import { licenseGenerator } from "../utils/licenseGenerator";
import { getLicenseData, licenseValidator } from "../utils/licenseValidator";

const router = Router();

router.post("/generate", (req: Request, res: Response) => {
  const { userId, plan, days } = req.body;
  const license = licenseGenerator(userId, plan, days || 30);
  res.json({ license });
});

// 2. Validate the license (Returns true/false)
router.post("/verify", (req: Request, res: Response) => {
  const { license } = req.body;
  const isValid = licenseValidator(license);
  res.json({ isValid });
});

// 3. Unpack the license (Returns the real object values)
router.post("/inspect", (req: Request, res: Response) => {
  const { license } = req.body;

  // First validate it so people can't feed it fake objects
  if (!licenseValidator(license)) {
    return res.status(403).json({ error: "Invalid License" });
  }

  const data = getLicenseData(license);
  res.json({ data });
});

export default router;
