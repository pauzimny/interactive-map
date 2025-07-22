import type { ReactNode } from "react";
import Draw from "@mui/icons-material/Draw";
import List from "@mui/material/List";
import type { NavSidebarProps } from "./NavSidebar";
import type { TMapFeature } from "../App";
import NavItem from "./NavItem";
import FileUpload from "@mui/icons-material/FileUpload";

type NavListProps = Pick<NavSidebarProps, "onNavItemClick" | "activeNavItem">;
type TNavEntry = { id: TMapFeature; label: string; icon: ReactNode };

const navEntriesList: TNavEntry[] = [
  {
    id: "DRAW_POLYGON",
    label: "Draw Polygons",
    icon: <Draw />,
  },

  {
    id: "UPLOAD_GEO_JSON",
    label: "Upload GeoJSON",
    icon: <FileUpload />,
  },
];

function NavList({ onNavItemClick, activeNavItem }: NavListProps) {
  const checkIsMenuItemActive = (clickedMenuItem: TMapFeature) => {
    return clickedMenuItem === activeNavItem;
  };

  return (
    <List>
      {navEntriesList.map((entry) => (
        <NavItem
          key={entry.id}
          {...entry}
          checkIsMenuItemActive={checkIsMenuItemActive}
          onNavItemClick={onNavItemClick}
        />
      ))}
    </List>
  );
}

export default NavList;
