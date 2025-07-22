import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import NavSidebar, { type NavSidebarProps } from "./NavSidebar";

type HeaderProps = Pick<NavSidebarProps, "onNavItemClick" | "activeNavItem">;

function Header(props: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const toggleDrawer = (newOpen: boolean) => {
    setIsDrawerOpen(newOpen);
  };

  const onCloseDrawer = useCallback(() => toggleDrawer(false), []);

  return (
    <Paper sx={{ position: "relative", zIndex: 10 }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Interactive Map
            </Typography>

            <NavSidebar
              onClose={onCloseDrawer}
              isDrawerOpen={isDrawerOpen}
              {...props}
            />
          </Toolbar>
        </AppBar>
      </Box>
    </Paper>
  );
}

export default Header;
