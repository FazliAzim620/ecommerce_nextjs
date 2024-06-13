"use client";
import { BackIcon } from "@/components/Icons";
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  function goBack() {
    router.push("/products");
  }
  return (
    <Layout>
      <button onClick={goBack}>
        <BackIcon />
      </button>
      <h1>New Product</h1>
      <ProductForm />
    </Layout>
  );
};

export default page;
