"use client";
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
import { IconPhone, IconUser } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getUserData, SignOut } from "@/lib/actions/user.action";

const Profile = ({ setisLogin }: { setisLogin?: (id: boolean) => void }) => {
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // Fetch user data using React Query
  const {
    data: userData,
    isLoading,
    isFetched,
    isError,
  } = useQuery({ queryKey: ["userData"], queryFn: () => getUserData() });
  const [userName, setname] = useState("Guest");
  const [userEmail, setemail] = useState("guest@example.com");
  useEffect(() => {
    setname(userData?.name || "Guest");
    setemail(userData?.phone || "0123456789");
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
          alt={`${userName}`}
          sx={{
            width: 35,
            height: 35,
            color: "black",
            bgcolor: "#FAF3E0",
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Profile Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl2}
        keepMounted
        className="bg-black/20 text-white"
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
            background: "#1E3A8A",
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} color={"white"} />
          </ListItemIcon>
          <ListItemText primary={userName} className="text-white" />{" "}
          {/* Display user name */}
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconPhone width={20} color={"white"} />
          </ListItemIcon>
          <ListItemText primary={userEmail} className="text-white" />{" "}
          {/* Display user email */}
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button
            href="/login"
            variant="outlined"
            className="bg-[#ffffff]  hover:bg-[#ffffff90] text-gray-900 font-bold border-gray-900 border shadow-md cursor-pointer"
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
    </Box>
  );
};

export default Profile;
