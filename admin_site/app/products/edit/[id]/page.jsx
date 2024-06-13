"use client";
import { BackIcon } from "@/components/Icons";
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

const page = ({ params }) => {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  function goBack() {
    router.push("/products");
  }
  const { id } = params;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);

  return (
    <Layout>
      <button onClick={goBack}>
        <BackIcon />
      </button>
      <h1> Edit product</h1>
      {productInfo && <ProductForm productInfo={productInfo?.product} />}
    </Layout>
  );
};

export default page;
