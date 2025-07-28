# Install if needed
install.packages("ggplot2")
install.packages("maps")

# Load libraries
library(ggplot2)
library(maps)

# Get world map data
world_map <- map_data("world")

# Plot it
ggplot(world_map, aes(x = long, y = lat, group = group)) +
  geom_polygon(fill = "lightblue", color = "white") +
  theme_minimal() +
  labs(title = "Test Plot: World Map")

# Export it here
ggsave("world_map.png", width = 10, height = 6)
    geom_ribbon(stat="summary",aes(ymin=0,ymax=gaze), alpha=0.2) +
    facet_wrap(~focus, scales="free_y") +
    labs(x="Time (ms)", y="Gaze (px)", title="Gaze Patterns Over Time") +
    theme_minimal() +
    theme(legend.position="bottom")

    