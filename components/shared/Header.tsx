"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Profile from "./Profile";
import { getUserData } from "@/lib/actions/user.action";
import { User } from "@prisma/client";

interface NavItem {
  title: string;
  href: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User>();
  const [drawerOpen, setDrawerOpen] = useState(false); // For Drawer on mobile
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Check for mobile screen size

  const getUser = async () => {
    const userData = await getUserData();
    setUser(userData);
  };

  const navItems1: NavItem[] = [
    { title: "الرئيسية", href: "/" },
    { title: "التقارير القرائية", href: "/reading-reports" },
    { title: "إضافة كتاب", href: "/add-book" },
    { title: "فليتنافس المتنافسون", href: "/competitions" },
    { title: "سموط المعارف", href: "/articles" },
  ];

  const navItems2: NavItem[] = [
    { title: "الرئيسية", href: "/" },
    { title: "الادارة", href: "/admin" },
    { title: "المقالات", href: "/articles-admin" },
    { title: " المقالات المعلقة", href: "/articles-pending" },
  ];

  useEffect(() => {
    getUser();
  }, []);

  const navItems: NavItem[] =
    user && user.role === "admin" ? navItems2 : navItems1;

  return (
    <AppBar position="static" sx={{ backgroundColor: "#a5960a" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" passHref>
          <Tooltip title="الصفحة الرئيسية" arrow>
            <IconButton>
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div
                  className="absolute border-8 border-transparent rounded-full w-full h-full 
                        from-[#FFD700] via-[#FF8C00] to-[#FF6347] bg-gradient-to-r"
                ></div>
                <img
                  src="/images/الشعار فقط.svg"
                  alt="Logo"
                  className="w-16 h-16 z-10"
                />
              </div>
            </IconButton>
          </Tooltip>
        </Link>

        {/* Navigation Links or Drawer for Mobile */}
        {isMobile ? (
          <>
            <div className="flex gap-2">
              <Profile />
              <IconButton
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </div>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box
                sx={{
                  width: 250,
                  backgroundColor: "#a5960a",
                  color: "#ffffff",
                  height: "100%",
                }}
              >
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  sx={{ color: "#ffffff", m: 1 }}
                >
                  <CloseIcon />
                </IconButton>
                <List>
                  {navItems.map((item) => (
                    <ListItem
                      key={item.title}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Link href={item.href} passHref>
                        <ListItemText
                          primary={item.title}
                          sx={{ color: "#ffffff", textAlign: "right" }}
                        />
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Tooltip title={item.title} arrow>
                  <Box
                    component="p"
                    sx={{
                      color: "#ffffff",
                      textDecoration: "none",
                      fontSize: "1rem",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {item.title}
                  </Box>
                </Tooltip>
              </Link>
            ))}
            <Profile />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
