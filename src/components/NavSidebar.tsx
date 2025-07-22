import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import type { TMapFeature } from "../App";
import NavList from "./NavList";

export interface NavSidebarProps {
  isDrawerOpen: boolean;
  onClose: () => void;
  onNavItemClick: (updatedActiveFeature: TMapFeature) => void;
  activeNavItem?: TMapFeature;
}

function NavSidebar({ isDrawerOpen, onClose, ...rest }: NavSidebarProps) {
  return (
    <Drawer open={isDrawerOpen} onClose={onClose}>
      <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
        <NavList {...rest} />
      </Box>
    </Drawer>
  );
}

export default NavSidebar;
