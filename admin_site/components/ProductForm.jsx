"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { UploadIcon } from "./Icons";

// import { ReactSortable } from "react-sortablejs";

export default function ProductForm({ productInfo }) {
  const [title, setTitle] = useState(productInfo?.title || "");
  const [description, setDescription] = useState(
    productInfo?.description || ""
  );
  const [category, setCategory] = useState(productInfo?.category || "");
  const [productProperties, setProductProperties] = useState(
    productInfo?.properties || {}
  );
  const [price, setPrice] = useState(productInfo?.price || "");
  const [images, setImages] = useState([]);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      _id: productInfo?._id,
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    const response = await axios.post("/api/products", data);

    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }
  // async function uploadImages(ev) {
  //   const files = ev.target?.files;
  //   if (files?.length > 0) {
  //     setIsUploading(true);
  //     const data = new FormData();
  //     for (const file of files) {
  //       data.append("file", file);
  //     }
  //     const res = await axios.post("/api/products/images", data);
  //     setImages((oldImages) => {
  //       return [...oldImages, ...res.data.links];
  //     });
  //     setIsUploading(false);
  //   }
  // }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      try {
        const res = await axios.post("/api/products/images", data);
        if (res.data.filePath) {
          // Generate object URLs for the files and update the state
          console.log("res.data.filePath", res.data.filePath);
          const uploadedImages = {
            pathurl: res.data.filePath, // Assuming multiple file paths are returned
            objUrl: URL.createObjectURL(files[0]),
          };
          console.log("uploadedImages", uploadedImages);
          setImages((prevImages) => [...images, uploadedImages]);
        }
      } catch (error) {
        console.error("Error uploading images:", error);
      } finally {
        setIsUploading(false);
      }
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }
  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }
  console.log("images", images);
  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }
  console.log("productInfo", productInfo);
  return (
    <form onSubmit={saveProduct}>
      <label>Product name </label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        {!!images?.length &&
          images.map((link) => (
            <div
              key={link}
              className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
            >
              <img src={link?.objUrl} alt="" className="rounded-lg" />
            </div>
          ))}
        {/* <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable> */}
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <UploadIcon />
          <div>Add image</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
