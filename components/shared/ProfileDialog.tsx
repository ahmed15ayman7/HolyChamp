import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema using Zod
const updateUserSchema = z.object({
  id: z.number().min(1, " مطلوب"),
  name: z.string().min(1, "الاسم مطلوب"),
  phone: z.string().min(3, "رقم الهاتف يجب أن يكون مكونًا من 10 أرقام"),
  region: z.string().min(1, "المنطقة مطلوبة"),
  password: z
    .string()
    .min(3, "كلمة المرور يجب أن تكون مكونة من 6 أحرف على الأقل"),
});
type UpdateUserSchema = z.infer<typeof updateUserSchema>;
interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    id: number;
    name: string;
    phone: string;
    region: string;
    password: string;
  }) => void;
  initialData: {
    id: number;
    name: string;
    phone: string;
    region: string;
    password: string;
  };
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
    resolver: zodResolver(updateUserSchema),
  });

  const onSubmit = (data: UpdateUserSchema) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>تعديل الملف الشخصي</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="id"
            control={control}
            render={({ field }) => <input {...field} type="hidden" />}
          />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="الاسم"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="رقم الهاتف"
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            )}
          />
          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="المنطقة"
                fullWidth
                error={!!errors.region}
                helperText={errors.region?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="كلمة المرور"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <DialogActions>
            <Button onClick={onClose}>إلغاء</Button>
            <Button type="submit" variant="contained" color="primary">
              حفظ
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
