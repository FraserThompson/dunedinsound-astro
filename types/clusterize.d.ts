declare module "clusterize.js" {
  interface ClusterizeOptions {
    rows?: string[];                 // Array of HTML strings for rows
    scrollId?: string;               // ID of the scrolling container
    contentId?: string;              // ID of the content container
    tag?: string;                    // Tag name used for rows ("tr", "li", "div", etc.)
    rows_in_block?: number;          // How many rows are rendered per block
    blocks_in_cluster?: number;      // How many blocks are in a cluster
    no_data_class?: string;          // CSS class applied when no data
    no_data_text?: string;           // Text displayed when no rows
    keep_parity?: boolean;           // Keeps odd/even classes consistent
    callbacks?: {
      clusterWillChange?: () => void;
      clusterChanged?: () => void;
    };
  }

  class Clusterize {
    constructor(options: ClusterizeOptions);

    /**
     * Replace the list of rows with a new list.
     */
    update(rows: string[]): void;

    /**
     * Clear all rows (equivalent to update([])).
     */
    clear(): void;

    /**
     * Remove event listeners and internal references.
     */
    destroy(clean?: boolean): void;
  }

  export = Clusterize;
}
