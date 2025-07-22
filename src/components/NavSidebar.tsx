import { Draw } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { TMapFeature } from "../App";

export interface NavSidebarProps {
  isDrawerOpen: boolean;
  onClose: () => void;
  onNavItemClick: (updatedActiveFeature: TMapFeature) => void;
  activeNavItem?: TMapFeature;
}

function NavSidebar({
  isDrawerOpen,
  onClose,
  onNavItemClick,
  activeNavItem,
}: NavSidebarProps) {
  const isMenuItemActive = (clickedMenuItem: TMapFeature) => {
    return clickedMenuItem === activeNavItem;
  };

  return (
    <Drawer open={isDrawerOpen} onClose={onClose}>
      <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
        <List>
          <ListItem key={"draw-polygons"} disablePadding>
            <ListItemButton
              onClick={() => onNavItemClick("DRAW_POLYGON")}
              sx={{
                color: isMenuItemActive("DRAW_POLYGON")
                  ? "secondary.main"
                  : "primary.main",
                "& .MuiListItemIcon-root": {
                  color: "inherit",
                },
                "& .MuiListItemText-primary": {
                  color: "inherit",
                },
              }}
            >
              <ListItemIcon>
                <Draw />
              </ListItemIcon>
              <ListItemText primary={"Draw Polygons"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default NavSidebar;
