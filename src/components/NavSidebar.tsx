import SentimentSatisfiedAlt from "@mui/icons-material/SentimentSatisfiedAlt";
import TagFaces from "@mui/icons-material/TagFaces";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

interface NavSidebarProps {
  isDrawerOpen: boolean;
  onClose: () => void;
}

function NavSidebar({ isDrawerOpen, onClose }: NavSidebarProps) {
  return (
    <Drawer open={isDrawerOpen} onClose={onClose}>
      <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
        <List>
          {["Feature 1", "Feature 2", "Feature 3"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <TagFaces /> : <SentimentSatisfiedAlt />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default NavSidebar;
