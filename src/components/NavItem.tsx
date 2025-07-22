import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { NavSidebarProps } from "./NavSidebar";
import type { TMapFeature } from "../App";
import type { ReactNode } from "react";

interface NavItemProps {
  id: TMapFeature;
  label: string;
  icon: ReactNode;
  onNavItemClick: NavSidebarProps["onNavItemClick"];
  checkIsMenuItemActive: (clickedMenuItem: TMapFeature) => boolean;
}

function NavItem({
  id,
  label,
  icon,
  onNavItemClick,
  checkIsMenuItemActive,
}: NavItemProps) {
  return (
    <ListItem key={"draw-polygons"} disablePadding>
      <ListItemButton
        onClick={() => onNavItemClick(id)}
        sx={{
          color: checkIsMenuItemActive(id) ? "secondary.main" : "primary.main",
          "& .MuiListItemIcon-root": {
            color: "inherit",
          },
          "& .MuiListItemText-primary": {
            color: "inherit",
          },
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}

export default NavItem;
