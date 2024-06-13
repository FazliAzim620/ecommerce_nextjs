"use client";
import { DeleteIcon, EditIcon } from "@/components/Icons";
import ImageDisplay from "@/components/ImageDisplay";
import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const page = () => {
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
    try {
      const resp = await axios.get("/api/products");
      if (resp?.status === 200) {
        setProducts(resp?.data?.products);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);
  console.log("products", products);
  return (
    <Layout>
      <Link className="btn-primary" href={"/products/new"}>
        Add new product
      </Link>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Product name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.title}</td>

              <td>
                <div className="flex gap-1 ">
                  {product?.images?.map((image, index) => (
                    <ImageDisplay
                      key={index}
                      pathurl={`/uploads/${image?.pathurl}`}
                    />
                  ))}
                </div>
              </td>
              <td>
                <Link
                  className="btn-default"
                  href={"/products/edit/" + product._id}
                >
                  <EditIcon />
                  Edit
                </Link>
                <Link
                  className="btn-red"
                  href={"/products/delete/" + product._id}
                >
                  <DeleteIcon />
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default page;
