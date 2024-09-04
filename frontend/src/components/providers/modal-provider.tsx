"use client";

import { useEffect, useState } from "react";
import AddCategoryModal from "../modals/add-category-modal";
import DrawerSheet from "../drawer-sheet";

export const ModalProvider = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <AddCategoryModal />
      <DrawerSheet />
    </>
  );
};
