const XLSX = require("xlsx");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const generateSummary = require("../services/aiService");
const sendEmail = require("../services/emailService");
const File = require("../models/File");
const Summary = require("../models/Summary");

exports.uploadFile = asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded");
    }

    const filePath = req.file.path;
    const email = req.body.email;
    const userId = req.user ? req.user._id : null;
    const isAuthenticated = !!req.user;

    console.log("📋 Upload received:", {
        fileName: req.file.originalname,
        email: email || "(none)",
        authenticated: isAuthenticated,
        bodyKeys: Object.keys(req.body),
    });

    try {
        // 1. Parse the uploaded file (always — no auth dependency)
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        // 2. Generate AI summary (always — no auth dependency)
        const summaryText = await generateSummary(data);

        // 3. Build the response object
        const response = {
            message: "Summary generated successfully",
            summaryText: summaryText,
            fileName: req.file.originalname,
            savedToHistory: false,
            emailSent: false,
        };

        // 4. If authenticated user → save File + Summary to database
        if (isAuthenticated) {
            const savedFile = await File.create({
                userId,
                originalName: req.file.originalname,
                storageUrl: filePath,
                mimeType: req.file.mimetype,
                sizeBytes: req.file.size
            });

            const savedSummary = await Summary.create({
                userId,
                fileId: savedFile._id,
                summaryText: summaryText,
                status: "COMPLETED"
            });

            response.savedToHistory = true;
            response.summaryId = savedSummary._id;
            response.fileId = savedFile._id;
        }

        // 5. If email provided → send the report via email
        if (email) {
            try {
                await sendEmail(email, summaryText, req.file.originalname);
                response.emailSent = true;
            } catch (err) {
                console.error("Failed to send email, but summary generated:", err.message);
                response.emailSent = false;
                response.emailError = "Email delivery failed. Your summary is still available above.";
            }
        }

        // 6. Send the response
        res.status(201).json(response);
    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        res.status(500);
        throw new Error(error.message || "Failed to process file");
    } finally {
        // 7. Clean up the temporary uploaded file
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (cleanupErr) {
            console.error("Failed to clean up temp file:", cleanupErr.message);
        }
    }
});