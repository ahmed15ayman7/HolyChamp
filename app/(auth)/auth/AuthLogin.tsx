import React from "react";
import { Box, Typography, Button, Stack, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

// مخطط التحقق باستخدام Zod
const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "اسم المستخدم مطلوب")
    .nonempty("لا يمكن ترك اسم المستخدم فارغاً"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const router = useRouter();

  // تكامل zod مع react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "", // Ensure email has a default value
      password: "", // Ensure password has a default value
    },
  });

  const handleLogin = async (values: LoginFormInputs) => {
    const loadingToastId = toast.loading("جاري تسجيل الدخول...");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        const data = await res.json();

        // if (data.isApproved) {
        toast.update(loadingToastId, {
          render: "تم تسجيل الدخول بنجاح!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        if (data.role === "admin") {
          console.log("admin");
          router.push("/admin");
        } else {
          console.log("user");
          router.push("/");
        }
        // } else {
        //   toast.update(loadingToastId, {
        //     render: "حسابك قيد الانتظار للموافقة. يرجى الانتظار.",
        //     type: "info",
        //     isLoading: false,
        //     autoClose: 3000,
        //   });
        // }
      } else {
        const data = await res.json();
        toast.update(loadingToastId, {
          render: data.message || "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(loadingToastId, {
        render:
          (error as { message: string })?.message ||
          "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <form onSubmit={handleSubmit(handleLogin)}>
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="phone"
              mb="5px"
            >
              رقم الهاتف
            </Typography>
            {/* استخدام Controller للتحكم في المدخل */}
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </Box>
          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              الرقم السري
            </Typography>
            {/* استخدام Controller للتحكم في المدخل */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  variant="outlined"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          </Box>

          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >
            {/* Additional components can be added here */}
          </Stack>
        </Stack>
        <Box>
          <Button
            className="bg-[#a5960a] hover:bg-[#cec258] text-white font-bold border-gray-900 border shadow-md cursor-pointer"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            تسجيل الدخول
          </Button>
        </Box>
      </form>
      {subtitle}
    </>
  );
};

export default AuthLogin;
