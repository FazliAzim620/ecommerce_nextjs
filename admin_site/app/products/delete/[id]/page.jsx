"use client";
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = ({ params }) => {
  const [productInfo, setProductInfo] = useState();
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
      setProductInfo(response?.data?.product);
    });
  }, [id]);
  async function deleteProduct() {
    try {
      const resp = await axios.delete("/api/products?id=" + id);
      console.log("resp", resp);
      goBack();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout>
      <h1 className="text-center">
        Do you really want to delete &nbsp;&quot;{productInfo?.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-default" onClick={goBack}>
          NO
        </button>
        <button onClick={deleteProduct} className="btn-red">
          Yes
        </button>
      </div>
    </Layout>
  );
};

export default page;
