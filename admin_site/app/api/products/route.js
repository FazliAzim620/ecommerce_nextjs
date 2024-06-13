import clientPromise from "@/lib/db";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/model/Product";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
export async function POST(request) {
  mongooseConnect();
  const { _id, title, description, price,images, properties } = await request.json();
//   const images = [{ 
//     objUrl: "blob:http://localhost:3000/710341e2-ecaa-4e66-9d5a-5fefbdbb9233",
// pathurl: "public\\uploads\\1718266683330_image_(2).png"
//    }];
  if (_id) {
    const result = await Product.findByIdAndUpdate(
      _id,
      { title, description, price, properties },
      {
        new: true,
      }
    );
    if (result) {
      return NextResponse.json({ product: result });
    } else {
      return NextResponse.json({ error: "Product not found" });
    }
  } else {
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      properties: { id: 1, name: "properties" },
    });

    return NextResponse.json({
      products: {
        productDoc,
      },
    });
  }
}
// ---------------------------------- get products and single product
export async function GET(request) {
  mongooseConnect();
  const { searchParams } = new URL(request.url); // Extract searchParams from request URL
  const id = searchParams.get("id");

  try {
    if (id) {
      const product = await Product.findById(id);
      if (product) {
        return NextResponse.json({
          product,
        });
      }
    } else {
      const products = await Product.find();
      return NextResponse.json({
        products,
      });
    }
  } catch (error) {
    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}
// ---------------------------------- delete product

export async function DELETE(request) {
  try {
    await mongooseConnect();
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("id");

    if (!_id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find the product by its ID
    const product = await Product.findById(_id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get the image paths
    const imagePaths = product.images.map(img => {
      if (img.pathurl) {
        // Join with 'public/uploads' directory
        return path.join(process.cwd(), 'public', 'uploads', path.basename(img.pathurl));
      }
      return null;
    }).filter(Boolean);

    // Delete the product from the database
    await Product.findByIdAndDelete(_id);

    // Delete the images from the local filesystem
    for (const imagePath of imagePaths) {
      try {
        await fs.unlink(imagePath);
        console.log(`Successfully deleted image at ${imagePath}`);
      } catch (error) {
        console.error(`Failed to delete image at ${imagePath}`, error);
      }
    }

    return NextResponse.json({ message: "Product and images deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}