// components/AdForm.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import axios from "axios";
import PencilIcon from "../cards/PencilIcon";
import { Dialog } from "@headlessui/react";
import "react-image-crop/dist/ReactCrop.css";
import Modal from "@/components/cards/Modal";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { z } from "zod";

export const homeSchema = z.object({
  url: z.string().url({ message: "Invalid URL" }).optional(),
  text: z.string().optional(),
});

export type HomeFormData = z.infer<typeof homeSchema>;
export default function HomeForm({ refetch }: { refetch: () => void }) {
  const avatarUrl = useRef("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<HomeFormData>({
    resolver: zodResolver(homeSchema),
  });

  const updateAvatar = (imgSrc: string) => {
    avatarUrl.current = imgSrc;
    setValue("url", imgSrc);
  };

  const onSubmit = async (data: HomeFormData) => {
    const loadingToastId = toast.loading("جاري التعديل..."); // Show loading toast

    try {
      await axios.put("/api/home", { id: 1, ...data });
      toast.update(loadingToastId, {
        render: "تم تعديل الصفه الرئيسيه بنجاح ",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      reset();
      updateAvatar("");
      refetch();
    } catch (error) {
      toast.update(loadingToastId, {
        render: "خطا في تعديل الصفحه الرئسيه",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <motion.div
      className="max-w-lg mx-auto p-6 mb-4 rounded-lg shadow-md"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl text-gold-500 font-bold mb-4">
        {" "}
        تعديل الصفحة الرئيسية
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gold-500">العنوان</label>
          <input
            {...register("text")}
            type="text"
            className="w-full border text-gray-900 border-gray-300 p-2 rounded"
          />
          {errors.text && <p className="text-red-600">{errors.text.message}</p>}
        </div>

        <div className="mb-4 relative">
          {avatarUrl.current && (
            <div className="mt-4">
              <p>Preview:</p>
              <img
                src={avatarUrl.current}
                alt="Avatar"
                className="w-[400px] h-[400px] rounded-xl border-2 border-gold-500"
              />
            </div>
          )}
          <button
            className="flex items-center gap-3 -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full px-5 border-gray-600 bg-[#a5960a] text-white hover:bg-[#cec258] transition"
            title="Change photo"
            onClick={(e) => {
              e.preventDefault();
              setIsDialogOpen(true);
            }}
          >
            {!avatarUrl.current ? "تحميل صوره" : "تعديل الصوره"} <PencilIcon />
          </button>
          {errors.url && <p className="text-red-600">{errors.url.message}</p>}
        </div>

        {/* Cropper Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          className="relative z-[10000]"
        >
          <div className="fixed inset-0  bg-opacity-50" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-6 rounded-lg">
              <Modal
                updateAvatar={updateAvatar}
                closeModal={() => setIsDialogOpen(false)}
              />
            </Dialog.Panel>
          </div>
        </Dialog>
        <div className="flex flex-col w-full p-3 items-center">
          <button
            type="submit"
            className="bg-[#a5960a] w-full  text-white px-4 py-2 rounded hover:bg-[#cec258] transition"
          >
            تعديل
          </button>
        </div>
      </form>
    </motion.div>
  );
}
