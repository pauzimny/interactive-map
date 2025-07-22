import type { ReactNode } from "react";
import Draw from "@mui/icons-material/Draw";
import List from "@mui/material/List";
import FileUpload from "@mui/icons-material/FileUpload";
import Search from "@mui/icons-material/Search";
import TableView from "@mui/icons-material/TableView";
import type { NavSidebarProps } from "./NavSidebar";
import type { TMapFeature } from "../App";
import NavItem from "./NavItem";

type NavListProps = Pick<NavSidebarProps, "onNavItemClick" | "activeNavItem">;
type TNavEntry = { id: TMapFeature; label: string; icon: ReactNode };

const navEntriesList: TNavEntry[] = [
  { id: "SEARCH_LOCATION", label: "Search location", icon: <Search /> },
  {
    id: "DRAW",
    label: "Draw Polygons or Lines",
    icon: <Draw />,
  },

  {
    id: "UPLOAD_GEO_JSON",
    label: "Upload GeoJSON",
    icon: <FileUpload />,
  },
  { id: "DISPLAY_TABLE", label: "Display Table", icon: <TableView /> },
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
