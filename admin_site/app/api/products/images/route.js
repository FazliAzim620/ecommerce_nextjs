// pages/api/upload.js

import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req, res) => {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
  const filePath = path.join("public/uploads", filename);

  try {
    await writeFile(path.join(process.cwd(), filePath), buffer);

    return NextResponse.json({ message: "Success", filePath:filename, status: 201 });
  } catch (error) {
    console.log("Error occurred:", error);
    return NextResponse.json({ message: "Failed", status: 500 });
  }
};
