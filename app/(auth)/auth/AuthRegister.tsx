import React, { useState } from "react";
import {
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import axios from "axios";

// مخطط التحقق باستخدام Zod
const registerSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").nonempty("لا يمكن ترك الاسم فارغاً"),
  title: z.string().optional(),
  phone: z.string().min(2, "يجب إدخال رقم الهاتف"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  gender: z.enum(["male", "female"], { required_error: "الجنس مطلوب" }),
  region: z.string().nonempty("المنطقة مطلوبة"),
  readingChallenge: z.enum(["yes", "no"], { message: "يرجي الإجابه" }),
  isPreviousParticipant: z.enum(["yes", "no"], { message: "يرجي الإجابه" }),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

interface RegisterType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
  isManage?: boolean;
  setIsFe?: (i: number) => void;
}

const AuthRegister = ({
  title,
  subtitle,
  subtext,
  isManage,
  setIsFe,
}: RegisterType) => {
  const router = useRouter();
  let [isFemale, setIsFemale] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      title: "",
      phone: "",
      password: "",
      gender: "male",
      region: "",
      readingChallenge: "no",
      isPreviousParticipant: "no",
    },
  });

  const handleRegister = async (values: RegisterFormInputs) => {
    const loadingToastId = toast.loading("جارٍ تسجيل المستخدم...");

    try {
      const res = await axios.post("/api/register", values);

      if (res.status === 201) {
        toast.update(loadingToastId, {
          render: "تم التسجيل بنجاح!    .",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        reset();
        !isManage && router.push("/login");
        setIsFe && setIsFe(Math.random());
      } else if (res.status === 202) {
        toast.update(loadingToastId, {
          render: res.data?.message || "فشل التسجيل. يرجى المحاولة مرة أخرى.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(loadingToastId, {
        render:
          (error as { message: string })?.message ||
          "فشل التسجيل. يرجى المحاولة مرة أخرى.",
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

      <form onSubmit={handleSubmit(handleRegister)} className={"w-full "}>
        <Stack mb={3} className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
          <div>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="gender"
              mb="5px"
              mt="25px"
            >
              الجنس
            </Typography>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>الجنس</InputLabel>
                  <Select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      e.target.value === "female"
                        ? setIsFemale(true)
                        : setIsFemale(false);
                    }}
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value="male">ذكر</MenuItem>
                    <MenuItem value="female">أنثى</MenuItem>
                  </Select>
                  <FormHelperText>{errors.gender?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </div>
          <div>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor={isFemale ? "title" : "name"}
              mb="5px"
            >
              الاسم
            </Typography>
            <Controller
              name={isFemale ? "title" : "name"}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </div>
          {isFemale && (
            <div>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="name"
                mb="5px"
              >
                اللقب
              </Typography>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </div>
          )}
          <div>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="region"
              mb="5px"
              mt="25px"
            >
              المنطقة
            </Typography>
            <Controller
              name="region"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  error={!!errors.region}
                  helperText={errors.region?.message}
                />
              )}
            />
          </div>
          <div className={isFemale ? "" : " col-span-2"}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="email"
              mb="5px"
              mt="25px"
            >
              رقم الهاتف
            </Typography>
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
          </div>
          <div>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
              mt="25px"
            >
              الرقم السري
            </Typography>
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
          </div>

          <div className=" col-span-2">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="readingChallenge"
              mb="5px"
              mt="25px"
            >
              التحدي القرائي؟
            </Typography>
            <Controller
              name="readingChallenge"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.readingChallenge}>
                  <Select {...field} variant="outlined">
                    <MenuItem value={"yes"}>نعم</MenuItem>
                    <MenuItem value={"no"}>لا</MenuItem>
                  </Select>
                  <FormHelperText>
                    {errors.readingChallenge?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </div>
          <div>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="isPreviousParticipant"
              mb="5px"
              mt="25px"
            >
              هل شاركت من قبل؟
            </Typography>
            <Controller
              name="isPreviousParticipant"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.isPreviousParticipant}>
                  <Select {...field} variant="outlined">
                    <MenuItem value={"yes"}>نعم</MenuItem>
                    <MenuItem value={"no"}>لا</MenuItem>
                  </Select>
                  <FormHelperText>
                    {errors.isPreviousParticipant?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </div>
        </Stack>
        <Button
          className="bg-[#a5960a] hover:bg-[#cec258] text-white font-bold border-gray-900 border shadow-md cursor-pointer"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
        >
          تسجيل
        </Button>
      </form>
      {subtitle}
    </>
  );
};

export default AuthRegister;
