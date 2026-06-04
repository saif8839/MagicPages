import fetch from "node-fetch";
import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import uploadToCloudinary from "../middlewares/cloudinaryMiddlewares.js";
import GenImage from "../models/genImageModel.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const fetchImageAsBase64 = async (imageUrl) => {
    const response = await fetch(imageUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType =
        response.headers.get("content-type") || "image/jpeg";

    const buffer = await response.buffer();

    return {
        base64: buffer.toString("base64"),
        mimeType: contentType.split(";")[0],
    };
};

const generateImage = async (imageURL, prompt) => {
    try {
        console.log("Fetching image...");

        const { mimeType, base64 } =
            await fetchImageAsBase64(imageURL);

        console.log("Sending request to Gemini...");

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [
                {
                    parts: [
                        {
                            text: prompt,
                        },
                        {
                            inlineData: {
                                mimeType,
                                data: base64,
                            },
                        },
                    ],
                },
            ],
            config: {
                responseModalities: ["IMAGE", "TEXT"],
            },
        });

        // console.log(
        //     "Gemini Response:",
        //     JSON.stringify(response, null, 2)
        // );

        const parts =
            response?.candidates?.[0]?.content?.parts || [];

        const imagePart = parts.find(
            (part) => part.inlineData
        );

        if (!imagePart) {
            throw new Error(
                "Gemini did not return an image."
            );
        }

        const extension =
            imagePart.inlineData.mimeType?.split("/")[1] ||
            "png";

        const filename = `styled_${Date.now()}.${extension}`;

        const filePath = path.join(
            UPLOADS_DIR,
            filename
        );

        const imageBuffer = Buffer.from(
            imagePart.inlineData.data,
            "base64"
        );

        fs.writeFileSync(filePath, imageBuffer);

        console.log("Uploading to Cloudinary...");

        const uploadedResult =
            await uploadToCloudinary(filePath);

        fs.unlinkSync(filePath);

        if (!uploadedResult?.secure_url) {
            throw new Error(
                "Cloudinary upload failed."
            );
        }

        return uploadedResult.secure_url;
    } catch (error) {
        console.error("Generate Image Error:", error);
        throw new Error(error.message);
    }
};

const transformImage = async (req, res) => {
    try {
        const { imageURL, prompt } = req.body;

        if (!imageURL || !prompt) {
            return res.status(400).json({
                message:
                    "Please provide imageURL and prompt.",
            });
        }

        const userId = req.user._id;

        const generatedImageURL =
            await generateImage(imageURL, prompt);

        const image = await GenImage.create({
            user: userId,
            imageURL: generatedImageURL,
        });

        await image.populate("user");

        res.status(201).json({
            success: true,
            image,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export default {
    transformImage,
};