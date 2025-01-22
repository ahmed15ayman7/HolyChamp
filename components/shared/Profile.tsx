import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { IconPhone, IconUser, IconSettings } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getUserData, SignOut } from "@/lib/actions/user.action";
import ProfileDialog from "./ProfileDialog";
import axios from "axios";

const Profile = ({ setisLogin }: { setisLogin?: (id: boolean) => void }) => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [userData, setUserData] = useState({
    id: 10000000,
    name: "Guest",
    title: "Guest",
    phone: "0123456789",
    region: "",
    password: "",
  });

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSave = async (updatedData: {
    id: number;
    name: string;
    title?: string;
    phone: string;
    region: string;
    password: string;
  }) => {
    try {
      let response = await axios.put("/api/users", updatedData);
      setUserData({
        id: response.data?.id,
        name: response.data?.name,
        title: response.data?.title,
        phone: response.data?.phone,
        password: response.data?.password,
        region: response.data.region,
      });
      handleDialogClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Fetch user data using React Query
  const {
    data: userData2,
    isLoading,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(),
  });
  useEffect(() => {
    console.log("userData2", userData2);

    setUserData({
      id: userData2?.id || 10000,
      name:
        userData2?.gender == "female"
          ? userData2?.title || "لا يوجد اسم"
          : userData2?.name || "Guest",
      phone: userData2?.phone || "0123456789",
      password: "",
      region: userData2?.region,
      title: userData2?.title || "",
    });
    userData && setisLogin && setisLogin(true);
  }, [isLoading]);

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show profile options"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src=""
          alt={`${userData.name}`}
          sx={{
            width: 35,
            height: 35,
            color: "black",
            bgcolor: "#FAF3E0",
          }}
        />
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
            background: "#a5960a",
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} color={"white"} />
          </ListItemIcon>
          <ListItemText className="text-white" primary={userData.name} />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconPhone width={20} color={"white"} />
          </ListItemIcon>
          <ListItemText className="text-white" primary={userData.phone} />
        </MenuItem>
        {!isLoading && userData2 && (
          <MenuItem onClick={handleDialogOpen}>
            <ListItemIcon>
              <IconSettings width={20} color={"white"} />
            </ListItemIcon>
            <ListItemText className="text-white" primary="إعداد الملف الشخصي" />
          </MenuItem>
        )}
        {!isLoading && userData2 && (
          <MenuItem>
            <ListItemIcon>
              <IconSettings width={20} color={"white"} />
            </ListItemIcon>
            <ListItemText
              className="text-white"
              primary={`الفوائت ${userData2.missedPages || 0}`}
            />
          </MenuItem>
        )}
        <Box mt={1} py={1} px={2}>
          <Button
            href="/login"
            variant="outlined"
            className="bg-[#ffffff] hover:bg-[#ffffff90] text-gray-900 font-bold border-gray-900 border shadow-md cursor-pointer"
            component={Link}
            onClick={async () => {
              await SignOut();
            }}
            fullWidth
          >
            تسجيل الخروج
          </Button>
        </Box>
      </Menu>
      {!isLoading && userData2 && (
        <ProfileDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          onSave={handleSave}
          initialData={{
            id: userData2?.id || 10000,
            name: userData2?.name || "Guest",
            phone: userData2?.phone || "0123456789",
            password: "",
            gender: userData2?.gender,
            region: userData2?.region,
            title: userData2?.title || "",
          }}
        />
      )}
    </Box>
  );
};

export default Profile;
